const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...CORS,"Content-Type":"application/json"}});
const TOKEN=()=>Deno.env.get("REPLICATE_API_TOKEN")||"";
const out=(o:unknown)=>Array.isArray(o)?o[0]:o;
const pick=(g:string,o:string)=>{const f=/female/i.test(g||"female");const br=/brit|scot|irish|welsh|english/i.test(o||"");if(br)return f?"bf_emma":"bm_george";return f?"af_bella":"am_michael";};
const H=()=>({"Authorization":"Bearer "+TOKEN(),"Content-Type":"application/json","Prefer":"wait"});
const VER:Record<string,string>={};
async function run(model:string,input:unknown){
  let r=await fetch("https://api.replicate.com/v1/models/"+model+"/predictions",{method:"POST",headers:H(),body:JSON.stringify({input})});
  if(r.status===404||r.status===422){
    // Community models need their version id.
    if(!VER[model]){const m=await fetch("https://api.replicate.com/v1/models/"+model,{headers:H()});const mj=await m.json().catch(()=>({}));if(mj&&mj.latest_version&&mj.latest_version.id)VER[model]=mj.latest_version.id;}
    if(VER[model])r=await fetch("https://api.replicate.com/v1/predictions",{method:"POST",headers:H(),body:JSON.stringify({version:VER[model],input})});
  }
  const p=await r.json().catch(()=>({}));
  if(!r.ok)console.log("voice error",model,r.status,JSON.stringify(p).slice(0,300));
  return [r.ok,p] as const;
}
// Big audio samples go up as a file, not inline (inline data is only for small files).
async function asFile(sample:string){
  const m=/^data:([^;,]+)?(;base64)?,(.*)$/s.exec(sample||"");
  if(!m||sample.length<200000)return sample;
  const bin=atob(m[3]);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const type=m[1]||"audio/wav";
  const ext=type.includes("wav")?"wav":type.includes("mpeg")||type.includes("mp3")?"mp3":type.includes("mp4")||type.includes("m4a")?"m4a":type.includes("webm")?"webm":"wav";
  const fd=new FormData();fd.append("content",new Blob([bytes],{type}),"sample."+ext);
  const r=await fetch("https://api.replicate.com/v1/files",{method:"POST",headers:{"Authorization":"Bearer "+TOKEN()},body:fd});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j?.urls?.get){console.log("file upload error",r.status,JSON.stringify(j).slice(0,300));return sample;}
  return j.urls.get;
}
const segsOf=(o:any)=>Array.isArray(o?.segments)?o.segments.map((s:any)=>({start:s.start,end:s.end,text:s.text})):null;

// ── SECOND VOICE ENGINE (own key ALT_VOICE_KEY). Used only when that key is set; otherwise the old route runs. ──
const ELK=()=>Deno.env.get("ALT_VOICE_KEY")||"";
const EL="https://api.elevenlabs.io";
const SU=()=>Deno.env.get("SUPABASE_URL")||"";
const SK=()=>Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const BUCKET="voice-out";
let bucketReady=false;
async function ensureBucket(){
  if(bucketReady)return;
  try{await fetch(SU()+"/storage/v1/bucket",{method:"POST",headers:{"Authorization":"Bearer "+SK(),"Content-Type":"application/json"},body:JSON.stringify({id:BUCKET,name:BUCKET,public:true})});}catch(e){}
  bucketReady=true;
}
async function hostAudio(bytes:Uint8Array){
  await ensureBucket();
  const name=crypto.randomUUID()+".mp3";
  const r=await fetch(SU()+"/storage/v1/object/"+BUCKET+"/"+name,{method:"POST",headers:{"Authorization":"Bearer "+SK(),"Content-Type":"audio/mpeg"},body:bytes});
  if(!r.ok){console.log("host audio failed",r.status,(await r.text().catch(()=>"")).slice(0,200));return "";}
  return SU()+"/storage/v1/object/public/"+BUCKET+"/"+name;
}
const msg=(j:any)=>String((j&&j.detail&&(j.detail.message||j.detail))||(j&&j.message)||"");
const STOCK=["pNInz6obpgDQGcFmaJgB","TxGEqnHWrfWFTfGW9XjX","ErXwobaYiN019PkySvjV","VR6AewLTigWG4xSOukaG"];
async function elClone(sample:string){
  const m=/^data:([^;,]+)?(;base64)?,(.*)$/s.exec(sample||"");
  if(!m)return {error:"No sample"};
  const type=m[1]||"audio/mpeg";
  const bin=atob(m[3]);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const ext=type.includes("wav")?"wav":type.includes("mp4")?"mp4":type.includes("m4a")||type.includes("aac")?"m4a":type.includes("webm")?"webm":type.includes("ogg")?"ogg":"mp3";
  // Same sample = same voice. Look it up first so the voice slots are not used up by repeat runs.
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes.slice(0,200000)))).map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,16);
  const name="ms_"+hash;
  try{
    const lr=await fetch(EL+"/v1/voices",{headers:{"xi-api-key":ELK()}});
    const lj:any=await lr.json().catch(()=>({}));
    const hit=(lj.voices||[]).find((v:any)=>v&&v.name===name);
    if(hit&&hit.voice_id)return {voice_id:"el_"+hit.voice_id};
  }catch(e){}
  const fd=new FormData();
  fd.append("name",name);
  fd.append("remove_background_noise","true");
  fd.append("files",new Blob([bytes],{type}),"sample."+ext);
  const r=await fetch(EL+"/v1/voices/add",{method:"POST",headers:{"xi-api-key":ELK()},body:fd});
  const j:any=await r.json().catch(()=>({}));
  if(!r.ok||!j.voice_id){
    console.log("alt clone failed",r.status,JSON.stringify(j).slice(0,300));
    // A file that cannot be copied gets a stock voice, so the film is never stopped by one bad voice file.
    return {voice_id:"el_"+STOCK[parseInt(hash.slice(0,4),16)%STOCK.length]};
  }
  return {voice_id:"el_"+j.voice_id};
}
async function elSpeak(text:string,voice:string,speed:number){
  const r=await fetch(EL+"/v1/text-to-speech/"+encodeURIComponent(voice)+"?output_format=mp3_44100_128",{method:"POST",headers:{"xi-api-key":ELK(),"Content-Type":"application/json"},body:JSON.stringify({text,model_id:"eleven_multilingual_v2",voice_settings:{speed:Math.max(0.7,Math.min(1.2,speed||1))}})});
  if(!r.ok){const j:any=await r.json().catch(()=>({}));console.log("alt speak failed",r.status,JSON.stringify(j).slice(0,300));return {error:msg(j)||("Voice error "+r.status),status:r.status};}
  const url=await hostAudio(new Uint8Array(await r.arrayBuffer()));
  if(!url)return {error:"Voice error"};
  return {id:"el",status:"succeeded",url};
}

