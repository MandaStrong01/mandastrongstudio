// @ts-nocheck
// Engine helpers for Mandas Film & Music Studio (copied from the main app so the two apps stay independent).
import { createClient } from "@supabase/supabase-js";
// ── SUPABASE AUTH ────────────────────────────────────────────────
// Real accounts. The publishable key below is SAFE to ship — it is the
// public anon key and can do nothing on its own; every table is protected
// by row-level security, and the render engine only spends credit for a
// signed-in user it can identify from their login token.
const SUPABASE_URL="https://wvkqnrqcnoztajxxzyxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_5hcJCP8NshazpVLDNMDxlw_Ic5AOiyV";
const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,storageKey:"mfs_auth"}
});

// The signed-in user's access token — sent to the engine so the credit gate
// knows who is rendering. Returns "" when nobody is signed in.
async function authToken(){
  try{ const {data}=await supabase.auth.getSession(); return data?.session?.access_token||""; }
  catch(e){ return ""; }
}
// Standard headers for an engine call, carrying the login token when present.
async function engineAuthHeaders(){
  const t=await authToken();
  const h={"Content-Type":"application/json"};
  if(t) h["Authorization"]="Bearer "+t;
  return h;
}

// IndexedDB helpers for persistent clip storage
const DB_NAME="mandastrong_db",DB_VER=1,STORE="clips";
const openDB=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>e.target.result.createObjectStore(STORE,{keyPath:"id"});r.onsuccess=e=>res(e.target.result);r.onerror=rej;});

function buildChunks(text){const clean=text.replace(/\s+/g," ").trim();const sentences=clean.match(/[^.!?]+[.!?]+[\s]*/g)||[clean];const chunks=[];for(const s of sentences){const trimmed=s.trim();if(trimmed.length>0){const type=trimmed.endsWith("?")?"question":trimmed.endsWith("!")?"exclaim":"sentence";chunks.push({text:trimmed,type});}}return chunks.length>0?chunks:[{text:clean.slice(0,200),type:"sentence"}];}

// ── FULL-LENGTH NARRATION HELPERS ────────────────────────────────
// Sentences, keeping any last bit with no full stop (buildChunks drops it).
function msSentences(text){
  const clean=String(text||"").replace(/\s+/g," ").trim();
  if(!clean)return [];
  const out=clean.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g)||[clean];
  return out.map(x=>x.trim()).filter(Boolean);
}
// Groups sentences into engine-sized pieces (~2400 chars). A 90-minute script
// becomes ~40 engine calls instead of ~800 - far fewer chances to drop a line.
function msVoiceGroups(text,max){
  max=max||2400;
  const groups=[];let cur="";
  for(const s of msSentences(text)){
    if(cur&&(cur.length+1+s.length)>max){groups.push(cur);cur=s;}
    else cur=cur?cur+" "+s:s;
  }
  if(cur)groups.push(cur);
  return groups;
}
const msWordCount=(t)=>(String(t||"").trim().match(/\S+/g)||[]).length;
// Works out which part of the script your own recording already covers
// (from how long it is), and returns the REST for the engine to read.
function msRemainderAfterRecording(script,recSecs){
  const txt=String(script||"").trim();
  if(!txt)return "";
  // Cut on the REAL paragraph (or line) break — your recording is the first
  // paragraph, the engine reads the rest. A speaking-speed guess re-read part of
  // what you'd already said ("hearing myself in the background").
  let units=txt.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  if(units.length>=2) return units.slice(1).join("\n\n").trim();
  units=txt.split(/\n/).map(x=>x.trim()).filter(Boolean);
  if(units.length>=2) return units.slice(1).join("\n").trim();
  // No paragraph/line breaks at all — fall back to the old estimate only here
  if(!(recSecs>0))return txt;
  const est=recSecs*2.4; // documentary pace ~ 145 words a minute
  units=msSentences(txt);
  let acc=0,best=0,bestDiff=Infinity;
  for(let i=0;i<units.length;i++){
    acc+=msWordCount(units[i]);
    const d=Math.abs(acc-est);
    if(d<bestDiff){bestDiff=d;best=i+1;}
  }
  if(best<1)best=1;
  return units.slice(best).join(" ").trim();
}
// Length in seconds of an audio blob (decoded once, then released).
async function msBlobSeconds(blob){
  let ctx=null;
  try{
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    const buf=await ctx.decodeAudioData(await blob.arrayBuffer());
    return buf.duration||0;
  }catch(e){return 0;}
  finally{try{if(ctx)ctx.close();}catch(e){}}
}
// Voices a whole text through the engine, piece by piece. Returns the audio
// pieces in order plus how many pieces failed, so nothing is silently lost.
async function msVoiceText(text,meta,onStep){
  const groups=msVoiceGroups(text);
  const parts=[];let failed=0;
  for(let i=0;i<groups.length;i++){
    if(onStep)onStep(i+1,groups.length);
    let blob=null;
    for(let attempt=0;attempt<2&&!blob;attempt++){
      try{
        const u=await engineSpeak(groups[i],meta);
        if(u){const r=await fetch(u);if(r.ok){const b=await r.blob();if(b&&b.size>500)blob=b;}}
      }catch(e){}
    }
    if(blob)parts.push(blob);else failed++;
  }
  return {parts,failed,total:groups.length};
}
// Plays a list of audio blobs back-to-back into the film. Each piece is
// decoded just before it is needed, so a 90-minute narration never has to
// sit in memory all at once (that is what crashes iPad).
async function msMeasureSequence(ctx,blobs){
  const durs=[];
  for(const b of blobs){
    try{const buf=await ctx.decodeAudioData(await b.arrayBuffer());durs.push(buf.duration||0);}
    catch(e){durs.push(0);}
  }
  return durs;
}
function msPlaySequence(ctx,dests,blobs,durs,gapSec){
  gapSec=gapSec||0;
  let stopped=false;const live=[];
  const t0=ctx.currentTime+0.25;
  const starts=[];let acc=0;
  for(let i=0;i<blobs.length;i++){starts.push(t0+acc);if(durs[i]>0)acc+=durs[i]+gapSec;}
  (async()=>{
    for(let i=0;i<blobs.length&&!stopped;i++){
      if(!(durs[i]>0))continue;
      // wait until ~10s before this piece is due
      while(!stopped&&ctx.currentTime<starts[i]-10){await new Promise(r=>setTimeout(r,500));}
      if(stopped)break;
      try{
        const buf=await ctx.decodeAudioData(await blobs[i].arrayBuffer());
        const src=ctx.createBufferSource();src.buffer=buf;
        for(const d of dests)src.connect(d);
        src.start(Math.max(ctx.currentTime,starts[i]));
        live.push(src);
        src.onended=()=>{try{src.disconnect();}catch(e){};const k=live.indexOf(src);if(k>=0)live.splice(k,1);};
      }catch(e){}
    }
  })();
  return {total:acc,stop:()=>{stopped=true;for(const s of live){try{s.stop();}catch(e){}}}};
}

