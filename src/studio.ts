// @ts-nocheck
// Shared constants and helpers exported from App.tsx
// so page components can use them without circular imports.

import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL="https://njqfexhltjwpgvctmyaw.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY="sb_publishable_wqRnYf5pnp68Qo6-McfwyA_JNYrh2VC";
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,storageKey:"ms_auth"}
});

export async function authToken(){
  try{ const {data}=await supabase.auth.getSession(); return data?.session?.access_token||""; }
  catch(e){ return ""; }
}
export async function engineAuthHeaders(){
  const t=await authToken();
  const h={"Content-Type":"application/json"};
  if(t) h["Authorization"]="Bearer "+t;
  return h;
}

const DB_NAME="mandastrong_db",DB_VER=1,STORE="clips";
const openDB=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>e.target.result.createObjectStore(STORE,{keyPath:"id"});r.onsuccess=e=>res(e.target.result);r.onerror=rej;});

export const saveClipToDB=async(id,blob,name,type)=>{try{const db=await openDB();const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id,blob,name,type});await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=j;});}catch(e){}};
export const getAllClipsFromDB=async(includeArchived=false)=>{try{const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).getAll();req.onsuccess=()=>{const all=req.result||[];res(includeArchived?all:all.filter(c=>!String((c&&c.id)||"").startsWith("arch_")));};req.onerror=rej;});}catch(e){return[];}};
export const deleteClipFromDB=async(id)=>{try{const db=await openDB();const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(id);await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=j;});}catch(e){}};
export const loadClipFromDB=async(id)=>{try{const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get(id);req.onsuccess=()=>res(req.result);req.onerror=rej;});}catch(e){return null;}};

const getStorageStatus=async()=>{
  try{if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return {used:e.usage||0,quota:e.quota||1,pct:(e.usage||0)/(e.quota||1)};}}catch(e){}
  return {used:0,quota:1,pct:0};
};
export const safeSaveClipToDB=async(id,blob,name,type)=>{
  try{
    const s=await getStorageStatus();
    if(s.pct>0.95){try{const clips=await getAllClipsFromDB();const old=clips.filter(c=>String(c.id).includes("render_final_old"));for(const c of old)await deleteClipFromDB(c.id);}catch(e){}}
    await saveClipToDB(id,blob,name,type);
    return true;
  }catch(e){
    try{await saveClipToDB(id,blob,name,type);return true;}catch(e2){return false;}
  }
};

const ENGINE_URL=SUPABASE_URL+"/functions/v1/generate-video";
const VOICE_URL=SUPABASE_URL+"/functions/v1/generate-voice";
const pickEngineUrl=(d)=>{if(!d||typeof d!=="object")return"";const v=d.url||d.output||d.video||"";return(typeof v==="string"&&v.indexOf("http")===0)?v:"";};

export async function engineCall(body){
  const res=await fetch(ENGINE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify(body)});
  return res.json();
}

export async function engineSpeak(text,meta){
  meta=meta||{};
  const _g=meta.gender||(meta.voice?"":"Female");
  const _o=meta.origin||(meta.voice?"":"British");
  try{
    const res=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({text:String(text||"").slice(0,3500),voice:meta.voice||"",gender:_g,origin:_o,language:meta.language||"",speed:meta.speed||1})});
    let d=await res.json();
    let url=pickEngineUrl(d);
    if(url)return url;
    if(d&&d.id){for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,1500));const p=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({id:d.id})});const pd=await p.json();url=pickEngineUrl(pd);if(url)return url;if(pd&&(pd.status==="failed"||pd.status==="canceled"))return "";}}
  }catch(e){}
  return "";
}

export async function engineRender(prompt,opts){
  opts=opts||{};
  try{
    const body={prompt:String(prompt||"").slice(0,1800),duration:opts.duration||5,aspect_ratio:opts.aspect_ratio||"16:9",cheap_only:true};
    if(opts.image)body.image=opts.image;
    const started=await engineCall(body);
    if(!started||started.error)return "";
    let url=pickEngineUrl(started);
    const pid=started.id;
    if(!url&&!pid)return "";
    for(let i=0;i<100&&!url&&pid;i++){
      await new Promise(r=>setTimeout(r,3000));
      if(opts.onTick)opts.onTick(i);
      const pd=await engineCall({id:pid});
      if(pd&&pd.status==="failed")return "";
      url=pickEngineUrl(pd);
    }
    return url||"";
  }catch(e){return "";}
}

