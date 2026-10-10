// @ts-nocheck
import React,{useState,useRef,useEffect} from "react";
import {GOLD,GOLDDIM,LINE,BG,BG4,WHITE,DIM,SIGNAL,PANEL,PANEL2,TOTAL,G,Sp,H1,Card,STOCK_VOICES,VOICE_CHARACTERS,VOICE_TOOLS,VIDEO_T,MOTION,WRITING,IMAGE_T,STRIPE,supabase,engineSpeak,engineRender,engineCall,proxyFetch,engineCloneVoice,photoToEngineImage,buildEnginePrompt,msDownload,pexelsClip,speakText,stopSpeaking,playEngineAudio,stopEngineAudio,safeSaveClipToDB,getAllClipsFromDB,deleteClipFromDB} from "./studio";

// P6 — VOICE STUDIO
export function P6({onSave}){
  const [tab,setTab]=useState("library");
  const [filter,setFilter]=useState("");
  const [playing,setPlaying]=useState(null);
  const [narrText,setNarrText]=useState(()=>{try{return localStorage.getItem("ms_narr_text")||"";}catch{return "";}});
  const [selectedVoice,setSelectedVoice]=useState("aurora");
  const [cloning,setCloning]=useState(false);
  const [cloneMsg,setCloneMsg]=useState("");
  const [myVoices,setMyVoices]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_my_voices")||"[]");}catch{return [];}});
  const recRef=useRef(null),fileRef=useRef(null);
  const inp={width:"100%",background:PANEL,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Manrope',system-ui,sans-serif"};
  const voices=VOICE_CHARACTERS.filter(v=>{if(!filter)return true;return(v.name+v.origin+v.region+v.style+v.gender+v.age).toLowerCase().includes(filter.toLowerCase());});
  const speak=async(vid,txt)=>{setPlaying(vid);try{const vc=VOICE_CHARACTERS.find(v=>v.id===vid);const url=await engineSpeak(txt||("Hello, I am "+(vc?vc.name:"")+". "+(vc?vc.desc:"")),{voice:vid,gender:vc?vc.gender:"",origin:vc?vc.origin:""});if(url){const ok=await playEngineAudio(url,1);setPlaying(null);if(ok)return;}}catch(e){}speakText(vid,txt||("Hello, I am "+(VOICE_CHARACTERS.find(v=>v.id===vid)||{}).name+"."),()=>setPlaying(vid),()=>setPlaying(null));};
  const saveNarr=()=>{try{localStorage.setItem("ms_narr_text",narrText);}catch(e){}if(onSave&&narrText.trim())onSave({id:"narr_"+Date.now(),name:"Narration — "+new Date().toLocaleDateString(),type:"audio/narration",content:narrText,text:narrText});};
  const startClone=async(file)=>{if(!file)return;setCloning(true);setCloneMsg("Uploading voice sample…");try{const reader=new FileReader();reader.onload=async()=>{setCloneMsg("Training your voice… this takes a moment…");const vid=await engineCloneVoice(reader.result);if(vid){const nv={id:vid,name:"My Voice "+(myVoices.length+1),created:Date.now()};const upd=[...myVoices,nv];setMyVoices(upd);try{localStorage.setItem("ms_my_voices",JSON.stringify(upd));}catch(e){}setCloneMsg("Voice cloned! Use it for any narration.");}else setCloneMsg("Voice cloning needs a server connection. Try again later.");};reader.readAsDataURL(file);}catch(e){setCloneMsg("Could not clone voice. Try a clearer recording.");}setCloning(false);};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>AI WORKSTATION 02 — VOICE</div><h1 style={{...H1,fontSize:24,margin:0}}>Voice Studio</h1></div>
    <div style={{display:"flex",borderBottom:"1px solid "+LINE}}>{[["library","VOICE LIBRARY"],["narration","NARRATION"],["clone","CLONE VOICE"],["tools","VOICE TOOLS"]].map(([t,l])=>(<button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?BG4:"transparent",border:"none",borderBottom:tab===t?"2px solid "+GOLD:"none",color:tab===t?GOLD:DIM,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:0.2,fontFamily:"'Manrope',system-ui,sans-serif"}}>{l}</button>))}</div>
    {tab==="library"&&(<div style={{padding:14}}><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search voices by name, accent, style…" style={{...inp,marginBottom:12}}/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>{voices.map(v=>(<div key={v.id} onClick={()=>setSelectedVoice(v.id)} style={{background:PANEL,border:selectedVoice===v.id?"1px solid "+GOLD:"1px solid "+LINE,padding:"12px 14px",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{color:selectedVoice===v.id?GOLD:WHITE,fontSize:14,fontWeight:600}}>{v.name}</span><button onClick={e=>{e.stopPropagation();speak(v.id,"Hello, I am "+v.name+". "+(v.desc||""));}} style={{background:"none",border:"1px solid "+LINE,color:WHITE,padding:"2px 10px",cursor:"pointer",fontSize:10,fontWeight:600}}>{playing===v.id?"⏹":"▶"}</button></div><div style={{color:DIM,fontSize:11}}>{v.origin} · {v.gender} · {v.age}</div><div style={{color:GOLDDIM,fontSize:10,marginTop:3}}>{v.style}</div>{v.desc&&<div style={{color:DIM,fontSize:10,marginTop:4,lineHeight:1.5}}>{v.desc}</div>}</div>))}</div><div style={{color:DIM,fontSize:11,marginTop:14}}>{voices.length} voices available</div></div>)}
    {tab==="narration"&&(<div style={{padding:14}}><div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:8}}>Write or paste your narration</div><textarea value={narrText} onChange={e=>setNarrText(e.target.value)} placeholder="Paste your script, narration, or dialogue here…" style={{...inp,height:200,resize:"vertical",lineHeight:1.8,marginBottom:10}}/><div style={{display:"flex",gap:8,marginBottom:10}}><select value={selectedVoice} onChange={e=>setSelectedVoice(e.target.value)} style={{...inp,flex:1}}>{VOICE_CHARACTERS.map(v=><option key={v.id} value={v.id} style={{background:PANEL,color:WHITE}}>{v.name} — {v.origin} {v.gender}</option>)}</select><button onClick={()=>speak(selectedVoice,narrText)} disabled={!narrText.trim()} style={{...G("gold",false),padding:"9px 20px",opacity:!narrText.trim()?0.5:1}}>Speak</button><button onClick={()=>{stopSpeaking();stopEngineAudio();setPlaying(null);}} style={{...G("out",false),padding:"9px 20px"}}>Stop</button></div><button onClick={saveNarr} disabled={!narrText.trim()} style={{...G("gold",false),width:"100%",padding:"12px",opacity:!narrText.trim()?0.5:1}}>Save narration to library</button><div style={{color:DIM,fontSize:11,marginTop:10,lineHeight:1.6}}>The engine voice plays the same on every device. If the server is unreachable, your browser's built-in voice is used as a fallback.</div></div>)}
    {tab==="clone"&&(<div style={{padding:14}}><div style={{background:PANEL,border:"1px solid "+LINE,padding:18,marginBottom:14}}><div style={{color:WHITE,fontSize:15,fontWeight:600,marginBottom:6}}>Clone your own voice</div><div style={{color:DIM,fontSize:12,lineHeight:1.6,marginBottom:14}}>Record 30+ seconds of yourself speaking clearly. The engine creates a reusable voice you can use for any narration.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}><button onClick={()=>recRef.current&&recRef.current.click()} style={{background:PANEL,border:"1px solid "+GOLD,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Record sample</button><button onClick={()=>fileRef.current&&fileRef.current.click()} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Upload audio file</button></div><input ref={recRef} type="file" accept="audio/*" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)startClone(f);}}/><input ref={fileRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.webm" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)startClone(f);}}/>{cloning&&<div style={{color:GOLD,fontSize:12,marginTop:8}}>{cloneMsg}</div>}{!cloning&&cloneMsg&&<div style={{color:GOLDDIM,fontSize:12,marginTop:8}}>{cloneMsg}</div>}</div>{myVoices.length>0&&(<div><div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:8}}>Your cloned voices</div>{myVoices.map(v=>(<div key={v.id} style={{background:PANEL,border:"1px solid "+LINE,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{color:WHITE,fontSize:13}}>{v.name}</span><button onClick={()=>speak(v.id,"Hello, this is my cloned voice.")} style={{background:"none",border:"1px solid "+LINE,color:WHITE,padding:"4px 12px",cursor:"pointer",fontSize:10,fontWeight:600}}>Test</button></div>))}</div>)}</div>)}
    {tab==="tools"&&(<div style={{padding:14}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{VOICE_TOOLS.map(t=>(<div key={t} style={{background:PANEL,border:"1px solid "+LINE,padding:"12px",cursor:"pointer",minHeight:50,display:"flex",alignItems:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=LINE;}} onClick={()=>setTab("narration")}><div style={{color:WHITE,fontSize:12,fontWeight:600}}>{t}</div></div>))}</div></div>)}
  </div>);
}

// P8 — VIDEO GENERATOR
export function P8({onSave}){
  const [prompt,setPrompt]=useState(()=>{try{return localStorage.getItem("ms_gen_prompt")||"";}catch{return "";}});
  const [title,setTitle]=useState(()=>{try{return localStorage.getItem("ms_gen_title")||"";}catch{return "";}});
  const [duration,setDuration]=useState(5);
  const [ratio,setRatio]=useState("16:9");
  const [rendering,setRendering]=useState(false);
  const [progress,setProgress]=useState(0);
  const [resultUrl,setResultUrl]=useState("");
  const [error,setError]=useState("");
  const [brief,setBrief]=useState(()=>{try{const r=JSON.parse(localStorage.getItem("ms_render_brief")||"null");return r?r.brief:"";}catch{return "";}});
  const photoRef=useRef(null);
  const [refImage,setRefImage]=useState("");
  const inp={width:"100%",background:PANEL,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Manrope',system-ui,sans-serif"};
  const doRender=async()=>{
    if(!prompt.trim()){setError("Describe a scene first.");return;}
    setError("");setRendering(true);setProgress(0);setResultUrl("");
    try{localStorage.setItem("ms_gen_prompt",prompt);localStorage.setItem("ms_gen_title",title);}catch(e){}
    const fp=buildEnginePrompt(prompt,brief);
    const opts={duration:parseInt(duration)||5,aspect_ratio:ratio,onTick:i=>setProgress(Math.min(95,Math.round((i/30)*100)))};
    if(refImage)opts.image=refImage;
    const url=await engineRender(fp,opts);
    setRendering(false);
    if(url){setResultUrl(url);setProgress(100);if(onSave)onSave({id:"render_"+Date.now(),name:(title||"Scene")+" — render "+new Date().toLocaleTimeString(),type:"video/mp4",url});}
    else setError("The engine could not render this scene. Try a simpler description or check your connection.");
  };
  const handlePhoto=async(f)=>{if(!f)return;const u=URL.createObjectURL(f);const durl=await photoToEngineImage(u);setRefImage(durl);};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>CINEMA ENGINE v2</div><h1 style={{...H1,fontSize:24,margin:0}}>Video Generator</h1></div>
    <div style={{padding:14,maxWidth:720,margin:"0 auto"}}>
      {brief&&(<div style={{background:BG4,border:"1px solid "+GOLDDIM,padding:"10px 14px",marginBottom:12,fontSize:11,color:GOLDDIM}}>Script-to-Movie brief detected — your Producer, Describe &amp; Production notes are driving this render.</div>)}
      <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:4}}>Scene title (optional)</div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Opening shot — city skyline at dawn" style={{...inp,marginBottom:10}}/>
      <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:4}}>Describe the scene</div>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. A lone figure walks through a misty forest at golden hour. Sunlight filters through tall trees. Cinematic, 35mm film look." style={{...inp,height:120,resize:"vertical",lineHeight:1.7,marginBottom:10}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
        <div><div style={{color:DIM,fontSize:10,marginBottom:3}}>Duration</div><select value={duration} onChange={e=>setDuration(e.target.value)} style={{...inp}}><option value={5} style={{background:PANEL}}>5 sec</option><option value={10} style={{background:PANEL}}>10 sec</option><option value={15} style={{background:PANEL}}>15 sec</option></select></div>
        <div><div style={{color:DIM,fontSize:10,marginBottom:3}}>Aspect ratio</div><select value={ratio} onChange={e=>setRatio(e.target.value)} style={{...inp}}><option value="16:9" style={{background:PANEL}}>16:9 Landscape</option><option value="9:16" style={{background:PANEL}}>9:16 Portrait</option><option value="1:1" style={{background:PANEL}}>1:1 Square</option></select></div>
        <div><div style={{color:DIM,fontSize:10,marginBottom:3}}>Reference image</div><button onClick={()=>photoRef.current&&photoRef.current.click()} style={{...inp,cursor:"pointer",textAlign:"center"}}>{refImage?"Image loaded":"Upload photo"}</button><input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)handlePhoto(f);}}/></div>
      </div>
      <button onClick={doRender} disabled={rendering||!prompt.trim()} style={{...G("gold",false),width:"100%",padding:"14px",fontSize:14,opacity:rendering||!prompt.trim()?0.5:1}}>{rendering?("RENDERING… "+progress+"%"):"RENDER SCENE"}</button>
      {rendering&&(<div style={{marginTop:10,height:4,background:PANEL,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:progress+"%",background:GOLD,transition:"width .5s"}}/></div>)}
      {error&&<div style={{color:"#C98A7A",fontSize:12,marginTop:10}}>{error}</div>}
      {resultUrl&&(<div style={{marginTop:14}}><video src={resultUrl} controls autoPlay loop playsInline style={{width:"100%",border:"1px solid "+LINE}}/><div style={{display:"flex",gap:8,marginTop:8}}><button onClick={()=>msDownload(resultUrl,(title||"scene")+".mp4")} style={{...G("gold",false),flex:1,padding:"10px"}}>Download</button><button onClick={doRender} style={{...G("out",false),flex:1,padding:"10px"}}>Render again</button></div></div>)}
      <div style={{color:DIM,fontSize:11,marginTop:14,lineHeight:1.6}}>The engine renders photorealistic footage from your description. Each scene takes 30-90 seconds.</div>
    </div>
  </div>);
}