async function proxyFetch(body){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),55000);
  try{
    const res=await fetch("https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/claude-proxy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal});
    clearTimeout(timeout);
    return res.json();
  }catch(e){clearTimeout(timeout);throw e;}
}

// ══════════════════════════════════════════════════════════════════
// MANDASTRONG ENGINE — real photorealistic footage
// Single shared client. Every studio page renders through this.
// ══════════════════════════════════════════════════════════════════
const ENGINE_URL="https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/generate-video";
// Engine key is NOT held in the app. The Supabase engine authorises callers by
// origin (only InFuture domains) plus sign-in + credit gate on every render.
// engineHeaders replaced by engineAuthHeaders() — see top of file.

// The engine answers with .url; older builds looked for .output. Accept either.
const pickEngineUrl=(d)=>{ if(!d||typeof d!=="object")return""; const v=d.url||d.output||d.video||""; return (typeof v==="string"&&v.indexOf("http")===0)?v:""; };

async function engineCall(body){
  const res=await fetch(ENGINE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify(body)});
  return res.json();
}

// ── CINEMA VOICE ENGINE ──────────────────────────────────────────
// Server-side speech. Same voice on every device — iPad, Galaxy, HP.
const VOICE_URL="https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/generate-voice";
let __msAudio=null;

async function engineSpeak(text,meta){
  meta=meta||{};
  // When no explicit voice id is supplied, anchor gender/origin so the engine
  // never free-picks a random character (which was landing on "Pippa").
  const _g = meta.gender || (meta.voice ? "" : "Female");
  const _o = meta.origin || (meta.voice ? "" : "British");
  try{
    const res=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({
      text:String(text||"").slice(0,3500),
      voice:meta.voice||"",
      gender:_g,
      origin:_o,
      language:meta.language||"",
      speed:meta.speed||1
    })});
    let d=await res.json();
    let url=pickEngineUrl(d);
    if(url) return url;
    if(d&&d.id){
      for(let i=0;i<40;i++){
        await new Promise(r=>setTimeout(r,1500));
        const p=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({id:d.id})});
        const pd=await p.json();
        url=pickEngineUrl(pd);
        if(url) return url;
        if(pd&&(pd.status==="failed"||pd.status==="canceled")) return "";
      }
    }
  }catch(e){}
  return "";
}