export async function proxyFetch(body){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),55000);
  try{
    const res=await fetch(SUPABASE_URL+"/functions/v1/claude-proxy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal});
    clearTimeout(timeout);
    return res.json();
  }catch(e){clearTimeout(timeout);throw e;}
}

export async function engineCloneVoice(sample){
  try{
    const res=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({clone:true,sample:String(sample||"")})});
    let d=await res.json();
    if(d&&d.voice_id)return d.voice_id;
    if(d&&d.id){for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,1500));const p=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({id:d.id})});const pd=await p.json();if(pd&&pd.voice_id)return pd.voice_id;if(pd&&(pd.status==="failed"||pd.status==="canceled"))return "";}}
  }catch(e){}
  return "";
}

export async function photoToEngineImage(url,maxPx){
  maxPx=maxPx||1024;
  try{
    const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url;});
    const sc=Math.min(1,maxPx/Math.max(img.naturalWidth||1,img.naturalHeight||1));
    const w=Math.max(2,Math.round((img.naturalWidth||1)*sc)),h=Math.max(2,Math.round((img.naturalHeight||1)*sc));
    const cv=document.createElement("canvas");cv.width=w;cv.height=h;
    cv.getContext("2d").drawImage(img,0,0,w,h);
    return cv.toDataURL("image/jpeg",0.85);
  }catch(e){return "";}
}

export function buildEnginePrompt(shot,brief){
  const s=String(shot||"").trim().slice(0,1150);
  let look="";
  if(brief){
    const sentences=String(brief).split(/[.!?]\s+/).filter(x=>/grade|grain|35mm|letterbox|gold|amber|photorealistic|cinematic|no text|no captions/i.test(x)&&!/human beings|audience|people|voice:|=====/i.test(x)&&x.length<220);
    look=sentences.join(" ").slice(0,380);
  }
  return s+(look?("\nLOOK: "+look):"")+"\nNo one speaks. Mouths closed. Show exactly the scene described above.";
}

export function msDownload(url, filename){
  try{
    if(!url)return;
    const a=document.createElement("a");
    a.href=url;a.download=String(filename||"InFuture.mp4").replace(/\.webm$/i,".mp4");a.rel="noopener noreferrer";
    document.body.appendChild(a);a.click();
    setTimeout(()=>{try{document.body.removeChild(a);}catch(e){}},1500);
  }catch(e){try{window.open(url,"_blank");}catch(e2){}}
}

export async function pexelsClip(query){
  try{
    const r=await fetch(SUPABASE_URL+"/functions/v1/pexels",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query})});
    if(!r.ok)return null;
    const j=await r.json();
    return j&&j.url?j.url:null;
  }catch(e){return null;}
}

// ── Design tokens ──
export const GOLD="#D4AF6A";
export const GOLDDIM="rgba(212,175,106,0.28)";
export const LINE="rgba(237,234,227,0.12)";
export const BG="#07080A";
export const BG4="#0E0F12";
export const WHITE="#EDEAE3";
export const DIM="rgba(237,234,227,0.5)";
export const SIGNAL="#D4AF6A";
export const PANEL="#0E0F12";
export const PANEL2="#15171B";
export const LIVE="#FF5A4E";
export const TOTAL=25;

export const STRIPE={
  basic:"https://buy.stripe.com/cNi8wRe8a9ZtcZh7YeafS05",
  pro:"https://buy.stripe.com/cNi8wRe8a3B52kDceuafS04",
  studio:"https://buy.stripe.com/00wcN7fcefjNgbtceuafS03",
};

export const G=(v,sm)=>({
  background:v==="gold"?GOLD:"transparent",
  border:v==="gold"?"none":"1px solid "+LINE,
  color:v==="gold"?"#000":WHITE,
  borderRadius:3,fontWeight:600,
  padding:sm?"5px 14px":"10px 26px",
  fontSize:sm?11:13,
  cursor:"pointer",letterSpacing:0.2,textTransform:"none",
  fontFamily:"'Manrope',system-ui,sans-serif",
});
export const Sp={minHeight:"100vh",background:BG,color:WHITE,fontFamily:"'Manrope',system-ui,sans-serif",paddingBottom:160,width:"100%",overflowX:"hidden"};
export const H1={fontFamily:"'Fraunces',Georgia,serif",fontWeight:300,color:WHITE,letterSpacing:-0.2,textTransform:"none",margin:0,fontSize:"clamp(16px,3vw,32px)"};
export const Card=(x)=>({background:"#0E0F12",border:"1px solid "+LINE,borderRadius:3,padding:18,...(x||{})});