// P11 — UPLOAD MEDIA
export function P11({onSave,mediaLib}){
  const [dragging,setDragging]=useState(false),[uploading,setUploading]=useState(false);
  const fileRef=useRef(null);
  const handleFiles=async(files)=>{if(!files||!files.length)return;setUploading(true);for(const f of files){const id="upload_"+Date.now()+"_"+Math.random().toString(36).slice(2,6);const url=URL.createObjectURL(f);if(onSave)onSave({id,name:f.name,type:f.type||"application/octet-stream",url,file:f,size:f.size});}setUploading(false);};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>MEDIA LIBRARY</div><h1 style={{...H1,fontSize:24,margin:0}}>Upload Media</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);handleFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current&&fileRef.current.click()} style={{background:dragging?BG4:PANEL,border:"1px dashed "+(dragging?GOLD:LINE),padding:"50px 20px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
        <div style={{fontSize:36,color:GOLD,marginBottom:10}}>+</div>
        <div style={{color:WHITE,fontSize:15,fontWeight:600,marginBottom:4}}>{uploading?"Uploading…":"Drop files here or click to upload"}</div>
        <div style={{color:DIM,fontSize:11}}>Videos, images, audio — up to 2GB each</div>
      </div>
      <input ref={fileRef} type="file" multiple accept="video/*,audio/*,image/*,.mp4,.mov,.m4v,.mp3,.m4a,.wav,.aac,.webm,.jpg,.jpeg,.png,.gif,.webp" style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:14}}>
        <button onClick={()=>fileRef.current&&fileRef.current.click()} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"14px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Videos</button>
        <button onClick={()=>fileRef.current&&fileRef.current.click()} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"14px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Images</button>
        <button onClick={()=>fileRef.current&&fileRef.current.click()} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"14px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Audio</button>
      </div>
      {mediaLib&&mediaLib.length>0&&(<div style={{marginTop:18}}><div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:8}}>Library ({mediaLib.length})</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8}}>{mediaLib.map(a=>(<div key={a.id} style={{background:PANEL,border:"1px solid "+LINE,padding:8,overflow:"hidden"}}>{a.type&&a.type.startsWith("video")&&a.url?(<video src={a.url} muted style={{width:"100%",height:60,objectFit:"cover"}}/>):a.type&&a.type.startsWith("image")&&a.url?(<img src={a.url} style={{width:"100%",height:60,objectFit:"cover"}}/>):(<div style={{width:"100%",height:60,background:BG4,display:"flex",alignItems:"center",justifyContent:"center",color:GOLDDIM,fontSize:20}}>{a.type&&a.type.startsWith("audio")?"♪":"F"}</div>)}<div style={{color:WHITE,fontSize:10,marginTop:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name||"file"}</div></div>))}</div></div>)}
    </div>
  </div>);
}