// ── TRANSLATE NARRATION AT RENDER ────────────────────────────────
// Turns the narration into another language before it is spoken, using the
// same claude-proxy the rest of the app uses. English (or empty) passes
// straight through untouched. Returns the original text if anything fails,
// so a translation problem can never block a render.
const LANGUAGES = [
  {code:"", label:"English (original)"},
  {code:"Spanish", label:"Spanish"},
  {code:"French", label:"French"},
  {code:"German", label:"German"},
  {code:"Italian", label:"Italian"},
  {code:"Portuguese", label:"Portuguese"},
  {code:"Dutch", label:"Dutch"},
  {code:"Polish", label:"Polish"},
  {code:"Russian", label:"Russian"},
  {code:"Arabic", label:"Arabic"},
  {code:"Hindi", label:"Hindi"},
  {code:"Mandarin Chinese", label:"Mandarin Chinese"},
  {code:"Japanese", label:"Japanese"},
  {code:"Korean", label:"Korean"},
  {code:"Turkish", label:"Turkish"},
  {code:"Greek", label:"Greek"},
];
async function translateText(text, language){
  const src = String(text||"").trim();
  if(!src) return src;
  if(!language || /english/i.test(language)) return src; // English = no change
  try{
    const d = await proxyFetch({
      model:"claude-sonnet-4-20250514",
      max_tokens:8000,
      messages:[{role:"user",content:"Translate the following film narration into "+language+". Keep the tone, rhythm and meaning. Return ONLY the translated narration, no notes, no quotes, no preamble:\n\n"+src}]
    });
    const out = d&&d.content&&d.content[0]&&d.content[0].text ? d.content[0].text.trim() : "";
    return out || src; // fall back to original if the model returns nothing
  }catch(e){ return src; }
}


// Sends the sample to the engine's clone core and returns an opaque
// InFuture voice id. Store it; later pass it as meta.voice to speak
// in the cloned voice. Provider is never surfaced.
async function engineCloneVoice(sample){
  try{
    const res=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({clone:true,sample:String(sample||"")})});
    let d=await res.json();
    if(d&&d.voice_id) return d.voice_id;
    if(d&&d.id){
      for(let i=0;i<40;i++){
        await new Promise(r=>setTimeout(r,1500));
        const p=await fetch(VOICE_URL,{method:"POST",headers:await engineAuthHeaders(),body:JSON.stringify({id:d.id})});
        const pd=await p.json();
        if(pd&&pd.voice_id) return pd.voice_id;
        if(pd&&(pd.status==="failed"||pd.status==="canceled")) return "";
      }
    }
  }catch(e){}
  return "";
}

function playEngineAudio(url,volume){
  return new Promise((resolve)=>{
    try{
      const a=new Audio(url);
      a.volume=typeof volume==="number"?Math.max(0,Math.min(1,volume)):1;
      __msAudio=a;
      a.onended=()=>resolve(true);
      a.onerror=()=>resolve(false);
      a.play().catch(()=>resolve(false));
    }catch(e){resolve(false);}
  });
}

function stopEngineAudio(){
  try{ if(__msAudio){ __msAudio.pause(); __msAudio.currentTime=0; __msAudio=null; } }catch(e){}
}

// Health check — tells you if the engine has a provider key installed.
async function engineStatus(){
  try{ const r=await fetch(ENGINE_URL); return await r.json(); }catch(e){ return {ok:false,message:"Engine unreachable"}; }
}

// Starts one render and polls until the footage lands.
// Returns a playable URL, or "" if the engine could not deliver.
async function engineRender(prompt,opts){
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
  }catch(e){ return ""; }
}

// Renders several shots at once. Much faster than one after another.
async function engineRenderMany(prompts,opts){
  const results=await Promise.all(prompts.map(p=>engineRender(p,opts)));
  return results.filter(Boolean);
}