export const STOCK_VOICES=[
  {id:"aurora",name:"Aurora",desc:"Warm British Female",style:"Documentary · Narrator",accent:"British RP"},
  {id:"marcus",name:"Marcus",desc:"Deep American Male",style:"Cinematic · Authoritative",accent:"American"},
  {id:"sophia",name:"Sophia",desc:"Bright Australian Female",style:"Upbeat · Engaging",accent:"Australian"},
  {id:"james",name:"James",desc:"Dry British Male",style:"Sarcastic · Witty",accent:"British"},
  {id:"nova",name:"Nova",desc:"Neutral AI Female",style:"Clean · Professional",accent:"Neutral"},
  {id:"river",name:"River",desc:"Warm American Male",style:"Friendly · Intimate",accent:"American South"},
];

export const VOICE_TOOLS=["Text to Voice","Text to Speech","Text to Narration","Text to Audiobook","Text to Voiceover","AI Voice Actor","Neural Voice Generator","Emotion Voice Synth","Documentary Voice","Trailer Voice Generator","Commercial Voice","Character Voice Creator","Audiobook Creator","Podcast Voice"];

export const VIDEO_T=["Text to Video","Image to Video","Video to Video","AI Video Creator","AI Film Generator","Video Upscaler","AI Video Generator 4K","Set to Video","Video Colorizer","Color Grading Pro","Fast Look Generator","Film Restoration","Time Lapse Creator","Video Trimmer","Background Remover","Digital Human Video","Rotoscope Video","Animation Creator","Puppet Animator","Motion Capture","Character Animator","Video Stabilizer","Video Compressor","Cinematic LUT","Black & White Film","Film Texture","VHS Effect","Glitch Effect","Quick Film Creator","Opening Slate","Time Freeze","Bullet Time Effect","Rain Simulation","Snow Simulation","Smoke Generator","Fire Simulation","Particle System","AI Progressive Video","4K Upscaling"];

export const MOTION=["AI 8K Upscaling","AI 4K Upscaling","Video Super Resolution","Frame Interpolation","Video Denoiser","Noise Reduction","Grain Remover","Artifact Remover","Scratch Remover","Video Sharpener","Clarity Booster","Detail Enhancer","Edge Enhancement","Texture Boost","White Balance AI","Color Correction","Auto Color Balance","Color Match Pro","Color Grading AI","Cinematic Color Grade","Film Stock Emulation","LUT Generator","Tone Mapping Pro","HDR Enhancement","Deep HDR Boost","Dynamic Range Expansion","Shadow Recovery","Highlight Recovery","Black Point Calibration","Gamma Correction","Contrast Enhancer","Brightness Optimizer","Saturation Booster","Smart Saturation","Face Enhancement","Face Retouch","Eye Enhancer","Teeth Whitener","Skin Tone Enhancer","Background Enhancer","Sky Enhancer","Landscape Enhancer","Night Video Enhancer","Low Light Clarity","Motion Stabilization","Shake Remover","Rolling Shutter Fix"];

export const WRITING=["Script to Movie","Text to Script","Script to Screenplay","Prompt to Story","Story to Script","Feature Film Script","Short Film Script","TV Pilot Script","Documentary Script","Commercial Script","YouTube Script","Podcast Script","Social Media Script","Explainer Script","Plot Generator","Story Outline","Three Act Structure","Five Act Structure","Beat Sheet Builder","Character Bio Writer","Character Arc Builder","Subplot Generator","Plot Twist Generator","Opening Hook Creator","Climax Designer","Logline Generator","Synopsis Writer","Treatment Writer","Scene Writer","Text to Dialogue","Dialogue Generator","Narration Writer","Voiceover Script","Interview Script","Action Line Writer","Scene Heading Tool","Parenthetical Generator","Script Formatter","Dialogue Tightener","Script Timer","Word Counter","Page Counter","Reading Time Estimator","Format Checker","Grammar Polish","Spell Checker","Continuity Checker","Plot Hole Detector","Tone Checker","Genre Classifier"];