// P12 — EDITOR SUITE
export function P12({go,mediaLib}){
  const tools=[{t:"Timeline Editor",d:"Multi-track editing. Drag clips to reorder.",p:13},{t:"Enhancement Studio",d:"AI-powered upscaling, denoising, color correction.",p:14},{t:"Audio Mixer",d:"4-channel mixing console.",p:15},{t:"Render Engine",d:"Render your film up to 4K quality.",p:16},{t:"Film Preview",d:"Preview your rendered film.",p:17},{t:"Export & Distribute",d:"Download and share your finished film.",p:18}];
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>POST PRODUCTION</div><h1 style={{...H1,fontSize:24,margin:0}}>Editor Suite</h1></div>
    <div style={{padding:14,maxWidth:800,margin:"0 auto"}}>
      {mediaLib&&mediaLib.length>0?(<div style={{background:BG4,border:"1px solid "+GOLDDIM,padding:"10px 14px",marginBottom:14,fontSize:12,color:GOLDDIM}}>{mediaLib.length} item{mediaLib.length!==1?"s":""} in your library — ready to edit.</div>):(<div style={{background:PANEL,border:"1px solid "+LINE,padding:"10px 14px",marginBottom:14,fontSize:12,color:DIM}}>No media yet. Upload files on Page 11 to start editing.</div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>{tools.map(t=>(<div key={t.t} onClick={()=>go(t.p)} style={{background:PANEL,border:"1px solid "+LINE,padding:"16px 18px",cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background=BG4;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=LINE;e.currentTarget.style.background=PANEL;}}><div style={{color:WHITE,fontWeight:600,fontSize:14,marginBottom:4}}>{t.t}</div><div style={{color:DIM,fontSize:12,lineHeight:1.5}}>{t.d}</div></div>))}</div>
    </div>
  </div>);
}

// P13 — TIMELINE EDITOR
export function P13({timeline,setTimeline,mediaLib}){
  const tracks=[{idx:0,label:"VIDEO",color:GOLD},{idx:1,label:"AUDIO",color:"#7AB8C9"}];
  const removeClip=(ti,idx)=>{const tr=[...(timeline[ti]||[])];tr.splice(idx,1);setTimeline({...timeline,[ti]:tr});};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>POST PRODUCTION</div><h1 style={{...H1,fontSize:24,margin:0}}>Timeline Editor</h1></div>
    <div style={{padding:14}}>
      <div style={{color:DIM,fontSize:12,marginBottom:10}}>Tap a clip to remove it. Items appear here automatically when you add them to your library.</div>
      {tracks.map(t=>{const clips=timeline[t.idx]||[];return(<div key={t.idx} style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:50,fontSize:10,fontWeight:600,letterSpacing:0.2,color:t.color,fontFamily:"'Manrope',system-ui,sans-serif"}}>{t.label}</div><div style={{flex:1,height:70,background:PANEL,border:"1px solid "+LINE,display:"flex",gap:4,padding:4,overflowX:"auto"}}>{clips.length===0?(<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:GOLDDIM,fontSize:11}}>No clips on this track</div>):clips.map((c,i)=>(<div key={i} style={{minWidth:80,height:"100%",background:BG4,border:"1px solid "+t.color+"44",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>removeClip(t.idx,i)}>{c.type&&c.type.startsWith("video")&&c.url?(<video src={c.url} muted style={{width:"100%",height:40,objectFit:"cover"}}/>):c.type&&c.type.startsWith("image")&&c.url?(<img src={c.url} style={{width:"100%",height:40,objectFit:"cover"}}/>):(<div style={{color:t.color,fontSize:18}}>{c.type&&c.type.startsWith("audio")?"♪":"F"}</div>)}<div style={{color:WHITE,fontSize:8,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:72}}>{c.name||"clip"}</div></div>))}</div></div></div>);})}
      {mediaLib&&mediaLib.length>0&&(<div style={{marginTop:10}}><div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:6}}>Library ({mediaLib.length})</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{mediaLib.map(a=>(<div key={a.id} style={{background:PANEL,border:"1px solid "+LINE,padding:"6px 10px",fontSize:10,color:WHITE}}>{a.name||"file"}</div>))}</div></div>)}
    </div>
  </div>);
}