// Make My Movie reads the box aloud when no recording is attached. Directions, descriptions and scene
// prompts are instructions for the film, NOT words to speak. This keeps only the narration.
function msSpokenOnly(text){
  const paras=String(text||"").split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  const out=[];
  let skipNext=false;
  const dir=/^(make my movie\b|directions?\b|description\b|producer\b|describe\b|production\b|look\s*:|people\s*:|tone\s*:|sound\s*:|current issues\b|opening\s*:|order\s*:|the \d+ scene prompts|documentary\s*:|one hour\b|director'?s notes|no chimp|stretch each scene|the narration is the clock)/i;
  for(const para of paras){
    if(skipNext){skipNext=false;continue;}                     // the paragraph right after "SCENE n" is the prompt
    if(/^scene\s*\d+\s*$/i.test(para)){skipNext=true;continue;}
    if(/^scene\s*\d+\b/i.test(para)){continue;}              // "SCENE 3 ..." on one line
    if(dir.test(para))continue;
    if(/^(the script|script|narration)\s*(\(narration\))?\s*:?\s*$/i.test(para))continue; // bare headings
    out.push(para);
  }
  return out.join("\n\n").trim();
}

// ── AUTO-CAST ─────────────────────────────────────────────────────────────
// Reads "NAME: line" dialogue in the pasted script. Every character gets their
// own voice, the same voice every time. Anything that is not a spoken line is
// read by the narrator. Stage directions in ( ) or [ ] are never spoken.
function msScreenplayToCast(text){
  const STOP=/^(THE END|END|EPILOGUE|PROLOGUE|FADE (IN|OUT|TO)|CUT TO|CONTINUOUS|CAST OF CHARACTERS|CAST|THEMES|SOUND|MUSIC|SFX|NOTE|NOTES|TITLE|MONTAGE|VARIOUS LOCATIONS.*|MERRY CHRISTMAS|FINAL IMAGE.*|ACT .*|SCENE .*|INT\b.*|EXT\b.*)$/;
  const cueRx=/^([A-Z][A-Z0-9 .'’&\-]{0,30}?)\s*(\((?:CONT'?D|V\.?O\.?|O\.?S\.?|O\.?C\.?)\))?$/;
  const lines=String(text||"").split(/\r?\n/).map(l=>l.trim());
  const isCue=l=>{const m=l.match(cueRx);if(!m)return null;const n=m[1].trim();if(!/[A-Z]{2}/.test(n)||n.split(/\s+/).length>4||STOP.test(n))return null;return n;};
  const isDir=l=>/^[\(\[].*[\)\]]$/.test(l);
  const out=[];let found=0;
  for(let i=0;i<lines.length;i++){
    const l=lines[i];
    const c=l&&isCue(l);
    if(c){
      let j=i+1;while(j<lines.length&&isDir(lines[j]))j++;
      if(j<lines.length&&lines[j]&&!isCue(lines[j])&&!/^(SOUND|MUSIC|SFX):/.test(lines[j])){
        let d=lines[j];
        while(!/[.?!…"”'’)]$/.test(d)&&j+1<lines.length&&lines[j+1]&&!isCue(lines[j+1])&&!isDir(lines[j+1])){j++;d+=" "+lines[j];}
        out.push(c+": "+d);found++;i=j;continue;
      }
    }
    out.push(l);
  }
  return found>=2?out.join("\n"):String(text||"");
}
function msParseCast(text){
  text=String(text||"").split(/^\s*PRODUCTION NOTES\s*$/m)[0];
  text=msScreenplayToCast(text);
  const rx=/^\s*([A-Za-z][A-Za-z0-9'’.\- ]{0,26}?)\s*(?:\([^)]*\)|\[[^\]]*\])?\s*:\s*(.+?)\s*$/;
  const NARR=/^(narrator|narration|voice ?over|v\.?o\.?)$/i;
  const rows=[];const counts={};
  for(const ln of String(text||"").split(/\r?\n/)){
    const t=ln.trim(); if(!t)continue;
    if(/^[\(\[].*[\)\]]$/.test(t))continue;
    if(/^(INT|EXT)[. ]/.test(t))continue;
    const m=t.match(rx);
    if(m&&/^(act [a-z0-9]+|scene [a-z0-9]+|final image|fade to|sound|music|sfx|note|notes|title|runtime|lighting|snow|visual style|themes?|belief|kindness|community|second chances|growing up)$/i.test(m[1].trim()))continue;
    if(m&&m[1].trim().split(/\s+/).length<=3&&!NARR.test(m[1].trim())){
      const label=m[1].trim(),key=label.toUpperCase();
      rows.push({key,label,upper:label===label.toUpperCase(),t:m[2]});
      counts[key]=(counts[key]||0)+1;
    }else if(m&&NARR.test(m[1].trim())){ rows.push({key:null,t:m[2]}); }
    else rows.push({key:null,t});
  }
  const ok=k=>k&&((counts[k]>=1&&rows.find(r=>r.key===k).upper)||counts[k]>=2);
  const segs=[];const speakers=[];
  for(const r of rows){
    let key=ok(r.key)?r.key:null;
    let tx=String(r.t||"");
    if(!key&&r.key){ tx=r.label+": "+tx; }
    if(key){ tx=tx.replace(/\([^)]*\)|\[[^\]]*\]/g,"").replace(/\s+/g," ").trim(); }
    if(!tx)continue;
    if(key&&!speakers.find(x=>x.key===key))speakers.push({key,label:r.label});
    const last=segs[segs.length-1];
    if(last&&last.sp===key)last.text+=(key?" ":"\n\n")+tx; else segs.push({sp:key,text:tx});
  }
  return {segments:segs,speakers};
}
function msProfile(label,text){
  const first=String(label||"").toLowerCase().split(/\s+/)[0].replace(/[^a-z']/g,"");
  const r={gender:"",age:""};if(!first||first.length<2)return r;
  const nameRx=new RegExp("(^|[^a-z])"+first.replace(/[^a-z]/g,"")+"([^a-z]|$)","i");
  const F=/\b(girl|woman|lady|she|her|hers|mother|mom|mum|mrs|ms|miss|daughter|sister|grandma|granny|nana|queen|aunt|female|wife)\b/i;
  const M=/\b(boy|man|gentleman|he|his|him|father|dad|mr|mister|son|brother|grandpa|grandad|king|uncle|male|husband)\b/i;
  let line="";
  for(const l of String(text||"").split(/\r?\n/)){
    const t=l.trim().replace(/^[\u2022*\-\u2013]\s*/,"");
    if(t.length>220||t.length<4)continue;
    if(nameRx.test(t.slice(0,40))&&(/\bage[d]?\b|\byears?[- ]old\b|\(\s*\d{1,3}\s*[,)]|\(\d{1,3}\)|[,\-\u2013:]\s*(?:\w+\s+){0,2}(girl|boy|woman|man|mother|father|child|teen|elderly|old)/i.test(t))){line=t;break;}
  }
  if(!line)return r;
  const f=F.test(line),m=M.test(line);
  if(f&&!m)r.gender="Female";else if(m&&!f)r.gender="Male";
  let n=0;const a=line.match(/\bage[d]?\s*(\d{1,3})\b|\b(\d{1,3})[- ]years?[- ]old\b|\((\d{1,3})\)|\((?:[^)]*?,\s*)?(\d{1,3})\s*\)/i);
  if(a)n=parseInt(a[1]||a[2]||a[3]||a[4],10)||0;
  if(n>0&&n<=110)r.age=n<=12?"Child":n<=19?"Teen":n>=65?"Elderly":"Adult";
  else if(/\b(child|kid|little|boy|girl|young boy|young girl)\b/i.test(line)&&!/\b(man|woman)\b/i.test(line))r.age="Child";
  else if(/\bteen/i.test(line))r.age="Teen";
  else if(/\b(elderly|old man|old woman|grand(ma|pa|ad)|granny|nana)\b/i.test(line))r.age="Elderly";
  return r;
}
function msCastVoices(speakers,narratorId,fullText){
  const V=(typeof VOICE_CHARACTERS!=="undefined")?VOICE_CHARACTERS:[];
  const byId=id=>V.find(v=>v.id===id);
  const rules=[
    [/\b(santa|kris kringle|father christmas|st\.? nick)\b/,"marcus"],
    [/\b(grandma|granny|nana|gran)\b/,"grandma"],
    [/\b(grandpa|grandad|grandfather)\b/,"frank"],
    [/\b(mrs|mother|mom|mum|mama|mommy|mummy)\b/,"savannah"],
    [/\b(mr|mister|father|dad|daddy|papa)\b/,"river"],
    [/\b(jingle|elf|sprite)\b/,"brooklyn"],
    [/\b(fizz|fairy|pixie)\b/,"sophia"],
    [/\b(lily|girl|daughter|sister)\b/,"rosie"],
    [/\b(max|boy|son|brother)\b/,"cooper"],
  ];
  const pool=["dakota","wade","aurora","edward","paddy","siobhan","fiona","ewan","marcus","river","cecily","dafydd","brooklyn","savannah"];
  const used=new Set([narratorId]);const out={};
  const mine={};const taken=new Set();
  for(const sp of speakers){const n=sp.key.toLowerCase();for(const [rx,vid] of rules){if(rx.test(n)&&!taken.has(vid)&&byId(vid)){mine[sp.key]=vid;taken.add(vid);break;}}}
  for(const sp of speakers){
    const nm=sp.key.toLowerCase();let id="";
    const pr=msProfile(sp.label,fullText);
    if(pr.gender||pr.age){
      const fit=(v,g,a)=>v.id!=="amanda"&&!used.has(v.id)&&(mine[sp.key]===v.id||!taken.has(v.id))&&(!g||v.gender===g)&&(!a||v.age===a);
      let cands=V.filter(v=>fit(v,pr.gender,pr.age));
      if(!cands.length&&pr.age)cands=V.filter(v=>fit(v,pr.gender,""));
      if(!cands.length&&pr.gender)cands=V.filter(v=>fit(v,"",pr.age));
      if(cands.length){
        const hint=cands.find(v=>rules.some(([rx,vid])=>rx.test(nm)&&vid===v.id));
        if(hint)id=hint.id;
        else{let h=0;for(const c of nm)h=(h*31+c.charCodeAt(0))>>>0;id=cands[h%cands.length].id;}
      }
    }
    if(!id)for(const [rx,vid] of rules){ if(rx.test(nm)&&!used.has(vid)&&byId(vid)){id=vid;break;} }
    if(!id){
      let h=0;for(const c of nm)h=(h*31+c.charCodeAt(0))>>>0;
      for(let k=0;k<pool.length;k++){const c=pool[(h+k)%pool.length]; if(!used.has(c)&&byId(c)){id=c;break;}}
    }
    if(!id)id=narratorId;
    used.add(id);out[sp.key]=byId(id)||{id,name:id};
  }
  return out;
}

// Turns an uploaded photo (blob/object URL) into a small JPEG data URL the engine can use as the
// starting picture. Large phone photos are shrunk first so the request is never refused for size.
const VOICE_CHARACTERS = [
  {id:"amanda",name:"Amanda",emoji:"⭐",gender:"Female",age:"Adult",origin:"Founder",region:"InFuture",style:"Your voice · Narrator",pitch:1.0,rate:0.85,desc:"Amanda's own voice — your recorded narration.",isOwner:true},
  {id:"james",name:"James",emoji:"",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Sarcastic · Deadpan · Witty",pitch:0.86,rate:0.62,desc:"Dry British wit. Devastating things said with complete calm."},
  {id:"aurora",name:"Aurora",emoji:"",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Warm · Documentary · Authoritative",pitch:1.08,rate:0.80,desc:"Calm authority. The voice you trust completely."},
  {id:"edward",name:"Edward",emoji:"",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Theatrical · Grand · Classical",pitch:0.85,rate:0.75,desc:"Shakespearean gravitas. Every sentence carved in stone."},
  {id:"cecily",name:"Cecily",emoji:"",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Crisp · Intelligent · Sardonic",pitch:1.12,rate:0.85,desc:"Sharp as a tack. Mildly disappointed by most things."},
  {id:"nana",name:"Nana",emoji:"",gender:"Female",age:"Elderly",origin:"British",region:"Yorkshire",style:"Gentle · Wise · Warm",pitch:1.02,rate:0.70,desc:"Warm elderly wisdom. Has seen everything twice."},
  {id:"colonel",name:"Colonel",emoji:"",gender:"Male",age:"Elderly",origin:"British",region:"London",style:"Commanding · Dignified · Veteran",pitch:0.80,rate:0.74,desc:"Authority earned through decades of experience."},
  {id:"pippa",name:"Pippa",emoji:"",gender:"Female",age:"Teen",origin:"British",region:"London",style:"Bright · Cheerful · Young",pitch:1.25,rate:0.95,desc:"Fresh and warm. Natural young British energy."},
  {id:"archie",name:"Archie",emoji:"⚽",gender:"Male",age:"Teen",origin:"British",region:"Manchester",style:"Casual · Friendly · Teen",pitch:1.05,rate:0.98,desc:"Relaxed and genuine. Sounds like a real teenager."},
  {id:"ewan",name:"Ewan",emoji:"",gender:"Male",age:"Adult",origin:"Scottish",region:"Edinburgh",style:"Warm · Rugged · Sincere",pitch:0.92,rate:0.82,desc:"Deep warm Scottish sincerity."},
  {id:"fiona",name:"Fiona",emoji:"",gender:"Female",age:"Adult",origin:"Scottish",region:"Glasgow",style:"Lilting · Warm · Storyteller",pitch:1.10,rate:0.84,desc:"Beautiful Scottish lilt."},
  {id:"paddy",name:"Paddy",emoji:"☘",gender:"Male",age:"Adult",origin:"Irish",region:"Dublin",style:"Charming · Witty · Warm",pitch:0.95,rate:0.88,desc:"Easy Irish charm."},
  {id:"siobhan",name:"Siobhan",emoji:"",gender:"Female",age:"Adult",origin:"Irish",region:"Cork",style:"Gentle · Musical · Emotional",pitch:1.15,rate:0.82,desc:"Soft Irish voice with real emotional depth."},
  {id:"dafydd",name:"Dafydd",emoji:"",gender:"Male",age:"Adult",origin:"Welsh",region:"Cardiff",style:"Musical · Passionate · Rich",pitch:0.90,rate:0.80,desc:"Rich Welsh musicality."},
  {id:"marcus",name:"Marcus",emoji:"",gender:"Male",age:"Adult",origin:"American",region:"New York",style:"Deep · Cinematic · Commanding",pitch:0.72,rate:0.74,desc:"Big voice. When Marcus speaks people stop."},
  {id:"river",name:"River",emoji:"",gender:"Male",age:"Adult",origin:"American",region:"Tennessee",style:"Warm · Intimate · Storyteller",pitch:0.98,rate:0.76,desc:"Unhurried Southern charm."},
  {id:"dakota",name:"Dakota",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Chicago",style:"Bold · Direct · Confident",pitch:1.05,rate:0.92,desc:"No filler. No hesitation."},
  {id:"wade",name:"Wade",emoji:"",gender:"Male",age:"Adult",origin:"American",region:"Texas",style:"Laid Back · Humorous · Folksy",pitch:0.94,rate:0.85,desc:"Easy going Southern humour."},
  {id:"brooklyn",name:"Brooklyn",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"New York",style:"Fast · Sharp · City Energy",pitch:1.18,rate:1.10,desc:"Fast New York energy."},
  {id:"savannah",name:"Savannah",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Georgia",style:"Sweet · Gracious · Warm",pitch:1.20,rate:0.84,desc:"Warm Southern grace."},
  {id:"madison",name:"Madison",emoji:"",gender:"Female",age:"Teen",origin:"American",region:"California",style:"Upbeat · Social · Natural",pitch:1.30,rate:1.08,desc:"Real American teenage energy."},
  {id:"tyler",name:"Tyler",emoji:"",gender:"Male",age:"Teen",origin:"American",region:"Ohio",style:"Casual · Relatable · Teen",pitch:1.08,rate:1.00,desc:"Natural and unforced."},
  {id:"rosie",name:"Rosie",emoji:"",gender:"Female",age:"Child",origin:"American",region:"Florida",style:"Sweet · Innocent · Child",pitch:1.45,rate:0.88,desc:"Young warm and sweet."},
  {id:"cooper",name:"Cooper",emoji:"",gender:"Male",age:"Child",origin:"American",region:"Colorado",style:"Bright · Curious · Child",pitch:1.40,rate:0.90,desc:"Curious about everything."},
  {id:"grandma",name:"Grandma",emoji:"",gender:"Female",age:"Elderly",origin:"American",region:"Virginia",style:"Warm · Loving · Elderly",pitch:1.00,rate:0.72,desc:"Full of love and life experience."},
  {id:"frank",name:"Frank",emoji:"",gender:"Male",age:"Elderly",origin:"American",region:"New Jersey",style:"Gruff · Honest · Elder",pitch:0.78,rate:0.76,desc:"Says it straight."},
  {id:"sophia",name:"Sophia",emoji:"☀",gender:"Female",age:"Adult",origin:"Australian",region:"Sydney",style:"Upbeat · Bright · Energetic",pitch:1.35,rate:1.12,desc:"Forward energy."},
  {id:"finn",name:"Finn",emoji:"",gender:"Male",age:"Adult",origin:"Australian",region:"Melbourne",style:"Casual · Confident · Outdoorsy",pitch:0.95,rate:0.95,desc:"Relaxed Australian confidence."},
  {id:"aroha",name:"Aroha",emoji:"",gender:"Female",age:"Adult",origin:"New Zealand",region:"Auckland",style:"Warm · Grounded · Sincere",pitch:1.10,rate:0.86,desc:"Natural sincerity."},
  {id:"amara",name:"Amara",emoji:"",gender:"Female",age:"Adult",origin:"South African",region:"Cape Town",style:"Rich · Warm · Powerful",pitch:1.05,rate:0.84,desc:"Quiet power."},
  {id:"kofi",name:"Kofi",emoji:"",gender:"Male",age:"Adult",origin:"West African",region:"Ghana",style:"Deep · Rhythmic · Storyteller",pitch:0.82,rate:0.78,desc:"Every sentence has music in it."},
  {id:"priya",name:"Priya",emoji:"",gender:"Female",age:"Adult",origin:"Indian",region:"Mumbai",style:"Precise · Warm · Intelligent",pitch:1.15,rate:0.90,desc:"Warm and intelligent."},
  {id:"arjun",name:"Arjun",emoji:"",gender:"Male",age:"Adult",origin:"Indian",region:"Delhi",style:"Authoritative · Clear · Measured",pitch:0.88,rate:0.85,desc:"Sounds like someone who knows exactly what they are talking about."},
  {id:"valentina",name:"Valentina",emoji:"",gender:"Female",age:"Adult",origin:"Spanish",region:"Madrid",style:"Passionate · Warm · Expressive",pitch:1.18,rate:0.92,desc:"Everything sounds felt."},
  {id:"pierre",name:"Pierre",emoji:"",gender:"Male",age:"Adult",origin:"French",region:"Paris",style:"Suave · Dry · Cultured",pitch:0.90,rate:0.84,desc:"Makes things sound interesting."},
  {id:"ingrid",name:"Ingrid",emoji:"❄",gender:"Female",age:"Adult",origin:"Scandinavian",region:"Stockholm",style:"Clean · Cool · Direct",pitch:1.08,rate:0.88,desc:"No excess words."},
  {id:"yemi",name:"Yemi",emoji:"",gender:"Female",age:"Adult",origin:"Nigerian",region:"Lagos",style:"Bold · Joyful · Energetic",pitch:1.25,rate:1.00,desc:"Life-affirming."},
  {id:"magnus",name:"Magnus",emoji:"",gender:"Male",age:"Elderly",origin:"Fantasy",region:"Ancient",style:"Ancient · Wise · Epic",pitch:0.75,rate:0.70,desc:"Seen civilisations rise and fall."},
  {id:"nova",name:"Nova",emoji:"",gender:"Female",age:"Adult",origin:"Neutral",region:"AI",style:"Clean · Precise · Neutral",pitch:1.12,rate:0.95,desc:"No accent. No emotion. No opinion."},
  {id:"hunter",name:"Hunter",emoji:"",gender:"Male",age:"Adult",origin:"American",region:"Hollywood",style:"Trailer · Epic · Explosive",pitch:0.70,rate:0.80,desc:"Full movie trailer energy."},
  {id:"luna",name:"Luna",emoji:"",gender:"Female",age:"Adult",origin:"Neutral",region:"ASMR",style:"Whisper · ASMR · Intimate",pitch:1.20,rate:0.65,desc:"Soft whisper. Complete calm."},
  {id:"professor",name:"Professor",emoji:"",gender:"Male",age:"Elderly",origin:"British",region:"Oxford",style:"Academic · Thoughtful · Measured",pitch:0.88,rate:0.78,desc:"Distinguished. Precise."},
  {id:"hope",name:"Hope",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Heartfelt",style:"Tender · Gentle · Loving",pitch:1.15,rate:0.78,desc:"Pure tenderness."},
  {id:"storm",name:"Storm",emoji:"⛈",gender:"Male",age:"Adult",origin:"American",region:"Intense",style:"Intense · Angry · Powerful",pitch:0.82,rate:1.00,desc:"Raw intensity."},
  {id:"joy",name:"Joy",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Uplifting",style:"Excited · Joyful · Celebratory",pitch:1.40,rate:1.15,desc:"Pure infectious joy."},
  {id:"sage",name:"Sage",emoji:"",gender:"Male",age:"Adult",origin:"Neutral",region:"Mindful",style:"Peaceful · Mindful · Grounded",pitch:0.95,rate:0.72,desc:"Deep calm."},
  {id:"faith",name:"Faith",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Gospel",style:"Inspirational · Gospel · Uplifting",pitch:1.18,rate:0.88,desc:"Gospel soul."},
  {id:"rebel",name:"Rebel",emoji:"✊",gender:"Female",age:"Teen",origin:"American",region:"Activist",style:"Fierce · Defiant · Young",pitch:1.22,rate:1.05,desc:"Will not back down."},
  {id:"blaze",name:"Blaze",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"Cinematic",style:"Warm · Confident · Cinematic",pitch:1.02,rate:0.95,desc:"Warm cinematic narrator."},
  {id:"remy",name:"Remy",emoji:"",gender:"Male",age:"Adult",origin:"French",region:"Lyon",style:"Smooth · Romantic · Intimate",pitch:0.92,rate:0.80,desc:"Everything sounds like poetry."},
  {id:"zhara",name:"Zhara",emoji:"",gender:"Female",age:"Adult",origin:"Middle Eastern",region:"Dubai",style:"Elegant · Warm · Sophisticated",pitch:1.10,rate:0.85,desc:"Graceful and precise."},
  {id:"kai",name:"Kai",emoji:"",gender:"Male",age:"Adult",origin:"Hawaiian",region:"Honolulu",style:"Relaxed · Warm · Soulful",pitch:0.96,rate:0.82,desc:"Unhurried ocean warmth."},
  {id:"sienna",name:"Sienna",emoji:"",gender:"Female",age:"Adult",origin:"American",region:"New Orleans",style:"Soulful · Blues · Deep",pitch:1.05,rate:0.78,desc:"Every word feels lived-in."},
  {id:"atlas",name:"Atlas",emoji:"",gender:"Male",age:"Adult",origin:"Neutral",region:"Epic",style:"Cinematic · Epic · Booming",pitch:0.68,rate:0.76,desc:"The voice of a thousand documentaries."},
  {id:"echo",name:"Echo",emoji:"",gender:"Female",age:"Adult",origin:"Neutral",region:"Ethereal",style:"Ethereal · Dreamy · Otherworldly",pitch:1.22,rate:0.72,desc:"Sounds like it came from somewhere else."},
];
function msBedSource(ac,dest,vol){
  const sr=ac.sampleRate, secs=32, n=Math.floor(sr*secs);
  const pad=ac.createBuffer(2,n,sr);
  const chords=[[110,164.81,220,277.18],[87.31,130.81,174.61,261.63],[130.81,196,261.63,329.63],[98,146.83,196,246.94]];
  for(let ch=0;ch<2;ch++){
    const d=pad.getChannelData(ch);
    for(let i=0;i<n;i++){
      const t=i/sr, seg=Math.floor(t/8)%4, st=t%8;
      const env=Math.min(1,st/2)*Math.min(1,(8-st)/2);
      let v=0; const c=chords[seg];
      for(let k=0;k<c.length;k++){ v+=Math.sin(2*Math.PI*c[k]*(1+(ch?0.002:-0.002)*(k+1))*t)*(0.22/(1+k*0.3)); }
      d[i]=v*env*0.6;
    }
  }
  const src=ac.createBufferSource(); src.buffer=pad; src.loop=true;
  const g=ac.createGain(); g.gain.value=vol; src.connect(g); g.connect(dest);
  return {src,gain:g};
}
export { supabase, authToken, engineAuthHeaders, msVoiceText, msVoiceGroups, proxyFetch, engineSpeak, translateText, LANGUAGES, msSpokenOnly, msParseCast, msCastVoices, VOICE_CHARACTERS, msBedSource, msBlobSeconds };