Deno.serve(async (req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:CORS});
  try{
    // A whole long recording is too big for the engine (it ran out of memory).
    // The app sends a short sample instead; refuse anything huge cleanly.
    const len=Number(req.headers.get("content-length")||0);
    if(len>25000000)return J({error:"Sample too large. Update the app so it sends a short sample."},413);
    const b=await req.json();
    if(b.id){
      const r=await fetch("https://api.replicate.com/v1/predictions/"+b.id,{headers:H()});
      const p=await r.json();
      const o=p.output;
      if(o&&typeof o==="object"&&!Array.isArray(o)&&o.voice_id)return J({id:p.id,status:p.status,voice_id:"mm_"+o.voice_id});
      const sg=o&&typeof o==="object"&&!Array.isArray(o)?segsOf(o):null;
      if(sg)return J({id:p.id,status:p.status,segments:sg});
      return J({id:p.id,status:p.status,url:p.status==="succeeded"?out(o):""});
    }
    if(b.clone){
      if(ELK())return J(await elClone(String(b.sample||"")));
      const [ok,p]=await run("minimax/voice-cloning",{voice_file:await asFile(String(b.sample||"")),model:"speech-02-turbo",need_noise_reduction:true,need_volume_normalization:true});
      if(!ok)return J({error:p.detail||"Clone error"});
      if(p.output&&p.output.voice_id)return J({voice_id:"mm_"+p.output.voice_id});
      return J({id:p.id,status:p.status});
    }
    if(b.transcribe){
      // Speech-to-text, used to find where a recording stops in the script.
      const [ok,p]=await run("openai/whisper",{audio:await asFile(String(b.sample||"")),transcription:"plain text"});
      if(!ok)return J({error:p.detail||"Transcribe error"});
      const sg=segsOf(p.output);
      if(sg)return J({segments:sg});
      return J({id:p.id,status:p.status});
    }
    const text=String(b.text||"").slice(0,3500);
    const v=String(b.voice||"");
    if(v.startsWith("el_")){
      if(!ELK())return J({error:"Voice key missing"});
      const r=await elSpeak(text,v.slice(3),Number(b.speed)||1);
      return J(r);
    }
    if(v.startsWith("mm_")){
      const [ok,p]=await run("minimax/speech-02-turbo",{text,voice_id:v.slice(3),speed:Math.max(0.5,Math.min(2,Number(b.speed)||1))});
      if(!ok)return J({error:p.detail||"Voice error"});
      return J({id:p.id,status:p.status,url:p.status==="succeeded"?out(p.output):""});
    }
    const kv=/^[ab][fm]_/.test(v)?v:pick(b.gender,b.origin);
    const [ok,p]=await run("jaaari/kokoro-82m",{text,voice:kv,speed:Math.max(0.5,Math.min(1.5,Number(b.speed)||1))});
    if(!ok)return J({error:p.detail||"Voice error"});
    return J({id:p.id,status:p.status,url:p.status==="succeeded"?out(p.output):""});
  }catch(e){return J({error:String(e)},500);}
});