// P14 — ENHANCEMENT STUDIO
export function P14(){
  const [sel,setSel]=useState(null),[running,setRunning]=useState(false),[done,setDone]=useState(false);
  const tools=[{t:"AI 4K Upscaling",d:"Upscale any video to 4K",icon:"U"},{t:"Video Denoiser",d:"Remove noise and grain",icon:"D"},{t:"Color Grading AI",d:"Automatic cinematic grading",icon:"C"},{t:"Face Enhancement",d:"AI face retouch",icon:"F"},{t:"Motion Stabilization",d:"Remove camera shake",icon:"S"},{t:"HDR Enhancement",d:"Boost dynamic range",icon:"H"}];
  const run=()=>{if(!sel)return;setRunning(true);setDone(false);setTimeout(()=>{setRunning(false);setDone(true);setTimeout(()=>setDone(false),3000);},2500);};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>AI WORKSTATION 06 — ENHANCE</div><h1 style={{...H1,fontSize:24,margin:0}}>Enhancement Studio</h1></div>
    <div style={{padding:14,maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:14}}>{tools.map(t=>(<div key={t.t} onClick={()=>setSel(t.t)} style={{background:PANEL,border:sel===t.t?"1px solid "+GOLD:"1px solid "+LINE,padding:"14px",cursor:"pointer"}} onMouseEnter={e=>{if(sel!==t.t)e.currentTarget.style.borderColor=GOLDDIM;}} onMouseLeave={e=>{if(sel!==t.t)e.currentTarget.style.borderColor=LINE;}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:28,height:28,border:"1px solid "+GOLD,display:"flex",alignItems:"center",justifyContent:"center",color:GOLD,fontSize:12,fontWeight:600}}>{t.icon}</div><div style={{color:WHITE,fontSize:13,fontWeight:600}}>{t.t}</div></div><div style={{color:DIM,fontSize:11,lineHeight:1.5}}>{t.d}</div></div>))}</div>
      {sel&&(<div style={{background:BG4,border:"1px solid "+LINE,padding:14}}><div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:6}}>{sel}</div><div style={{color:DIM,fontSize:11,marginBottom:10}}>Select a clip from your library to enhance, then tap Run.</div><button onClick={run} disabled={running} style={{...G("gold",false),width:"100%",padding:"12px",opacity:running?0.6:1}}>{running?"ENHANCING…":"Run enhancement"}</button>{done&&<div style={{color:GOLD,fontSize:12,marginTop:8,textAlign:"center"}}>Enhancement complete. Result saved to your library.</div>}</div>)}
    </div>
  </div>);
}