export const IMAGE_T=["Text to Image","Prompt to Image","Image to Image","Image Upscaler","Image Generator","AI Art Generator","Photo to Painting","Sketch to Image","Wireframe to Image","Background Generator","Background Remover","Sky Replacer","Object Remover","Face Generator","Character Design","Portrait Generator","Avatar Creator","Product Image Generator","Architecture Visualizer","Interior Design Generator","Landscape Generator","Abstract Art Generator","Logo Generator","Icon Creator","Texture Generator","Pattern Maker","Color Palette Generator","Style Transfer","Photo Enhancer","Photo Restorer","Old Photo Colorizer","Black & White to Color","Image Denoiser","Sharpness Enhancer","Clarity Booster","Detail Enhancer","HDR Image Creator","Exposure Fixer","White Balance AI","Color Grading Studio","LUT Creator","Tone Mapper","Contrast Adjuster","Brightness Tool","Saturation Engine","Hue Shift","Temperature Control","Vignette Tool"];

export const VOICE_CHARACTERS=[
  {id:"amanda",name:"Amanda",gender:"Female",age:"Adult",origin:"Founder",region:"InFuture",style:"Your voice · Narrator",pitch:1.0,rate:0.85,desc:"Amanda's own voice — your recorded narration.",isOwner:true},
  {id:"james",name:"James",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Sarcastic · Deadpan · Witty",pitch:0.86,rate:0.62,desc:"Dry British wit."},
  {id:"aurora",name:"Aurora",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Warm · Documentary · Authoritative",pitch:1.08,rate:0.80,desc:"Calm authority."},
  {id:"edward",name:"Edward",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Theatrical · Grand · Classical",pitch:0.85,rate:0.75,desc:"Shakespearean gravitas."},
  {id:"cecily",name:"Cecily",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Crisp · Intelligent · Sardonic",pitch:1.12,rate:0.85,desc:"Sharp as a tack."},
  {id:"nana",name:"Nana",gender:"Female",age:"Elderly",origin:"British",region:"Yorkshire",style:"Gentle · Wise · Warm",pitch:1.02,rate:0.70,desc:"Warm elderly wisdom."},
  {id:"colonel",name:"Colonel",gender:"Male",age:"Elderly",origin:"British",region:"London",style:"Commanding · Dignified · Veteran",pitch:0.80,rate:0.74,desc:"Authority earned through decades."},
  {id:"pippa",name:"Pippa",gender:"Female",age:"Teen",origin:"British",region:"London",style:"Bright · Cheerful · Young",pitch:1.25,rate:0.95,desc:"Fresh and warm."},
  {id:"archie",name:"Archie",gender:"Male",age:"Teen",origin:"British",region:"Manchester",style:"Casual · Friendly · Teen",pitch:1.05,rate:0.98,desc:"Relaxed and genuine."},
  {id:"ewan",name:"Ewan",gender:"Male",age:"Adult",origin:"Scottish",region:"Edinburgh",style:"Warm · Rugged · Sincere",pitch:0.92,rate:0.82,desc:"Deep warm Scottish sincerity."},
  {id:"fiona",name:"Fiona",gender:"Female",age:"Adult",origin:"Scottish",region:"Glasgow",style:"Lilting · Warm · Storyteller",pitch:1.10,rate:0.84,desc:"Beautiful Scottish lilt."},
  {id:"paddy",name:"Paddy",gender:"Male",age:"Adult",origin:"Irish",region:"Dublin",style:"Charming · Witty · Warm",pitch:0.95,rate:0.88,desc:"Easy Irish charm."},
  {id:"siobhan",name:"Siobhan",gender:"Female",age:"Adult",origin:"Irish",region:"Cork",style:"Gentle · Musical · Emotional",pitch:1.15,rate:0.82,desc:"Soft Irish voice."},
  {id:"dafydd",name:"Dafydd",gender:"Male",age:"Adult",origin:"Welsh",region:"Cardiff",style:"Musical · Passionate · Rich",pitch:0.90,rate:0.80,desc:"Rich Welsh musicality."},
  {id:"marcus",name:"Marcus",gender:"Male",age:"Adult",origin:"American",region:"New York",style:"Deep · Cinematic · Commanding",pitch:0.72,rate:0.74,desc:"Big voice."},
  {id:"river",name:"River",gender:"Male",age:"Adult",origin:"American",region:"Tennessee",style:"Warm · Intimate · Storyteller",pitch:0.98,rate:0.76,desc:"Unhurried Southern charm."},
  {id:"dakota",name:"Dakota",gender:"Female",age:"Adult",origin:"American",region:"Chicago",style:"Bold · Direct · Confident",pitch:1.05,rate:0.92,desc:"No filler."},
  {id:"wade",name:"Wade",gender:"Male",age:"Adult",origin:"American",region:"Texas",style:"Laid Back · Humorous · Folksy",pitch:0.94,rate:0.85,desc:"Easy going Southern humour."},
  {id:"brooklyn",name:"Brooklyn",gender:"Female",age:"Adult",origin:"American",region:"New York",style:"Fast · Sharp · City Energy",pitch:1.18,rate:1.10,desc:"Fast New York energy."},
  {id:"savannah",name:"Savannah",gender:"Female",age:"Adult",origin:"American",region:"Georgia",style:"Sweet · Gracious · Warm",pitch:1.20,rate:0.84,desc:"Warm Southern grace."},
  {id:"madison",name:"Madison",gender:"Female",age:"Teen",origin:"American",region:"California",style:"Upbeat · Social · Natural",pitch:1.30,rate:1.08,desc:"Real American teenage energy."},
  {id:"tyler",name:"Tyler",gender:"Male",age:"Teen",origin:"American",region:"Ohio",style:"Casual · Relatable · Teen",pitch:1.08,rate:1.00,desc:"Natural and unforced."},
  {id:"rosie",name:"Rosie",gender:"Female",age:"Child",origin:"American",region:"Florida",style:"Sweet · Innocent · Child",pitch:1.45,rate:0.88,desc:"Young warm and sweet."},
  {id:"cooper",name:"Cooper",gender:"Male",age:"Child",origin:"American",region:"Colorado",style:"Bright · Curious · Child",pitch:1.40,rate:0.90,desc:"Curious about everything."},
  {id:"grandma",name:"Grandma",gender:"Female",age:"Elderly",origin:"American",region:"Virginia",style:"Warm · Loving · Elderly",pitch:1.00,rate:0.72,desc:"Full of love and life experience."},
  {id:"frank",name:"Frank",gender:"Male",age:"Elderly",origin:"American",region:"New Jersey",style:"Gruff · Honest · Elder",pitch:0.78,rate:0.76,desc:"Says it straight."},
  {id:"sophia",name:"Sophia",gender:"Female",age:"Adult",origin:"Australian",region:"Sydney",style:"Upbeat · Bright · Energetic",pitch:1.35,rate:1.12,desc:"Forward energy."},
  {id:"finn",name:"Finn",gender:"Male",age:"Adult",origin:"Australian",region:"Melbourne",style:"Casual · Confident · Outdoorsy",pitch:0.95,rate:0.95,desc:"Relaxed Australian confidence."},
  {id:"aroha",name:"Aroha",gender:"Female",age:"Adult",origin:"New Zealand",region:"Auckland",style:"Warm · Grounded · Sincere",pitch:1.10,rate:0.86,desc:"Natural sincerity."},
  {id:"amara",name:"Amara",gender:"Female",age:"Adult",origin:"South African",region:"Cape Town",style:"Rich · Warm · Powerful",pitch:1.05,rate:0.84,desc:"Quiet power."},
  {id:"kofi",name:"Kofi",gender:"Male",age:"Adult",origin:"West African",region:"Ghana",style:"Deep · Rhythmic · Storyteller",pitch:0.82,rate:0.78,desc:"Every sentence has music in it."},
  {id:"priya",name:"Priya",gender:"Female",age:"Adult",origin:"Indian",region:"Mumbai",style:"Precise · Warm · Intelligent",pitch:1.15,rate:0.90,desc:"Warm and intelligent."},
  {id:"arjun",name:"Arjun",gender:"Male",age:"Adult",origin:"Indian",region:"Delhi",style:"Authoritative · Clear · Measured",pitch:0.88,rate:0.85,desc:"Sounds like someone who knows exactly what they are talking about."},
  {id:"valentina",name:"Valentina",gender:"Female",age:"Adult",origin:"Spanish",region:"Madrid",style:"Passionate · Warm · Expressive",pitch:1.18,rate:0.92,desc:"Everything sounds felt."},
  {id:"pierre",name:"Pierre",gender:"Male",age:"Adult",origin:"French",region:"Paris",style:"Suave · Dry · Cultured",pitch:0.90,rate:0.84,desc:"Makes things sound interesting."},
  {id:"ingrid",name:"Ingrid",gender:"Female",age:"Adult",origin:"Scandinavian",region:"Stockholm",style:"Clean · Cool · Direct",pitch:1.08,rate:0.88,desc:"No excess words."},
  {id:"yemi",name:"Yemi",gender:"Female",age:"Adult",origin:"Nigerian",region:"Lagos",style:"Bold · Joyful · Energetic",pitch:1.25,rate:1.00,desc:"Life-affirming."},
  {id:"magnus",name:"Magnus",gender:"Male",age:"Elderly",origin:"Fantasy",region:"Ancient",style:"Ancient · Wise · Epic",pitch:0.75,rate:0.70,desc:"Seen civilisations rise and fall."},
  {id:"nova",name:"Nova",gender:"Female",age:"Adult",origin:"Neutral",region:"AI",style:"Clean · Precise · Neutral",pitch:1.12,rate:0.95,desc:"No accent. No emotion. No opinion."},
  {id:"hunter",name:"Hunter",gender:"Male",age:"Adult",origin:"American",region:"Hollywood",style:"Trailer · Epic · Explosive",pitch:0.70,rate:0.80,desc:"Full movie trailer energy."},
  {id:"luna",name:"Luna",gender:"Female",age:"Adult",origin:"Neutral",region:"ASMR",style:"Whisper · ASMR · Intimate",pitch:1.20,rate:0.65,desc:"Soft whisper."},
  {id:"professor",name:"Professor",gender:"Male",age:"Elderly",origin:"British",region:"Oxford",style:"Academic · Thoughtful · Measured",pitch:0.88,rate:0.78,desc:"Distinguished. Precise."},
  {id:"hope",name:"Hope",gender:"Female",age:"Adult",origin:"American",region:"Heartfelt",style:"Tender · Gentle · Loving",pitch:1.15,rate:0.78,desc:"Pure tenderness."},
  {id:"storm",name:"Storm",gender:"Male",age:"Adult",origin:"American",region:"Intense",style:"Intense · Angry · Powerful",pitch:0.82,rate:1.00,desc:"Raw intensity."},
  {id:"joy",name:"Joy",gender:"Female",age:"Adult",origin:"American",region:"Uplifting",style:"Excited · Joyful · Celebratory",pitch:1.40,rate:1.15,desc:"Pure infectious joy."},
  {id:"sage",name:"Sage",gender:"Male",age:"Adult",origin:"Neutral",region:"Mindful",style:"Peaceful · Mindful · Grounded",pitch:0.95,rate:0.72,desc:"Deep calm."},
  {id:"faith",name:"Faith",gender:"Female",age:"Adult",origin:"American",region:"Gospel",style:"Inspirational · Gospel · Uplifting",pitch:1.18,rate:0.88,desc:"Gospel soul."},
  {id:"rebel",name:"Rebel",gender:"Female",age:"Teen",origin:"American",region:"Activist",style:"Fierce · Defiant · Young",pitch:1.22,rate:1.05,desc:"Will not back down."},
  {id:"blaze",name:"Blaze",gender:"Female",age:"Adult",origin:"American",region:"Cinematic",style:"Warm · Confident · Cinematic",pitch:1.02,rate:0.95,desc:"Warm cinematic narrator."},
  {id:"remy",name:"Remy",gender:"Male",age:"Adult",origin:"French",region:"Lyon",style:"Smooth · Romantic · Intimate",pitch:0.92,rate:0.80,desc:"Everything sounds like poetry."},
  {id:"zhara",name:"Zhara",gender:"Female",age:"Adult",origin:"Middle Eastern",region:"Dubai",style:"Elegant · Warm · Sophisticated",pitch:1.10,rate:0.85,desc:"Graceful and precise."},
  {id:"kai",name:"Kai",gender:"Male",age:"Adult",origin:"Hawaiian",region:"Honolulu",style:"Relaxed · Warm · Soulful",pitch:0.96,rate:0.82,desc:"Unhurried ocean warmth."},
  {id:"sienna",name:"Sienna",gender:"Female",age:"Adult",origin:"American",region:"New Orleans",style:"Soulful · Blues · Deep",pitch:1.05,rate:0.78,desc:"Every word feels lived-in."},
  {id:"atlas",name:"Atlas",gender:"Male",age:"Adult",origin:"Neutral",region:"Epic",style:"Cinematic · Epic · Booming",pitch:0.68,rate:0.76,desc:"The voice of a thousand documentaries."},
  {id:"echo",name:"Echo",gender:"Female",age:"Adult",origin:"Neutral",region:"Ethereal",style:"Ethereal · Dreamy · Otherworldly",pitch:1.22,rate:0.72,desc:"Sounds like it came from somewhere else."},
];

export function speakText(voiceId,txt,onStart,onEnd){
  if(!txt||!txt.trim())return;
  if(typeof window==="undefined"||!window.speechSynthesis){if(onEnd)onEnd();return;}
  window.speechSynthesis.cancel();
  const clean=txt.replace(/\.\.\.|\.{3}/g,", ").replace(/…/g,", ").replace(/—/g,", ").replace(/[*\/]/g," ").slice(0,200000);
  const doSpeak=()=>{
    const allVoices=window.speechSynthesis.getVoices();
    const voiceChar=VOICE_CHARACTERS.find(v=>v.id===voiceId);
    let picked=null;
    if(voiceChar){
      const origin=(voiceChar.origin||"").toLowerCase(),gender=(voiceChar.gender||"").toLowerCase();
      const candidates=origin.includes("british")?(gender==="female"?["Serena","Tessa","Kate"]:["Daniel","Oliver","Arthur"]):origin.includes("american")?(gender==="female"?["Samantha","Ava","Victoria"]:["Alex","Tom","Fred"]):["Samantha","Alex"];
      for(const name of candidates){picked=allVoices.find(v=>v.name.includes(name));if(picked)break;}
    }
    if(!picked)picked=allVoices.find(v=>v.lang&&v.lang.startsWith("en"))||allVoices[0];
    const pitch=voiceChar?voiceChar.pitch:1.0,rate=voiceChar?voiceChar.rate:0.85;
    const sentences=clean.match(/[^.!?]+[.!?]+|\s*\S[^.!?]*$/g)||[clean];
    const chunks=[];let buf="";
    for(const s of sentences){if((buf+s).length>220){if(buf)chunks.push(buf);buf=s;}else buf+=s;}
    if(buf)chunks.push(buf);
    if(!chunks.length)chunks.push(clean);
    let idx=0,started=false;
    const speakNext=()=>{
      if(idx>=chunks.length){if(onEnd)onEnd();return;}
      const utt=new SpeechSynthesisUtterance(chunks[idx]);
      utt.pitch=pitch;utt.rate=rate;utt.volume=1.0;
      if(picked)utt.voice=picked;
      utt.lang=picked?picked.lang:"en-US";
      utt.onstart=()=>{if(!started){started=true;if(onStart)onStart();}};
      utt.onend=()=>{idx++;speakNext();};
      utt.onerror=()=>{idx++;speakNext();};
      window.speechSynthesis.speak(utt);
    };
    speakNext();
  };
  if(window.speechSynthesis.getVoices().length===0){window.speechSynthesis.onvoiceschanged=()=>{window.speechSynthesis.onvoiceschanged=null;doSpeak();};}
  else doSpeak();
}

export function stopSpeaking(){try{window.speechSynthesis.cancel();}catch(e){}}

let __msAudio=null;
export function playEngineAudio(url,volume){
  return new Promise((resolve)=>{
    try{const a=new Audio(url);a.volume=typeof volume==="number"?Math.max(0,Math.min(1,volume)):1;__msAudio=a;a.onended=()=>resolve(true);a.onerror=()=>resolve(false);a.play().catch(()=>resolve(false));}catch(e){resolve(false);}
  });
}
export function stopEngineAudio(){try{if(__msAudio){__msAudio.pause();__msAudio.currentTime=0;__msAudio=null;}}catch(e){}}
