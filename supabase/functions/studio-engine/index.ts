// Mandas Film & Music Studio engine: video, music, image, and FREE stock (no credit).
// Finished files are passed back through this function so the app can always load them.
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"GET, POST, OPTIONS"};
const J=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...CORS,"Content-Type":"application/json"}});
const TOKEN=()=>Deno.env.get("REPLICATE_API_TOKEN")||"";
const API="https://api.replicate.com/v1";
const SELF="https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/studio-engine";
const UA={"User-Agent":"MandasFilmMusicStudio/1.0 (mandasfilmmusicstudio.bolt.host)"};
const H=()=>({"Authorization":"Bearer "+TOKEN(),"Content-Type":"application/json"});
const first=(o:unknown)=>Array.isArray(o)?o[0]:o;
const clean=(s:unknown)=>String(s||"").replace(/replicate/gi,"engine");
const wrap=(u:unknown)=>{const s=String(u||"");return s?SELF+"?f="+encodeURIComponent(s):"";};
const okHost=(u:string)=>{try{const h=new URL(u).hostname;return h==="replicate.delivery"||h.endsWith(".replicate.delivery")||h.endsWith(".r2.cloudflarestorage.com")||h.endsWith(".wikimedia.org")||h.endsWith(".pexels.com");}catch(e){return false;}};
const MODELS:Record<string,string>={video:"minimax/video-01",music:"meta/musicgen",image:"black-forest-labs/flux-schnell"};
const VER:Record<string,string>={};
async function create(model:string,input:Record<string,unknown>){
  let r=await fetch(API+"/models/"+model+"/predictions",{method:"POST",headers:H(),body:JSON.stringify({input})});
  if(r.status===404||r.status===422){
    if(!VER[model]){const m=await fetch(API+"/models/"+model,{headers:H()});const mj=await m.json().catch(()=>({}));if(mj&&mj.latest_version&&mj.latest_version.id)VER[model]=mj.latest_version.id;}
    if(VER[model])r=await fetch(API+"/predictions",{method:"POST",headers:H(),body:JSON.stringify({version:VER[model],input})});
  }
  const p=await r.json().catch(()=>({}));
  if(!r.ok){ console.log("create failed",model,r.status,JSON.stringify(p).slice(0,300)); return {error:clean(p.detail||p.title||("Engine error "+r.status)),code:r.status,nocredit:r.status===402}; }
  return {id:p.id,status:p.status,url:p.status==="succeeded"?wrap(first(p.output)):""};
}
// When nothing matches a scene, these wide subjects always have pictures.
const WIDE=["space","rocket launch","planet","earth from space","galaxy","nebula","moon surface","astronaut","sunrise","city skyline at night","ocean waves","mountains","forest","desert","clouds","crowd of people"];
const STOPW=new Set("the and with from into over under that this their there scene shot camera slow light warm cold gold amber grade film".split(" "));
// Wikimedia Commons search: a real free photo (no key needed).
async function commons(query:string,minW:number,skip:number){
  try{
    const api="https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1600&gsrsearch="+encodeURIComponent("filetype:bitmap "+query);
    const r=await fetch(api,{headers:UA});const j=await r.json();
    const pages=Object.values((j.query&&j.query.pages)||{}) as any[];
    pages.sort((a,b)=>(a.index||0)-(b.index||0));
    const ok=pages.filter(p=>{const ii=(p.imageinfo||[])[0];return ii&&/jpeg|png/.test(ii.mime||"")&&(ii.width||0)>=minW;});
    if(!ok.length)return null;
    const p=ok[skip%ok.length];const ii=p.imageinfo[0];
    return {url:wrap(ii.thumburl||ii.url),type:"image",credit:p.title};
  }catch(e){return null;}
}
// FREE stock: a real stock video if a Pexels key is set, otherwise a real photo from Wikimedia Commons.
// It never comes back empty: it widens the search step by step, ending with space, rockets and planets.
async function stock(q:string){
  const key=Deno.env.get("PEXELS_API_KEY");
  if(key){
    try{const r=await fetch("https://api.pexels.com/videos/search?per_page=3&orientation=landscape&query="+encodeURIComponent(q),{headers:{Authorization:key}});const j=await r.json();
      for(const v of (j.videos||[])){const f=(v.video_files||[]).filter((x:any)=>x.file_type==="video/mp4"&&x.width>=1280).sort((a:any,b:any)=>a.width-b.width)[0];if(f)return {url:wrap(f.link),type:"video"};}}catch(e){}
  }
  const words=q.split(/\s+/).filter(Boolean);
  const singles=words.map(w=>w.toLowerCase().replace(/[^a-z0-9-]/g,"")).filter(w=>w.length>=4&&!STOPW.has(w));
  const seed=[...q].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  // 1) the scene's own words, then shorter, then each word alone
  for(const query of [q, words.slice(0,3).join(" "), words.slice(0,2).join(" "), ...singles.slice(0,4)]){
    if(!query)continue;
    const hit=await commons(query,900,0); if(hit)return hit;
  }
  // 2) wide subjects - picked by the scene so neighbouring scenes don't repeat the same picture
  for(let k=0;k<WIDE.length;k++){
    const hit=await commons(WIDE[(seed+k)%WIDE.length],640,seed); if(hit)return {...hit,wide:true};
  }
  return {url:"",type:""};
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:CORS});
  const u=new URL(req.url);
  const f=u.searchParams.get("f");
  if(req.method==="GET"&&f){
    if(!okHost(f))return J({error:"Not allowed"},400);
    const hdr:Record<string,string>={...UA}; const rg=req.headers.get("range"); if(rg)hdr.range=rg;
    const r=await fetch(f,{headers:hdr});
    const h=new Headers(CORS);
    for(const k of ["content-type","content-length","content-range","accept-ranges"]){const v=r.headers.get(k);if(v)h.set(k,v);}
    h.set("Cache-Control","public, max-age=86400");
    return new Response(r.body,{status:r.status,headers:h});
  }
  try{
    if(req.method==="POST"){
      const b=await req.json();
      if(b.kind==="stock")return J(await stock(String(b.query||"cinematic landscape").slice(0,120)));
      if(!TOKEN())return J({error:"Engine key missing",nocredit:true});
      if(b.id){
        const r=await fetch(API+"/predictions/"+b.id,{headers:H()});
        const p=await r.json();
        if(p.status==="failed")console.log("failed",b.id,String(p.error).slice(0,300));
        return J({id:p.id,status:p.status,url:p.status==="succeeded"?wrap(first(p.output)):"",error:p.error?clean(p.error):""});
      }
      const kind=String(b.kind||"video");
      let input:Record<string,unknown>={};
      if(kind==="video"){ input={prompt:String(b.prompt||"").slice(0,1800),prompt_optimizer:true}; if(b.image)input.first_frame_image=b.image; }
      else if(kind==="music"){ input={prompt:String(b.prompt||"cinematic orchestral score").slice(0,500),duration:Math.max(5,Math.min(30,Number(b.duration)||30)),model_version:"stereo-large",output_format:"mp3"}; }
      else if(kind==="image"){ input={prompt:String(b.prompt||"").slice(0,1500),aspect_ratio:String(b.aspect_ratio||"16:9"),output_format:"png"}; }
      else return J({error:"Unknown kind"});
      return J(await create(MODELS[kind],input));
    }
    if(!TOKEN())return J({ok:false,error:"Engine key missing"});
    const r=await fetch(API+"/account",{headers:H()});
    const a=await r.json().catch(()=>({}));
    return J({ok:r.ok,status:r.status,message:r.ok?"Engine ready":clean(a.detail||"Engine key not accepted")});
  }catch(e){ console.log("crash",String(e)); return J({error:clean(e)},200); }
});