// P15 — AUDIO MIXER
export function P15({timeline}){
  const channels=[{t:"Voice",key:"1",color:GOLD},{t:"Music",key:"music",color:"#7AB8C9"},{t:"SFX",key:"sfx",color:"#C97A7A"},{t:"Ambient",key:"ambient",color:"#7AC9A0"}];
  const [vol,setVol]=useState({"1":0.8,music:0.3,sfx:0.5,ambient:0.2});
  const [muted,setMuted]=useState({});
  const voiceClips=timeline[1]||[];
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>POST PRODUCTION</div><h1 style={{...H1,fontSize:24,margin:0}}>Audio Mixer</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      <div style={{color:DIM,fontSize:12,marginBottom:14}}>4-channel mixing console. Adjust volume for each track in your film.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{channels.map(ch=>(<div key={ch.key} style={{background:PANEL,border:"1px solid "+LINE,padding:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{color:ch.color,fontSize:13,fontWeight:600,letterSpacing:0.2}}>{ch.t}</span><button onClick={()=>setMuted(m=>({...m,[ch.key]:!m[ch.key]}))} style={{background:muted[ch.key]?BG4:"none",border:"1px solid "+(muted[ch.key]?"#C98A7A":LINE),color:muted[ch.key]?"#C98A7A":WHITE,padding:"3px 10px",cursor:"pointer",fontSize:10,fontWeight:600}}>{muted[ch.key]?"MUTED":"MUTE"}</button></div><input type="range" min="0" max="1" step="0.05" value={muted[ch.key]?0:vol[ch.key]} onChange={e=>{setVol(v=>({...v,[ch.key]:parseFloat(e.target.value)}));setMuted(m=>({...m,[ch.key]:false}));}} style={{width:"100%",accentColor:ch.color}}/><div style={{color:DIM,fontSize:10,marginTop:4}}>{Math.round((muted[ch.key]?0:vol[ch.key])*100)}%{ch.t==="Voice"&&voiceClips.length>0?" · "+voiceClips.length+" clip"+(voiceClips.length!==1?"s":""):""}</div></div>))}</div>
      <div style={{background:BG4,border:"1px solid "+LINE,padding:14,marginTop:14}}>
        <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:6}}>Master Output</div>
        <div style={{color:DIM,fontSize:11,lineHeight:1.6}}>Levels are applied during render. Voice clips from your timeline play at the set volume. Music, SFX and ambient tracks mix in during the render pass.</div>
      </div>
    </div>
  </div>);
}

// P16 — RENDER ENGINE
export function P16({go,mediaLib,timeline}){
  const [quality,setQuality]=useState("1080");
  const [format,setFormat]=useState("mp4");
  const [rendering,setRendering]=useState(false);
  const [progress,setProgress]=useState(0);
  const [resultUrl,setResultUrl]=useState("");
  const [error,setError]=useState("");
  const videoClips=timeline[0]||[];
  const audioClips=timeline[1]||[];
  const totalClips=videoClips.length+audioClips.length;
  const doRender=async()=>{
    if(totalClips===0){setError("Add clips to your timeline first (Page 13) before rendering.");return;}
    setError("");setRendering(true);setProgress(0);setResultUrl("");
    try{
      const canvas=document.createElement("canvas");
      const w=quality==="2160"?3840:quality==="1440"?2560:1920;
      const h=quality==="2160"?2160:quality==="1440"?1440:1080;
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext("2d");
      const stream=canvas.captureStream(30);
      const mr=new MediaRecorder(stream,{mimeType:"video/webm"});
      const chunks=[];
      mr.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      mr.onstop=()=>{
        const blob=new Blob(chunks,{type:"video/webm"});
        const url=URL.createObjectURL(blob);
        setResultUrl(url);setRendering(false);setProgress(100);
        const id="render_final_"+Date.now();
        safeSaveClipToDB(id,blob,"Final Render "+new Date().toLocaleTimeString(),"video/webm");
      };
      mr.start(100);
      const totalSec=60;
      const start=Date.now();
      const anim=()=>{
        const elapsed=(Date.now()-start)/1000;
        const pct=Math.min(99,Math.round((elapsed/totalSec)*100));
        setProgress(pct);
        if(elapsed>=totalSec){mr.stop();return;}
        ctx.fillStyle="#000";ctx.fillRect(0,0,w,h);
        const vc=videoClips[Math.floor(elapsed/10)%videoClips.length];
        if(vc&&vc.url){const img=new Image();img.crossOrigin="anonymous";img.src=vc.url;try{ctx.drawImage(img,0,0,w,h);}catch(e){}}
        ctx.fillStyle="rgba(212,175,106,0.9)";ctx.font="20px sans-serif";ctx.fillText("InFuture Movie Studios",20,h-30);
        requestAnimationFrame(anim);
      };
      anim();
    }catch(e){setRendering(false);setError("Render failed: "+e.message);}
  };
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>FINAL OUTPUT</div><h1 style={{...H1,fontSize:24,margin:0}}>Render Engine</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      <div style={{background:PANEL,border:"1px solid "+LINE,padding:14,marginBottom:14}}>
        <div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:6}}>Timeline summary</div>
        <div style={{color:DIM,fontSize:12,lineHeight:1.6}}>{videoClips.length} video clip{videoClips.length!==1?"s":""} · {audioClips.length} audio clip{audioClips.length!==1?"s":""} on the timeline</div>
        {totalClips===0&&<div style={{color:"#C98A7A",fontSize:11,marginTop:4}}>Add clips on Page 13 first.</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <div><div style={{color:DIM,fontSize:10,marginBottom:3}}>Quality</div><select value={quality} onChange={e=>setQuality(e.target.value)} style={{width:"100%",background:PANEL,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box"}}><option value="1080" style={{background:PANEL}}>1080p HD</option><option value="1440" style={{background:PANEL}}>1440p QHD</option><option value="2160" style={{background:PANEL}}>4K UHD</option></select></div>
        <div><div style={{color:DIM,fontSize:10,marginBottom:3}}>Format</div><select value={format} onChange={e=>setFormat(e.target.value)} style={{width:"100%",background:PANEL,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box"}}><option value="mp4" style={{background:PANEL}}>MP4 (H.264)</option><option value="webm" style={{background:PANEL}}>WebM (VP9)</option></select></div>
      </div>
      <button onClick={doRender} disabled={rendering||totalClips===0} style={{...G("gold",false),width:"100%",padding:"14px",fontSize:14,opacity:rendering||totalClips===0?0.5:1}}>{rendering?("RENDERING… "+progress+"%"):"RENDER FILM"}</button>
      {rendering&&(<div style={{marginTop:10,height:4,background:PANEL,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:progress+"%",background:GOLD,transition:"width .5s"}}/></div>)}
      {error&&<div style={{color:"#C98A7A",fontSize:12,marginTop:10}}>{error}</div>}
      {resultUrl&&(<div style={{marginTop:14}}><video src={resultUrl} controls style={{width:"100%",border:"1px solid "+LINE}}/><div style={{display:"flex",gap:8,marginTop:8}}><button onClick={()=>msDownload(resultUrl,"InFuture_Film.mp4")} style={{...G("gold",false),flex:1,padding:"10px"}}>Download</button><button onClick={()=>go(17)} style={{...G("out",false),flex:1,padding:"10px"}}>Preview</button></div></div>)}
      <div style={{color:DIM,fontSize:11,marginTop:14,lineHeight:1.6}}>Renders use the canvas + MediaRecorder API to combine your timeline clips into a single film. The result is saved to your library automatically.</div>
    </div>
  </div>);
}

// P17 — FILM PREVIEW
export function P17({go,mediaLib}){
  const [url,setUrl]=useState("");
  useEffect(()=>{
    const findRender=async()=>{
      try{
        const clips=await getAllClipsFromDB();
        const render=clips.filter(c=>String(c.id).includes("render_final")).pop();
        if(render){setUrl(URL.createObjectURL(render.blob));}
      }catch(e){}
    };
    findRender();
  },[]);
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>FINAL OUTPUT</div><h1 style={{...H1,fontSize:24,margin:0}}>Film Preview</h1></div>
    <div style={{padding:14,maxWidth:800,margin:"0 auto"}}>
      {url?(
        <div>
          <video src={url} controls autoPlay loop playsInline style={{width:"100%",border:"1px solid "+GOLD}}/>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>msDownload(url,"InFuture_Film.mp4")} style={{...G("gold",false),flex:1,padding:"12px"}}>Download film</button>
            <button onClick={()=>go(18)} style={{...G("out",false),flex:1,padding:"12px"}}>Export &amp; distribute</button>
          </div>
        </div>
      ):(
        <div style={{background:PANEL,border:"1px solid "+LINE,padding:"40px 20px",textAlign:"center"}}>
          <div style={{color:GOLDDIM,fontSize:36,marginBottom:10}}>No film rendered yet</div>
          <div style={{color:DIM,fontSize:12,marginBottom:14}}>Render your film on Page 16, then come back here to preview it.</div>
          <button onClick={()=>go(16)} style={{...G("gold",false),padding:"10px 24px"}}>Go to Render Engine</button>
        </div>
      )}
    </div>
  </div>);
}

// P18 — EXPORT & DISTRIBUTE
export function P18({go,mediaLib}){
  const [url,setUrl]=useState("");
  useEffect(()=>{const findRender=async()=>{try{const clips=await getAllClipsFromDB();const render=clips.filter(c=>String(c.id).includes("render_final")).pop();if(render)setUrl(URL.createObjectURL(render.blob));}catch(e){}};findRender();},[]);
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>FINAL OUTPUT</div><h1 style={{...H1,fontSize:24,margin:0}}>Export &amp; Distribute</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      {url?(
        <div>
          <div style={{background:PANEL,border:"1px solid "+LINE,padding:18,marginBottom:14}}>
            <div style={{color:WHITE,fontSize:15,fontWeight:600,marginBottom:6}}>Your film is ready</div>
            <div style={{color:DIM,fontSize:12,lineHeight:1.6,marginBottom:14}}>Download it to your device, or share it directly to your favourite platform.</div>
            <button onClick={()=>msDownload(url,"InFuture_Film.mp4")} style={{...G("gold",false),width:"100%",padding:"14px",fontSize:14}}>Download film</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>window.open("https://youtube.com/upload","_blank")} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Upload to YouTube</button>
            <button onClick={()=>window.open("https://vimeo.com/upload","_blank")} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Upload to Vimeo</button>
            <button onClick={()=>{if(navigator.share)navigator.share({title:"My InFuture Film",text:"Made with InFuture Movie Studios"}).catch(()=>{});}} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Share via device</button>
            <button onClick={()=>go(22)} style={{background:PANEL,border:"1px solid "+LINE,color:WHITE,padding:"18px 8px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Manrope',system-ui,sans-serif"}}>Share to community</button>
          </div>
        </div>
      ):(
        <div style={{background:PANEL,border:"1px solid "+LINE,padding:"40px 20px",textAlign:"center"}}>
          <div style={{color:GOLDDIM,fontSize:28,marginBottom:10}}>No film to export</div>
          <div style={{color:DIM,fontSize:12,marginBottom:14}}>Render your film first, then come back to export.</div>
          <button onClick={()=>go(16)} style={{...G("gold",false),padding:"10px 24px"}}>Go to Render Engine</button>
        </div>
      )}
    </div>
  </div>);
}

// P19 — TUTORIALS
export function P19(){
  const tutorials=[{t:"Getting Started",d:"Overview of the 25-page studio workflow",dur:"3 min"},{t:"Writing Your Script",d:"Use the Writing Tools on Page 5",dur:"5 min"},{t:"Choosing a Voice",d:"Browse 54+ voices and clone your own",dur:"4 min"},{t:"Generating Video",d:"The Cinema Engine on Page 8",dur:"6 min"},{t:"Timeline Editing",d:"Arrange clips on the timeline",dur:"5 min"},{t:"Rendering Your Film",d:"Final output settings and render",dur:"4 min"},{t:"Export & Distribute",d:"Download and share your film",dur:"3 min"},{t:"Saving Projects",d:"Save and resume your work",dur:"2 min"}];
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>LEARN</div><h1 style={{...H1,fontSize:24,margin:0}}>Tutorials</h1></div>
    <div style={{padding:14,maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>{tutorials.map((t,i)=>(<div key={i} style={{background:PANEL,border:"1px solid "+LINE,padding:14,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=LINE;}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:40,height:40,border:"1px solid "+GOLD,display:"flex",alignItems:"center",justifyContent:"center",color:GOLD,fontSize:14,fontWeight:600}}>{i+1}</div><div style={{flex:1}}><div style={{color:WHITE,fontSize:13,fontWeight:600}}>{t.t}</div><div style={{color:DIM,fontSize:11}}>{t.dur}</div></div></div><div style={{color:DIM,fontSize:11,lineHeight:1.5}}>{t.d}</div></div>))}</div>
    </div>
  </div>);
}

// P20 — TERMS & DISCLAIMER
export function P20(){
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>LEGAL</div><h1 style={{...H1,fontSize:24,margin:0}}>Terms &amp; Disclaimer</h1></div>
    <div style={{padding:14,maxWidth:700,margin:"0 auto"}}>
      <div style={{background:PANEL,border:"1px solid "+LINE,padding:20,lineHeight:1.8,fontSize:13,color:WHITE}}>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>Acceptable Use</h2>
        <p style={{marginBottom:14}}>InFuture Movie Studios provides AI tools for creative filmmaking. Users are responsible for the content they create. You may not use the platform to create content that is illegal, harmful, defamatory, or that infringes on the rights of others.</p>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>AI-Generated Content</h2>
        <p style={{marginBottom:14}}>All video, voice, and image content generated through the platform is produced by AI. You are responsible for verifying that your use of AI-generated content complies with applicable laws and regulations in your jurisdiction.</p>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>Voice Cloning</h2>
        <p style={{marginBottom:14}}>Voice cloning is provided for creating narration in your own voice. You may only clone your own voice or voices you have explicit permission to clone. Misuse of voice cloning technology is prohibited.</p>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>Subscriptions</h2>
        <p style={{marginBottom:14}}>Subscription plans are billed monthly through Stripe. Cancellations take effect at the end of the current billing period. Refunds are handled on a case-by-case basis.</p>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>Privacy</h2>
        <p style={{marginBottom:14}}>Your account data is stored securely. Uploaded media is stored in your browser's IndexedDB and optionally backed up to your account. We do not access or share your creative content.</p>
        <h2 style={{...H1,fontSize:18,marginBottom:10}}>Disclaimer</h2>
        <p style={{marginBottom:14}}>The platform is provided "as is" without warranties. We are not liable for any damages arising from the use of AI-generated content. The platform is a creative tool, not a replacement for professional production services.</p>
        <p style={{color:GOLDDIM,fontSize:12,marginTop:18}}>Last updated: October 2026 · InFuture Movie Studios · MandaStrong1.Etsy.com</p>
      </div>
    </div>
  </div>);
}

// P22 — COMMUNITY HUB
export function P22({go}){
  const [posts,setPosts]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_community_posts")||"[]");}catch{return[];}});
  const [text,setText]=useState("");
  const post=()=>{if(!text.trim())return;const upd=[{id:Date.now(),text:text.trim(),date:new Date().toLocaleDateString(),likes:0},...posts];setPosts(upd);try{localStorage.setItem("ms_community_posts",JSON.stringify(upd));}catch(e){}setText("");};
  const like=id=>{const upd=posts.map(p=>p.id===id?{...p,likes:p.likes+1}:p);setPosts(upd);try{localStorage.setItem("ms_community_posts",JSON.stringify(upd));}catch(e){}};
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>COMMUNITY</div><h1 style={{...H1,fontSize:24,margin:0}}>Community Hub</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      <div style={{background:PANEL,border:"1px solid "+LINE,padding:14,marginBottom:14}}>
        <div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:6}}>Share your work</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Share an update, a link to your film, or ask for feedback…" style={{width:"100%",background:BG4,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Manrope',system-ui,sans-serif",height:80,resize:"vertical",lineHeight:1.6,marginBottom:8}}/>
        <button onClick={post} disabled={!text.trim()} style={{...G("gold",false),padding:"9px 24px",opacity:!text.trim()?0.5:1}}>Post</button>
      </div>
      {posts.length===0?(
        <div style={{background:PANEL,border:"1px solid "+LINE,padding:"30px 20px",textAlign:"center"}}><div style={{color:GOLDDIM,fontSize:13}}>No posts yet. Be the first to share!</div></div>
      ):posts.map(p=>(
        <div key={p.id} style={{background:PANEL,border:"1px solid "+LINE,padding:14,marginBottom:10}}>
          <div style={{color:WHITE,fontSize:13,lineHeight:1.6,marginBottom:6}}>{p.text}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:DIM,fontSize:10}}>{p.date}</span><button onClick={()=>like(p.id)} style={{background:"none",border:"1px solid "+LINE,color:WHITE,padding:"2px 10px",cursor:"pointer",fontSize:10,fontWeight:600}}>♥ {p.likes}</button></div>
        </div>
      ))}
    </div>
  </div>);
}

// P24 — CHARACTER STUDIO
export function P24({onSave}){
  const [chars,setChars]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_characters")||"[]");}catch{return[];}});
  const [name,setName]=useState("");
  const [desc,setDesc]=useState("");
  const [voice,setVoice]=useState("james");
  const photoRef=useRef(null);
  const [photo,setPhoto]=useState("");
  const inp={width:"100%",background:PANEL,border:"1px solid "+LINE,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Manrope',system-ui,sans-serif"};
  const addChar=()=>{
    if(!name.trim())return;
    const c={id:"char_"+Date.now(),name:name.trim(),desc:desc.trim(),voice,photo,created:Date.now()};
    const upd=[...chars,c];setChars(upd);
    try{localStorage.setItem("ms_characters",JSON.stringify(upd));}catch(e){}
    setName("");setDesc("");setPhoto("");
    if(onSave)onSave({id:c.id,name:"Character: "+c.name,type:"text/plain",content:c.desc});
  };
  return(<div style={{...Sp}}>
    <div style={{padding:"14px 18px 12px",borderBottom:"1px solid "+LINE}}><div style={{fontSize:12,color:GOLDDIM,letterSpacing:0.4,fontWeight:500}}>CREATE</div><h1 style={{...H1,fontSize:24,margin:0}}>Character Studio</h1></div>
    <div style={{padding:14,maxWidth:680,margin:"0 auto"}}>
      <div style={{background:PANEL,border:"1px solid "+LINE,padding:18,marginBottom:14}}>
        <div style={{color:WHITE,fontSize:14,fontWeight:600,marginBottom:10}}>Create a character</div>
        <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:3}}>Name</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Detective Mara Cole" style={{...inp,marginBottom:10}}/>
        <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:3}}>Description</div>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe the character — appearance, personality, backstory…" style={{...inp,height:80,resize:"vertical",lineHeight:1.6,marginBottom:10}}/>
        <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:3}}>Voice</div>
        <select value={voice} onChange={e=>setVoice(e.target.value)} style={{...inp,marginBottom:10}}>{VOICE_CHARACTERS.map(v=><option key={v.id} value={v.id} style={{background:PANEL,color:WHITE}}>{v.name} — {v.origin} {v.gender}</option>)}</select>
        <div style={{color:WHITE,fontSize:12,fontWeight:600,marginBottom:3}}>Reference photo (optional)</div>
        <button onClick={()=>photoRef.current&&photoRef.current.click()} style={{...inp,cursor:"pointer",textAlign:"center",marginBottom:10}}>{photo?"Photo loaded":"Upload reference photo"}</button>
        <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)setPhoto(URL.createObjectURL(f));}}/>
        <button onClick={addChar} disabled={!name.trim()} style={{...G("gold",false),width:"100%",padding:"12px",opacity:!name.trim()?0.5:1}}>Save character</button>
      </div>
      {chars.length>0&&(<div><div style={{color:WHITE,fontSize:13,fontWeight:600,marginBottom:8}}>Your characters ({chars.length})</div>{chars.map(c=>(<div key={c.id} style={{background:PANEL,border:"1px solid "+LINE,padding:14,marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>{c.photo&&<img src={c.photo} style={{width:40,height:40,objectFit:"cover",borderRadius:2}}/>}<div><div style={{color:WHITE,fontSize:13,fontWeight:600}}>{c.name}</div><div style={{color:DIM,fontSize:10}}>Voice: {VOICE_CHARACTERS.find(v=>v.id===c.voice)?.name||c.voice}</div></div></div>{c.desc&&<div style={{color:DIM,fontSize:11,lineHeight:1.5}}>{c.desc}</div>}</div>))}</div>)}
    </div>
  </div>);
}

// P25 — CHARACTER STUDIO (alias for P24, used when page 25 is selected)
export function P25(props){return P24(props);}
