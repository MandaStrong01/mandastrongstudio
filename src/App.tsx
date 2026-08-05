          wall.addColorStop(0,"rgb(9,6,3)"); wall.addColorStop(1,"rgb(4,3,2)");
          ctx.fillStyle=wall; ctx.fillRect(0,0,W,H);
          const fl=ctx.createLinearGradient(0,H*0.65,0,H);
          fl.addColorStop(0,"rgb(18,12,7)"); fl.addColorStop(1,"rgb(7,5,3)");
          ctx.fillStyle=fl; ctx.fillRect(0,H*0.65,W,H*0.35);
          const wox=W*0.12, woy=H*0.05, wow=W*0.46, woh=H*0.74;
          if(isNight){
            const ws=ctx.createLinearGradient(wox,woy,wox,woy+woh);
            ws.addColorStop(0,"rgb(2,4,15)"); ws.addColorStop(1,"rgb(6,14,42)");
            ctx.fillStyle=ws; ctx.fillRect(wox,woy,wow,woh);
            if(isOcean){
              for(let w=0;w<6;w++){
                const wg2=ctx.createLinearGradient(0,woy+woh*0.55+w*8,0,woy+woh);
                wg2.addColorStop(0,"rgba(2,8,35,0.9)");
                wg2.addColorStop(1,"rgba(1,3,12,0.98)");
                ctx.fillStyle=wg2;
                ctx.beginPath(); ctx.moveTo(wox,woy+woh);
                for(let x=wox;x<=wox+wow;x+=3){
                  const y=woy+woh*0.58+w*10+Math.sin(x*0.01+sec*(0.2+w*0.07)+w)*10;
                  ctx.lineTo(x,y);
                }
                ctx.lineTo(wox+wow,woy+woh); ctx.closePath(); ctx.fill();
              }
            }
          }
          ctx.strokeStyle="rgba(48,32,16,0.92)"; ctx.lineWidth=10;
          ctx.strokeRect(wox,woy,wow,woh);
        }
        // CANDLE
        if(hasCandle){
          const candX=isIndoor?W*0.7:W*0.5, candY=isIndoor?H*0.58:H*0.5;
          const flicker=0.88+Math.sin(sec*8.8)*0.07+Math.sin(sec*13.4)*0.04;
          ctx.fillStyle="rgba(232,212,162,0.9)"; ctx.fillRect(candX-5,candY,10,32);
          const cf=ctx.createRadialGradient(candX,candY,0,candX,candY,H*0.13*flicker);
          cf.addColorStop(0,"rgba(255,255,200,0.95)");
          cf.addColorStop(0.18,"rgba(255,180,40,0.72)");
          cf.addColorStop(0.5,"rgba(255,100,8,0.3)");
          cf.addColorStop(1,"rgba(255,60,0,0)");
          ctx.fillStyle=cf; ctx.fillRect(candX-H*0.13,candY-H*0.13,H*0.26,H*0.26);
        }
        // PERSON
        if(hasPerson){
          const isSeated=/sit|bench|windowsill|chair/.test(pr);
          const isMale=/\bman\b|\bmale\b|\bguy\b|\bhim\b|\bhe\b/.test(pr);
          const isFemale=/\bwoman\b|\bfemale\b|\bgirl\b|\bher\b|\bshe\b/.test(pr);
          const fx=isOcean&&isIndoor?W*0.22:W*0.4;
          const fy=isSeated?H*0.52:H*0.44;
          const breath=Math.sin(sec*0.88)*0.007;
          // Lip sync — mouth opens on beats
          const mouthOpen=beatNow?H*0.012:H*0.003+Math.sin(sec*4.2)*H*0.003;
          // Skin tone — male slightly darker
          const skinTop=isMale?"rgba(205,155,105,1)":"rgba(235,185,135,1)";
          const skinBot=isMale?"rgba(135,88,52,1)":"rgba(155,102,65,1)";
          // Shoulder width — male broader
          const shoulderW=isMale?H*0.075:H*0.055;

          if(isSilhouette){
            ctx.fillStyle="rgba(2,1,1,0.97)";
            // Head
            ctx.beginPath();ctx.ellipse(fx,fy-H*0.13,H*0.036,H*0.044,0,0,Math.PI*2);ctx.fill();
            // Body — broader for male
            ctx.beginPath();
            ctx.moveTo(fx-shoulderW,fy-H*0.09);
            ctx.lineTo(fx-H*0.03,fy+H*(0.06+breath*2));
            ctx.lineTo(fx+H*0.03,fy+H*(0.06+breath*2));
            ctx.lineTo(fx+shoulderW,fy-H*0.09);
            ctx.closePath();ctx.fill();
            if(hasGuitar){
              ctx.beginPath();ctx.ellipse(fx+H*0.072,fy+H*0.02,H*0.05,H*0.064,0.22,0,Math.PI*2);ctx.fill();
              ctx.fillRect(fx+H*0.026,fy-H*0.09,H*0.011,H*0.12);
            }
          } else {
            // Head with correct skin tone
            const hg=ctx.createRadialGradient(fx-H*0.008,fy-H*0.145,0,fx,fy-H*0.13,H*0.042);
            hg.addColorStop(0,skinTop);
            hg.addColorStop(1,skinBot);
            ctx.fillStyle=hg;
            ctx.beginPath();ctx.ellipse(fx,fy-H*0.13,H*0.034,H*0.042,0,0,Math.PI*2);ctx.fill();
            // Eyes
            ctx.fillStyle="rgba(30,20,10,0.9)";
            ctx.beginPath();ctx.ellipse(fx-H*0.012,fy-H*0.138,H*0.007,H*0.005,0,0,Math.PI*2);ctx.fill();
            ctx.beginPath();ctx.ellipse(fx+H*0.012,fy-H*0.138,H*0.007,H*0.005,0,0,Math.PI*2);ctx.fill();
            // Lip sync mouth
            ctx.fillStyle="rgba(120,60,40,0.85)";
            ctx.beginPath();ctx.ellipse(fx,fy-H*0.115,H*0.014,mouthOpen,0,0,Math.PI*2);ctx.fill();
            // Body — broader for male
            ctx.fillStyle="rgba(28,18,10,0.97)";
            ctx.beginPath();
            ctx.moveTo(fx-shoulderW,fy-H*0.09);
            ctx.lineTo(fx-H*0.03,fy+H*(0.08+breath*2));
            ctx.lineTo(fx+H*0.03,fy+H*(0.08+breath*2));
            ctx.lineTo(fx+shoulderW,fy-H*0.09);
            ctx.closePath();ctx.fill();
          }
        }
        if(isRain){
          for(let r=0;r<120;r++){
            const rx=(r*137+sec*200)%W, ry=(r*97+sec*450)%H;
            ctx.strokeStyle="rgba(155,175,210,0.2)"; ctx.lineWidth=0.8;
            ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx-4,ry+18); ctx.stroke();
          }
        }
        if(isFog){
          const fog=ctx.createLinearGradient(0,H*0.38,0,H*0.72);
          fog.addColorStop(0,"rgba(175,180,175,0)");
          fog.addColorStop(0.5,"rgba(155,160,155,"+(0.1+Math.sin(sec*0.28)*0.04)+")");
          fog.addColorStop(1,"rgba(138,142,138,0)");
          ctx.fillStyle=fog; ctx.fillRect(0,H*0.38,W,H*0.34);
        }
        ctx.restore();
      };

      // ══════════════════════════════════════════════════════════════
      // MANDASTRONG ENGINE — real footage, not drawn shapes
      // The shot list renders in parallel, then the canvas below
      // composites it with your grade, your beats and your audio.
      // If the engine can't deliver, the built-in renderer still runs.
      // ══════════════════════════════════════════════════════════════
      let engineClips=[];
      try{
        const shotCount=Math.min(4,Math.max(3,Math.round(totalDur/45))); // capped at 4 to protect render spend
        const ANGLES=[
          "wide establishing shot, full scene visible",
          "medium shot, subject centred in frame",
          "slow push in, shallow depth of field",
          "close detail shot, hands and texture",
          "low angle looking up, dramatic",
          "slow lateral tracking shot",
          "framed from behind, subject facing away",
          "wide static held frame, atmospheric"
        ];
        const look=[config.videoStyle,config.colorGrade,(config.effects||[]).join(", ")].filter(Boolean).join(", ");
        const shots=[];
        for(let i=0;i<shotCount;i++){
          shots.push(sceneDesc+". "+ANGLES[i%ANGLES.length]+". "+look+". Photorealistic, cinematic, natural motion, 35mm film, no text, no captions.");
        }
        addLog("Cinema Engine \u2014 rendering "+shotCount+" photorealistic shots...");
        setRenderProgress(8);
        let done=0;
        const ar=(config.aspectRatio||"").indexOf("9:16")===0?"9:16":"16:9";
        const seedImg=(typeof config.refMedia==="string"&&config.refMedia.indexOf("data:")===0)?config.refMedia:"";
        const urls=await Promise.all(shots.map(s=>engineRender(s,{duration:5,aspect_ratio:ar,image:seedImg})
          .then(u=>{ done++; addLog("Shot "+done+"/"+shotCount+(u?" \u2713":" \u2014 unavailable")); setRenderProgress(Math.min(26,8+done*2)); return u; })));
        const good=urls.filter(Boolean);
        if(good.length){
          addLog("Loading footage into the compositor...");
          const vids=await Promise.all(good.map(u=>engineToLocalVideo(u)));
          engineClips=vids.filter(Boolean);
          for(const v of engineClips){ try{ await v.play(); }catch(e){} }
          addLog("\u2713 "+engineClips.length+" live shots ready \u2014 compositing with your grade and beats");
        } else {
          const diag=await engineStatus();
          addLog((diag&&diag.ok===false?("Cinema Engine: "+(diag.message||"unavailable")):"Engine returned no footage")+" \u2014 using built-in renderer");
        }
      }catch(e){ addLog("Cinema Engine offline \u2014 using built-in renderer"); }

      // Shot length follows the editing style you picked on Step 2
      const CUTLEN={"Fast Cuts / High Energy":1.1,"Slow & Deliberate":5.5,"Long Takes":8,"Beat-Synced Cuts":0,"Montage Style":2.2};
      const shotLen=CUTLEN[config.cuts]!==undefined?CUTLEN[config.cuts]:4;
      const cutPoints=[];
      if(shotLen===0&&beatGrid.length){
        let lastCut=-99;
        beatGrid.forEach(b=>{ if(b-lastCut>1.4){ cutPoints.push(b); lastCut=b; } });
      }
      const clipAt=(sec)=>{
        if(!engineClips.length)return null;
        if(cutPoints.length){
          let n=0;
          for(let i=0;i<cutPoints.length;i++){ if(sec>=cutPoints[i]) n=i+1; }
          return engineClips[n%engineClips.length];
        }
        return engineClips[Math.floor(sec/shotLen)%engineClips.length];
      };
      // Fills the frame without squashing. Slight overscan so the
      // parallax drift never exposes a black edge.
      const drawClip=(c,v,W2,H2)=>{
        if(!v||!v.videoWidth)return false;
        const vr=v.videoWidth/v.videoHeight, cr=W2/H2;
        let dw,dh;
        if(vr>cr){ dh=H2; dw=H2*vr; } else { dw=W2; dh=W2/vr; }
        dw*=1.08; dh*=1.08;
        c.drawImage(v,(W2-dw)/2,(H2-dh)/2,dw,dh);
        return true;
      };

      setRenderProgress(30);
      addLog("Rendering "+totalDur.toFixed(0)+"s film at 12fps...");

      // ── SET UP CANVAS + RECORDER ────────────────────────────────
      const canvas = canvasRef.current;
      const W=1280, H=720;
      canvas.width=W; canvas.height=H;
      const ctx = canvas.getContext("2d");

      const fps=12;
      const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
      const videoStream=canvas.captureStream(fps);
      let combinedStream=videoStream;
      if(audioDest){
        combinedStream=new MediaStream([...videoStream.getTracks(),...audioDest.stream.getTracks()]);
      }
      const recorder=new MediaRecorder(combinedStream,{mimeType,videoBitsPerSecond:10000000});
      const chunks=[];
      recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      recorder.start(Math.round(1000/fps));
      // Start audio at exact same moment as video recording — guarantees sync
      if(audioSource&&audioCtx) audioSource.start(audioCtx.currentTime);
      else if(audioSource) audioSource.start(0);

      // ── RENDER EVERY FRAME ──────────────────────────────────────
      const totalFrames=Math.max(fps*5, Math.round((totalDur||180)*fps));
      const msPerFrame=Math.round(1000/fps);
      const wallStart=performance.now();

      await new Promise(resolve=>{
        let frame=0;
        const tick=()=>{
          if(frame>=totalFrames){resolve(null);return;}
          const sec=frame/fps;
          const t=sec/totalDur;
          const beatNow=beatGrid.some(b=>Math.abs(sec-b)<0.055);

          ctx.clearRect(0,0,W,H);

          // Camera parallax base
          const drift=t*W*0.04;
          ctx.save();
          ctx.translate(-drift*0.3,0);

          try{
            const liveClip=clipAt(sec);
            if(!(liveClip&&drawClip(ctx,liveClip,W,H))){
              renderFn(ctx,W,H,t,sec,totalDur,beatNow);
            }
          }
          catch(e){
            // Graceful fallback — keep rendering
            const bg=ctx.createLinearGradient(0,0,0,H);
            bg.addColorStop(0,"rgb(2,5,18)");
            bg.addColorStop(1,"rgb(4,8,28)");
            ctx.fillStyle=bg; ctx.fillRect(-W,0,W*3,H);
          }

          ctx.restore();

          // Vignette — always
          const vig=ctx.createRadialGradient(W/2,H/2,W*0.08,W/2,H/2,W*0.85);
          vig.addColorStop(0,"rgba(0,0,0,0)"); vig.addColorStop(1,"rgba(0,0,0,0.92)");
          ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

          // ── AUTO-ENHANCEMENT — runs every frame automatically ──────────────
          // Warm gold colour grade overlay
          ctx.fillStyle="rgba(232,180,60,0.06)";ctx.fillRect(0,0,W,H);
          // Contrast boost — darken shadows slightly
          ctx.fillStyle="rgba(0,0,0,0.08)";ctx.fillRect(0,0,W,H);
          // Highlight recovery — soft white pull on bright areas (top centre)
          const hr=ctx.createRadialGradient(W/2,H*0.3,0,W/2,H*0.3,W*0.4);
          hr.addColorStop(0,"rgba(255,255,240,0.04)");hr.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=hr;ctx.fillRect(0,0,W,H);
          // ──────────────────────────────────────────────────────────────────

          // Letterbox
          ctx.fillStyle="#000";
          ctx.fillRect(0,0,W,Math.round(H*0.072));
          ctx.fillRect(0,H-Math.round(H*0.072),W,Math.round(H*0.072));

          // Film grain
          for(let g=0;g<30;g++){
            const gv=Math.random()>0.5?130:0;
            ctx.fillStyle="rgba("+gv+","+gv+","+gv+",0.008)";
            ctx.fillRect(Math.random()*W,Math.random()*H,1,1);
          }

          // Title card — opening and closing
          if(t<0.12||t>0.9){
            const a=t<0.12?Math.min(1,t/0.08):Math.max(0,(1-t)/0.08);
            ctx.globalAlpha=a*0.95;
            ctx.fillStyle="#e8c96d";
            ctx.font="900 "+Math.round(H*0.072)+"px Arial Black,Arial";
            ctx.textAlign="center";
            ctx.shadowColor="#e8c96d"; ctx.shadowBlur=28;
            ctx.fillText((config.title||"UNTITLED").toUpperCase(),W/2,H*0.43);
            ctx.shadowBlur=0;
            ctx.fillStyle="rgba(255,255,255,0.8)";
            ctx.font="300 "+Math.round(H*0.034)+"px Arial";
            ctx.fillText((config.artist||"").toUpperCase(),W/2,H*0.56);
            ctx.globalAlpha=1;
          }

          setRenderProgress(30+Math.round((frame/totalFrames)*64));
          if(frame%(fps*10)===0) addLog("  "+Math.round(sec)+"s / "+Math.round(totalDur)+"s");
          frame++;
          const due=wallStart+(frame*msPerFrame);
          setTimeout(tick,Math.max(4,due-performance.now()));
        };
        tick();
      });

      // ── FINALISE ────────────────────────────────────────────────
      setRenderProgress(96);
      addLog("Cutting to final...");
      await new Promise(r=>setTimeout(r,600));
      if(audioSource){try{audioSource.stop(audioCtx?audioCtx.currentTime:0);}catch(e){}}
      await new Promise(r=>{let d=false;const f=()=>{if(!d){d=true;r();}};setTimeout(f,4000);try{recorder.onstop=f;if(recorder.state!=="inactive"){recorder.stop();}else{f();}}catch(e){f();}});
      const blob=new Blob(chunks,{type:mimeType});
      const url=URL.createObjectURL(blob);
      setVideoUrl(url); setVideoBlob(blob);
      setRenderProgress(100);
      addLog("✓ "+config.title+" complete — "+(blob.size/1024/1024).toFixed(1)+"MB · "+Math.round(totalDur)+"s");

      const fn=(config.title||"MusicVideo")+"_"+config.artist+".webm";
      try{
        const clipId="mv_"+Date.now();
        await safeSaveClipToDB(clipId,blob,fn,"video/webm");
        addLog("✓ Saved");
        if(onSave)onSave({id:clipId,name:fn,type:"video/webm",url:URL.createObjectURL(blob),file:new File([blob],fn,{type:"video/webm"}),dbId:clipId});
      }catch(e){}
      if(audioCtx)try{audioCtx.close();}catch(e){}

    }catch(e){ addLog("Error: "+e.message); }
    setGenerating(false);
  };


  const SOCIAL = [
    ["YouTube","#FF0000","https://www.youtube.com/upload"],
    ["Instagram","#E1306C","https://www.instagram.com"],
    ["TikTok","#69C9D0","https://www.tiktok.com/upload"],
    ["Facebook","#1877F2","https://www.facebook.com"],
    ["X / Twitter","#1DA1F2","https://twitter.com"],
    ["Vimeo","#1AB7EA","https://vimeo.com/upload"],
  ];

  const inp = {width:"100%",background:"#000",border:"1px solid "+GOLDDIM,padding:"9px 12px",color:WHITE,fontSize:13,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"};
  const label = (txt) => <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6,marginTop:12}}>{txt}</div>;

  const sel = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>set(k,item)}
          style={{background:config[k]===item?GOLD:"#111",border:"1px solid "+(config[k]===item?"#000":GOLDDIM),color:config[k]===item?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );
  const multi = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>tog(k,item)}
          style={{background:config[k].includes(item)?GOLD:"#111",border:"1px solid "+(config[k].includes(item)?"#000":GOLDDIM),color:config[k].includes(item)?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );

  const steps = ["🎵 SONG","🎤 STYLE","🎬 SCENE","▶ GENERATE"];
  const fmt = (s)=>{const m=Math.floor(s/60);const sc=Math.floor(s%60);return String(m).padStart(2,"0")+":"+String(sc).padStart(2,"0");};

  return (
    <div style={{position:"fixed",inset:0,zIndex:1100,background:"rgba(0,0,0,0.98)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(960px,98vw)",height:"min(92vh,860px)",background:"#050505",border:"2px solid "+GOLD,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1a0a00,#0a0500)",borderBottom:"1px solid "+GOLD+"",padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:18,fontWeight:900,letterSpacing:4}}>🎬 MUSIC VIDEO STUDIO</div>
            <div style={{color:WHITE,fontSize:10,letterSpacing:3,marginTop:2}}>PROFESSIONAL MUSIC VIDEO PRODUCTION · AI POWERED · SELF-CONTAINED</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"1px solid "+GOLD,color:GOLD,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        {/* Step tabs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid "+GOLDDIM+"",flexShrink:0}}>
          {steps.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i+1)}
              style={{background:step===i+1?"#0a0500":"none",border:"none",borderBottom:step===i+1?"2px solid "+GOLD:"2px solid transparent",color:step===i+1?GOLD:WHITE,padding:"11px 6px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2}}>
              {s}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{flex:1,display:"grid",gridTemplateColumns:videoUrl?"1fr 1fr":"1fr",overflow:"hidden"}}>

          {/* Left — config / generate */}
          <div style={{overflowY:"auto",padding:"16px 20px",borderRight:videoUrl?"1px solid "+GOLDDIM:"none"}}>

            {step===1&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>{label("SONG TITLE")}<input value={config.title} onChange={e=>set("title",e.target.value)} placeholder="Song title..." style={inp}/></div>
                  <div>{label("ARTIST")}<input value={config.artist} onChange={e=>set("artist",e.target.value)} placeholder="Artist name..." style={inp}/></div>
                </div>
                {label("GENRE")}{sel("genre",GENRES)}
                {label("MOOD")}{sel("mood",MOODS)}
                {label("TEMPO")}{sel("tempo",TEMPOS)}
                <RecordYourOwnSong onRecorded={(blob,name)=>{setAudioFile(blob);const u=URL.createObjectURL(blob);setAudioUrl(u);setAudioName(name);}}/>
                {audioFile&&<div style={{color:"#22c55e",fontSize:11,fontWeight:900,letterSpacing:2,marginTop:6}}>✓ {audioName}</div>}
                {audioFile&&<button onClick={()=>{setAudioFile(null);setAudioUrl("");setAudioName("");}} style={{background:"none",border:"1px solid #ef4444",color:"#ef4444",padding:"3px 10px",cursor:"pointer",fontSize:10,fontWeight:900,marginTop:4}}>✕ REMOVE AUDIO</button>}
              </div>
            )}

            {step===2&&(
              <div>
                {label("VIDEO STYLE")}{sel("videoStyle",STYLES)}
                {label("COLOUR GRADE")}{sel("colorGrade",GRADES)}
                {label("VISUAL EFFECTS")}{multi("effects",EFFECTS)}
                {label("EDITING STYLE")}{sel("cuts",CUTS)}
                {label("ASPECT RATIO")}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["16:9","9:16 (Vertical)","1:1 (Square)","2.39:1 (Cinematic)"].map(r=>(
                    <button key={r} onClick={()=>set("aspectRatio",r)}
                      style={{background:config.aspectRatio===r?GOLD:"#111",border:"1px solid "+(config.aspectRatio===r?"#000":GOLDDIM),color:config.aspectRatio===r?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step===3&&(
              <div>
                {label("DESCRIBE YOUR MUSIC VIDEO SCENE")}
                <div style={{color:GOLDDIM,fontSize:11,marginBottom:8,lineHeight:1.7}}>
                  Describe what you want to see. The AI director will build 8 cinematic shots from your description.
                </div>
                <textarea
                  value={config.visualDesc}
                  onChange={e=>set("visualDesc",e.target.value)}
                  placeholder="e.g. A man sits alone on a windowsill fingerpicking acoustic guitar. Only his back is visible. Facing the open ocean at night. Full moon low on the water. A single candle burns to his right. The room behind him is empty. A cold couch. A coat still on a hook. He does not move. A man who has lost someone."
                  style={{...inp,height:160,resize:"vertical",lineHeight:1.8,border:"1px solid "+GOLD}}
                />
                {label("DURATION")}
                <div style={{color:GOLDDIM,fontSize:11,lineHeight:1.7,padding:"8px 12px",border:"1px solid "+GOLDDIM,background:"#0a0a0a",marginBottom:8}}>
                  🎵 The video automatically matches the length of your song. Upload or record your track on the SONG step and the film runs exactly as long as the music.
                </div>
              </div>
            )}

            {step===4&&(
              <div>
                <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:16,fontWeight:900,marginBottom:10,letterSpacing:3}}>READY TO CREATE</div>

                {/* Drag-drop audio upload — moved here from Step 1 */}
                {label("⬆ UPLOAD YOUR AUDIO TRACK")}
                <div style={{background:"#000",border:"2px dashed "+(audioFile?GOLD:GOLDDIM),padding:"16px 12px",cursor:"pointer",marginBottom:8,transition:"border-color .2s"}}
                  onClick={()=>audioInputRef.current&&audioInputRef.current.click()}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="#0a0500";}}
                  onDragLeave={e=>{e.currentTarget.style.borderColor=audioFile?GOLD:GOLDDIM;e.currentTarget.style.background="#000";}}
                  onDrop={e=>{
                    e.preventDefault();e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="#000";
                    const f=e.dataTransfer.files&&e.dataTransfer.files[0];
                    if(f&&f.type.startsWith("audio/")){setAudioFile(f);setAudioUrl(URL.createObjectURL(f));setAudioName(f.name);}
                  }}>
                  <div style={{color:audioFile?"#22c55e":WHITE,fontWeight:900,fontSize:12,letterSpacing:2,textAlign:"center"}}>
                    {audioFile?"✓ "+audioName:"⬆ DRAG & DROP or CLICK — MP3 / WAV / M4A"}
                  </div>
                  {audioFile&&<div style={{color:GOLDDIM,fontSize:10,marginTop:4,textAlign:"center"}}>Audio will sync with your video — starts and ends together</div>}
                </div>
                <input ref={audioInputRef} type="file" accept="audio/*" style={{display:"none"}} onChange={handleAudioUpload}/>
                {audioFile&&<button onClick={()=>{setAudioFile(null);setAudioUrl("");setAudioName("");}} style={{background:"none",border:"1px solid #ef4444",color:"#ef4444",padding:"3px 10px",cursor:"pointer",fontSize:10,fontWeight:900,marginBottom:8}}>✕ REMOVE AUDIO</button>}

                {/* Scene description */}
                {label("DESCRIBE YOUR MUSIC VIDEO SCENE")}
                <textarea
                  value={config.visualDesc}
                  onChange={e=>set("visualDesc",e.target.value)}
                  placeholder="Describe what you want to see. e.g. A man sits alone on a windowsill fingerpicking acoustic guitar. Only his back is visible. Facing the open ocean at night. Full moon. Single candle. The room is empty. A man who has lost someone."
                  style={{width:"100%",background:"#000",border:"1px solid "+GOLD,padding:"12px",color:WHITE,fontSize:13,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box",height:130,resize:"vertical",lineHeight:1.8,marginBottom:10}}
                />

                {/* Reference image upload with drag & drop */}
                {label("⬆ UPLOAD REFERENCE IMAGE (OPTIONAL)")}
                {config.refMedia?(
                  <div style={{position:"relative",marginBottom:10}}>
                    <img src={config.refMedia} alt="ref" style={{width:"100%",height:70,objectFit:"cover",border:"1px solid "+GOLD}}/>
                    <button onClick={()=>set("refMedia",null)} style={{position:"absolute",top:4,right:4,background:"#000",border:"1px solid "+GOLD,color:GOLD,padding:"1px 7px",cursor:"pointer",fontSize:10,fontWeight:900}}>✕</button>
                    <div style={{color:"#22c55e",fontSize:9,fontWeight:900,letterSpacing:2,marginTop:3}}>✓ REFERENCE LOADED</div>
                  </div>
                ):(
                  <div>
                    <div
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="#1a0800";}}
                      onDragLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.background="#0a0500";}}
                      onDrop={e=>{
                        e.preventDefault();
                        e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.background="#0a0500";
                        const f=e.dataTransfer.files&&e.dataTransfer.files[0];
                        if(f&&(f.type.startsWith("image/")||f.type.startsWith("video/"))){
                          set("refMedia",URL.createObjectURL(f));
                        }
                      }}
                      onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*,video/*";inp.onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)set("refMedia",URL.createObjectURL(f));};inp.click();}}
                      style={{background:"#0a0500",border:"2px dashed "+GOLDDIM,padding:"18px 10px",textAlign:"center",cursor:"pointer",marginBottom:6,transition:"all .2s"}}>
                      <div style={{color:GOLD,fontSize:14,fontWeight:900,letterSpacing:2,marginBottom:4}}>⬆ DRAG & DROP HERE</div>
                      <div style={{color:GOLDDIM,fontSize:10,letterSpacing:2}}>or click to browse — JPG · PNG · MP4</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                      <button onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif";inp.onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)set("refMedia",URL.createObjectURL(f));};inp.click();}}
                        style={{background:"linear-gradient(135deg,#1a0800,#2a1200)",border:"2px solid "+GOLD,color:GOLD,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif"}}>
                        📷 UPLOAD PHOTO
                      </button>
                      <button onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*,video/*";inp.onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)set("refMedia",URL.createObjectURL(f));};inp.click();}}
                        style={{background:"#0a0a0a",border:"1px solid "+GOLDDIM,color:WHITE,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif"}}>
                        📁 UPLOAD FILE
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div style={{background:"#0a0500",border:"1px solid "+GOLDDIM,padding:14,marginBottom:14}}>
                  <div style={{color:GOLD,fontSize:11,letterSpacing:2,marginBottom:8,fontWeight:900}}>YOUR MUSIC VIDEO</div>
                  {[["TITLE",config.title||"—"],["ARTIST",config.artist||"—"],["GENRE",config.genre||"—"],["MOOD",config.mood||"—"],["STYLE",config.videoStyle||"—"],["GRADE",config.colorGrade||"—"],["DURATION",config.duration||"—"],["AUDIO",audioName||"No audio uploaded"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0",borderBottom:"1px solid #0a0800"}}>
                      <span style={{color:GOLDDIM,letterSpacing:2}}>{k}</span>
                      <span style={{color:WHITE,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Auto lip sync toggle */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <button onClick={()=>set("lipSync",!config.lipSync)}
                    style={{background:config.lipSync?GOLD:"#111",border:"1px solid "+(config.lipSync?"#000":GOLDDIM),color:config.lipSync?"#000":WHITE,padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>
                    {config.lipSync?"✓ AUTO LIP SYNC ON":"AUTO LIP SYNC"}
                  </button>
                  <span style={{color:GOLDDIM,fontSize:10}}>Mouth syncs to beats automatically</span>
                </div>

                {/* Autosave indicator */}
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <span style={{color:"#22c55e",fontSize:11,fontWeight:900}}>● AUTOSAVE ON</span>
                  <span style={{color:GOLDDIM,fontSize:10}}>Your settings are saved as you work</span>
                </div>

                <button onClick={generateVideo} disabled={generating}
                  style={{background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",width:"100%",padding:"18px",fontSize:14,letterSpacing:3,cursor:generating?"not-allowed":"pointer",fontWeight:900,fontFamily:"'Rajdhani',sans-serif",opacity:generating?0.7:1,marginBottom:10}}>
                  {generating?"⟳ RENDERING... "+renderProgress+"%":"🎬 GENERATE MUSIC VIDEO"}
                </button>






                
                {generating&&(
                  <div>
                    <div style={{height:5,background:"#111",marginBottom:6}}>
                      <div style={{width:renderProgress+"%",height:"100%",background:"linear-gradient(90deg,#a07820,#e8c96d)",transition:"width .3s"}}/>
                    </div>
                    <div style={{background:"#000",border:"1px solid "+GOLDDIM,padding:10,maxHeight:140,overflowY:"auto"}}>
                      {renderLog.map((l,i)=>(
                        <div key={i} style={{color:i===renderLog.length-1?"#22c55e":DIM,fontSize:10,lineHeight:1.8}}>
                          {i===renderLog.length-1?"▶ ":"  "}{l}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!generating&&renderLog.length>0&&(
                  <div style={{background:"#000",border:"1px solid "+GOLDDIM,padding:10,maxHeight:120,overflowY:"auto"}}>
                    {renderLog.map((l,i)=>(
                      <div key={i} style={{color:i===renderLog.length-1?"#22c55e":DIM,fontSize:10,lineHeight:1.8}}>
                        {i===renderLog.length-1?"▶ ":"  "}{l}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — video player + export (only when video exists) */}
          {videoUrl&&(
            <div style={{display:"flex",flexDirection:"column",background:"#000",overflow:"hidden"}}>
              {/* Video player */}
              <div style={{position:"relative",background:"#000"}}>
                <canvas ref={canvasRef} style={{position:"fixed",right:8,bottom:8,width:160,height:90,opacity:1,pointerEvents:"none",zIndex:9999,border:"1px solid #e8c96d",background:"#000"}}/>
                <video ref={videoRef} src={videoUrl} playsInline
                  style={{width:"100%",aspectRatio:"16/9",display:"block",background:"#000"}}
                  onTimeUpdate={()=>setCurrentTime(videoRef.current?.currentTime||0)}
                  onLoadedMetadata={()=>{
                    const v=videoRef.current;if(!v)return;
                    // Chrome WebM duration bug: force seek to end so browser reads real duration
                    if(v.duration===Infinity||isNaN(v.duration)||v.duration===0){
                      v.currentTime=1e10;
                      const fix=()=>{v.currentTime=0;setDuration2(v.duration||0);v.removeEventListener("timeupdate",fix);};
                      v.addEventListener("timeupdate",fix);
                    } else {
                      setDuration2(v.duration);
                    }
                  }}
                  onPlay={()=>setPlaying(true)}
                  onPause={()=>setPlaying(false)}
                  onEnded={()=>setPlaying(false)}
                />
                {/* Custom controls overlay */}
                <div style={{background:"rgba(0,0,0,0.85)",padding:"8px 12px"}}>
                  <div style={{height:3,background:"#222",marginBottom:8,cursor:"pointer",borderRadius:2}}
                    onClick={e=>{if(!videoRef.current||!duration2)return;const r=e.currentTarget.getBoundingClientRect();videoRef.current.currentTime=((e.clientX-r.left)/r.width)*duration2;}}>
                    <div style={{width:duration2&&isFinite(duration2)?(currentTime/duration2*100):0+"%",height:"100%",background:GOLD,borderRadius:2,transition:"width .1s"}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button onClick={()=>videoRef.current&&(videoRef.current.currentTime=0)} style={{background:"none",border:"none",color:GOLDDIM,cursor:"pointer",fontSize:14}}>⏮</button>
                      <button onClick={()=>{if(!videoRef.current)return;playing?videoRef.current.pause():videoRef.current.play();}} style={{background:GOLD,border:"none",color:"#000",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:900}}>
                        {playing?"⏸":"▶"}
                      </button>
                      <button onClick={()=>videoRef.current&&(videoRef.current.currentTime=Math.min(duration2,videoRef.current.currentTime+10))} style={{background:"none",border:"none",color:GOLDDIM,cursor:"pointer",fontSize:14}}>⏩</button>
                      <span style={{color:WHITE,fontSize:11,fontFamily:"monospace"}}>{fmt(currentTime||0)} / {fmt(isFinite(duration2)&&duration2>0?duration2:0)}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:GOLDDIM,fontSize:10}}>VOL</span>
                      <input type="range" min={0} max={1} step={0.05} defaultValue={0.85}
                        onChange={e=>{if(videoRef.current)videoRef.current.volume=+e.target.value;}}
                        style={{width:70,accentColor:GOLD}}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export panel */}
              <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:3,marginBottom:10}}>EXPORT YOUR MUSIC VIDEO</div>

                {/* Download */}
                <a href={videoUrl} download={(config.title||"MusicVideo")+"_"+config.artist+".webm"} target="_blank" rel="noopener noreferrer"
                  style={{display:"block",background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",padding:"12px",textAlign:"center",textDecoration:"none",fontWeight:900,fontSize:12,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:8}}>
                  ⬇ DOWNLOAD VIDEO
                </a>

                {/* Save to media library */}
                <button onClick={()=>{
                  if(videoBlob&&onSave){
                    const fn=(config.title||"MusicVideo")+"_"+config.artist+".webm";
                    onSave({id:"mv_"+Date.now(),name:fn,type:"video/webm",url:videoUrl,file:new File([videoBlob],fn,{type:"video/webm"})});
                    addLog("✓ Saved to media library");
                  }
                }} style={{width:"100%",background:"transparent",border:"1px solid "+GOLD,color:GOLD,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:14}}>
                  💾 SAVE TO MEDIA LIBRARY
                </button>

                {/* Share to social */}
                <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:8}}>SHARE TO</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:12}}>
                  {SOCIAL.map(([name,color,url])=>(
                    <button key={name} onClick={()=>window.open(url,"_blank")}
                      style={{background:"#000",border:"1px solid "+color+"33",color:color,padding:"7px 4px",cursor:"pointer",fontSize:10,fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=color+"22";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#000";}}>
                      {name}
                    </button>
                  ))}
                </div>

                {/* New project */}
                <button onClick={()=>{setVideoUrl("");setVideoBlob(null);setRenderLog([]);setRenderProgress(0);setStep(1);}}
                  style={{width:"100%",background:"transparent",border:"1px solid "+GOLDDIM,color:GOLDDIM,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>
                  + NEW MUSIC VIDEO
                </button>
              </div>
            </div>
          )}

          {/* Canvas for rendering (always hidden) */}
          {!videoUrl&&<canvas ref={canvasRef} style={{position:"fixed",right:8,bottom:8,width:160,height:90,opacity:1,pointerEvents:"none",zIndex:9999,border:"1px solid #e8c96d",background:"#000"}}/>}
        </div>

        {/* Bottom nav */}
        {!videoUrl&&(
          <div style={{borderTop:"1px solid "+GOLDDIM+"",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{background:"transparent",border:"1px solid "+GOLD,color:GOLD,padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",opacity:step===1?0.3:1}}>◀ BACK</button>
            <span style={{color:GOLDDIM,fontSize:10,letterSpacing:2}}>STEP {step} OF 4</span>
            {step<4
              ?<button onClick={()=>setStep(s=>Math.min(4,s+1))} style={{background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>NEXT ▶</button>
              :<button onClick={onClose} style={{background:"transparent",border:"1px solid "+GOLDDIM,color:GOLDDIM,padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>CLOSE</button>
            }
          </div>
        )}
      </div>
    </div>
  );
}

const VOICE_CHARACTERS = [
  {id:"james",name:"James",emoji:"🎩",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Sarcastic · Deadpan · Witty",pitch:0.86,rate:0.62,desc:"Dry British wit. Devastating things said with complete calm."},
  {id:"aurora",name:"Aurora",emoji:"🌅",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Warm · Documentary · Authoritative",pitch:1.08,rate:0.80,desc:"Calm authority. The voice you trust completely."},
  {id:"edward",name:"Edward",emoji:"🎭",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Theatrical · Grand · Classical",pitch:0.85,rate:0.75,desc:"Shakespearean gravitas. Every sentence carved in stone."},
  {id:"cecily",name:"Cecily",emoji:"🫖",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Crisp · Intelligent · Sardonic",pitch:1.12,rate:0.85,desc:"Sharp as a tack. Mildly disappointed by most things."},
  {id:"nana",name:"Nana",emoji:"🧶",gender:"Female",age:"Elderly",origin:"British",region:"Yorkshire",style:"Gentle · Wise · Warm",pitch:1.02,rate:0.70,desc:"Warm elderly wisdom. Has seen everything twice."},
  {id:"colonel",name:"Colonel",emoji:"🎖️",gender:"Male",age:"Elderly",origin:"British",region:"London",style:"Commanding · Dignified · Veteran",pitch:0.80,rate:0.74,desc:"Authority earned through decades of experience."},
  {id:"pippa",name:"Pippa",emoji:"🎀",gender:"Female",age:"Teen",origin:"British",region:"London",style:"Bright · Cheerful · Young",pitch:1.25,rate:0.95,desc:"Fresh and warm. Natural young British energy."},
  {id:"archie",name:"Archie",emoji:"⚽",gender:"Male",age:"Teen",origin:"British",region:"Manchester",style:"Casual · Friendly · Teen",pitch:1.05,rate:0.98,desc:"Relaxed and genuine. Sounds like a real teenager."},
  {id:"ewan",name:"Ewan",emoji:"🏴",gender:"Male",age:"Adult",origin:"Scottish",region:"Edinburgh",style:"Warm · Rugged · Sincere",pitch:0.92,rate:0.82,desc:"Deep warm Scottish sincerity."},
  {id:"fiona",name:"Fiona",emoji:"🌿",gender:"Female",age:"Adult",origin:"Scottish",region:"Glasgow",style:"Lilting · Warm · Storyteller",pitch:1.10,rate:0.84,desc:"Beautiful Scottish lilt."},
  {id:"paddy",name:"Paddy",emoji:"☘️",gender:"Male",age:"Adult",origin:"Irish",region:"Dublin",style:"Charming · Witty · Warm",pitch:0.95,rate:0.88,desc:"Easy Irish charm."},
  {id:"siobhan",name:"Siobhan",emoji:"🌸",gender:"Female",age:"Adult",origin:"Irish",region:"Cork",style:"Gentle · Musical · Emotional",pitch:1.15,rate:0.82,desc:"Soft Irish voice with real emotional depth."},
  {id:"dafydd",name:"Dafydd",emoji:"🐉",gender:"Male",age:"Adult",origin:"Welsh",region:"Cardiff",style:"Musical · Passionate · Rich",pitch:0.90,rate:0.80,desc:"Rich Welsh musicality."},
  {id:"marcus",name:"Marcus",emoji:"⚡",gender:"Male",age:"Adult",origin:"American",region:"New York",style:"Deep · Cinematic · Commanding",pitch:0.72,rate:0.74,desc:"Big voice. When Marcus speaks people stop."},
  {id:"river",name:"River",emoji:"🌊",gender:"Male",age:"Adult",origin:"American",region:"Tennessee",style:"Warm · Intimate · Storyteller",pitch:0.98,rate:0.76,desc:"Unhurried Southern charm."},
  {id:"dakota",name:"Dakota",emoji:"🏔️",gender:"Female",age:"Adult",origin:"American",region:"Chicago",style:"Bold · Direct · Confident",pitch:1.05,rate:0.92,desc:"No filler. No hesitation."},
  {id:"wade",name:"Wade",emoji:"🤠",gender:"Male",age:"Adult",origin:"American",region:"Texas",style:"Laid Back · Humorous · Folksy",pitch:0.94,rate:0.85,desc:"Easy going Southern humour."},
  {id:"brooklyn",name:"Brooklyn",emoji:"🗽",gender:"Female",age:"Adult",origin:"American",region:"New York",style:"Fast · Sharp · City Energy",pitch:1.18,rate:1.10,desc:"Fast New York energy."},
  {id:"savannah",name:"Savannah",emoji:"🌺",gender:"Female",age:"Adult",origin:"American",region:"Georgia",style:"Sweet · Gracious · Warm",pitch:1.20,rate:0.84,desc:"Warm Southern grace."},
  {id:"madison",name:"Madison",emoji:"📱",gender:"Female",age:"Teen",origin:"American",region:"California",style:"Upbeat · Social · Natural",pitch:1.30,rate:1.08,desc:"Real American teenage energy."},
  {id:"tyler",name:"Tyler",emoji:"🎮",gender:"Male",age:"Teen",origin:"American",region:"Ohio",style:"Casual · Relatable · Teen",pitch:1.08,rate:1.00,desc:"Natural and unforced."},
  {id:"rosie",name:"Rosie",emoji:"🌼",gender:"Female",age:"Child",origin:"American",region:"Florida",style:"Sweet · Innocent · Child",pitch:1.45,rate:0.88,desc:"Young warm and sweet."},
  {id:"cooper",name:"Cooper",emoji:"🚂",gender:"Male",age:"Child",origin:"American",region:"Colorado",style:"Bright · Curious · Child",pitch:1.40,rate:0.90,desc:"Curious about everything."},
  {id:"grandma",name:"Grandma",emoji:"🫶",gender:"Female",age:"Elderly",origin:"American",region:"Virginia",style:"Warm · Loving · Elderly",pitch:1.00,rate:0.72,desc:"Full of love and life experience."},
  {id:"frank",name:"Frank",emoji:"🪑",gender:"Male",age:"Elderly",origin:"American",region:"New Jersey",style:"Gruff · Honest · Elder",pitch:0.78,rate:0.76,desc:"Says it straight."},
  {id:"sophia",name:"Sophia",emoji:"☀️",gender:"Female",age:"Adult",origin:"Australian",region:"Sydney",style:"Upbeat · Bright · Energetic",pitch:1.35,rate:1.12,desc:"Forward energy."},
  {id:"finn",name:"Finn",emoji:"🏄",gender:"Male",age:"Adult",origin:"Australian",region:"Melbourne",style:"Casual · Confident · Outdoorsy",pitch:0.95,rate:0.95,desc:"Relaxed Australian confidence."},
  {id:"aroha",name:"Aroha",emoji:"🌿",gender:"Female",age:"Adult",origin:"New Zealand",region:"Auckland",style:"Warm · Grounded · Sincere",pitch:1.10,rate:0.86,desc:"Natural sincerity."},
  {id:"amara",name:"Amara",emoji:"🌍",gender:"Female",age:"Adult",origin:"South African",region:"Cape Town",style:"Rich · Warm · Powerful",pitch:1.05,rate:0.84,desc:"Quiet power."},
  {id:"kofi",name:"Kofi",emoji:"🥁",gender:"Male",age:"Adult",origin:"West African",region:"Ghana",style:"Deep · Rhythmic · Storyteller",pitch:0.82,rate:0.78,desc:"Every sentence has music in it."},
  {id:"priya",name:"Priya",emoji:"🪷",gender:"Female",age:"Adult",origin:"Indian",region:"Mumbai",style:"Precise · Warm · Intelligent",pitch:1.15,rate:0.90,desc:"Warm and intelligent."},
  {id:"arjun",name:"Arjun",emoji:"🎯",gender:"Male",age:"Adult",origin:"Indian",region:"Delhi",style:"Authoritative · Clear · Measured",pitch:0.88,rate:0.85,desc:"Sounds like someone who knows exactly what they are talking about."},
  {id:"valentina",name:"Valentina",emoji:"🌹",gender:"Female",age:"Adult",origin:"Spanish",region:"Madrid",style:"Passionate · Warm · Expressive",pitch:1.18,rate:0.92,desc:"Everything sounds felt."},
  {id:"pierre",name:"Pierre",emoji:"🥐",gender:"Male",age:"Adult",origin:"French",region:"Paris",style:"Suave · Dry · Cultured",pitch:0.90,rate:0.84,desc:"Makes things sound interesting."},
  {id:"ingrid",name:"Ingrid",emoji:"❄️",gender:"Female",age:"Adult",origin:"Scandinavian",region:"Stockholm",style:"Clean · Cool · Direct",pitch:1.08,rate:0.88,desc:"No excess words."},
  {id:"yemi",name:"Yemi",emoji:"🌟",gender:"Female",age:"Adult",origin:"Nigerian",region:"Lagos",style:"Bold · Joyful · Energetic",pitch:1.25,rate:1.00,desc:"Life-affirming."},
  {id:"magnus",name:"Magnus",emoji:"🧙",gender:"Male",age:"Elderly",origin:"Fantasy",region:"Ancient",style:"Ancient · Wise · Epic",pitch:0.75,rate:0.70,desc:"Seen civilisations rise and fall."},
  {id:"nova",name:"Nova",emoji:"🤖",gender:"Female",age:"Adult",origin:"Neutral",region:"AI",style:"Clean · Precise · Neutral",pitch:1.12,rate:0.95,desc:"No accent. No emotion. No opinion."},
  {id:"hunter",name:"Hunter",emoji:"🎬",gender:"Male",age:"Adult",origin:"American",region:"Hollywood",style:"Trailer · Epic · Explosive",pitch:0.70,rate:0.80,desc:"Full movie trailer energy."},
  {id:"luna",name:"Luna",emoji:"🌙",gender:"Female",age:"Adult",origin:"Neutral",region:"ASMR",style:"Whisper · ASMR · Intimate",pitch:1.20,rate:0.65,desc:"Soft whisper. Complete calm."},
  {id:"professor",name:"Professor",emoji:"🎓",gender:"Male",age:"Elderly",origin:"British",region:"Oxford",style:"Academic · Thoughtful · Measured",pitch:0.88,rate:0.78,desc:"Distinguished. Precise."},
  {id:"hope",name:"Hope",emoji:"🌤️",gender:"Female",age:"Adult",origin:"American",region:"Heartfelt",style:"Tender · Gentle · Loving",pitch:1.15,rate:0.78,desc:"Pure tenderness."},
  {id:"storm",name:"Storm",emoji:"⛈️",gender:"Male",age:"Adult",origin:"American",region:"Intense",style:"Intense · Angry · Powerful",pitch:0.82,rate:1.00,desc:"Raw intensity."},
  {id:"joy",name:"Joy",emoji:"🎉",gender:"Female",age:"Adult",origin:"American",region:"Uplifting",style:"Excited · Joyful · Celebratory",pitch:1.40,rate:1.15,desc:"Pure infectious joy."},
  {id:"sage",name:"Sage",emoji:"🌿",gender:"Male",age:"Adult",origin:"Neutral",region:"Mindful",style:"Peaceful · Mindful · Grounded",pitch:0.95,rate:0.72,desc:"Deep calm."},
  {id:"faith",name:"Faith",emoji:"✨",gender:"Female",age:"Adult",origin:"American",region:"Gospel",style:"Inspirational · Gospel · Uplifting",pitch:1.18,rate:0.88,desc:"Gospel soul."},
  {id:"rebel",name:"Rebel",emoji:"✊",gender:"Female",age:"Teen",origin:"American",region:"Activist",style:"Fierce · Defiant · Young",pitch:1.22,rate:1.05,desc:"Will not back down."},
  {id:"blaze",name:"Blaze",emoji:"🔥",gender:"Female",age:"Adult",origin:"American",region:"Cinematic",style:"Warm · Confident · Cinematic",pitch:1.02,rate:0.95,desc:"Warm cinematic narrator."},
  {id:"remy",name:"Remy",emoji:"🎻",gender:"Male",age:"Adult",origin:"French",region:"Lyon",style:"Smooth · Romantic · Intimate",pitch:0.92,rate:0.80,desc:"Everything sounds like poetry."},
  {id:"zhara",name:"Zhara",emoji:"💫",gender:"Female",age:"Adult",origin:"Middle Eastern",region:"Dubai",style:"Elegant · Warm · Sophisticated",pitch:1.10,rate:0.85,desc:"Graceful and precise."},
  {id:"kai",name:"Kai",emoji:"🌊",gender:"Male",age:"Adult",origin:"Hawaiian",region:"Honolulu",style:"Relaxed · Warm · Soulful",pitch:0.96,rate:0.82,desc:"Unhurried ocean warmth."},
  {id:"sienna",name:"Sienna",emoji:"🎨",gender:"Female",age:"Adult",origin:"American",region:"New Orleans",style:"Soulful · Blues · Deep",pitch:1.05,rate:0.78,desc:"Every word feels lived-in."},
  {id:"atlas",name:"Atlas",emoji:"🌐",gender:"Male",age:"Adult",origin:"Neutral",region:"Epic",style:"Cinematic · Epic · Booming",pitch:0.68,rate:0.76,desc:"The voice of a thousand documentaries."},
  {id:"echo",name:"Echo",emoji:"🔮",gender:"Female",age:"Adult",origin:"Neutral",region:"Ethereal",style:"Ethereal · Dreamy · Otherworldly",pitch:1.22,rate:0.72,desc:"Sounds like it came from somewhere else."},
];

function P6Voice({ onSave, setMediaLib }) {
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false);
  const [speaking,setSpeaking]=useState(false); const [mood,setMood]=useState("Neutral");
  const [savedToLib,setSavedToLib]=useState(false); const [showMVS,setShowMVS]=useState(false);
  const [selVoice,setSelVoice]=useState("james"); const [search,setSearch]=useState("");
  const [filterGender,setFilterGender]=useState("All"); const [filterAge,setFilterAge]=useState("All");
  const [filterOrigin,setFilterOrigin]=useState("All"); const [speed,setSpeed]=useState(0.62);
  const [pitchV,setPitchV]=useState(0.86); const [pauseLen,setPauseLen]=useState(1600);
  const [volume,setVolume]=useState(1.0); const [sysVoices,setSysVoices]=useState([]);
  const [myVoices,setMyVoices]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_my_voices")||"[]");}catch{return [];}});
  const myVoiceInputRef=useRef(null);
  const chunksRef=useRef([]); const idxRef=useRef(0); const timerRef=useRef(null);
  const [recordingMine,setRecordingMine]=useState(false); const [recTime,setRecTime]=useState(0);
  const micRef=useRef(null); const recTimerRef=useRef(null);
  // Save your own voice AND keep the real audio in IndexedDB so it survives reload
  // and can be baked into the film. (Previously only a blob: URL was kept, which
  // died on refresh — that is why a recorded voice never actually played back.)
  const addMyVoice=async(file)=>{
    if(!file)return;
    const id="myvoice_"+Date.now();
    const url=URL.createObjectURL(file);
    const nv={id,name:(file.name||"My Voice").replace(/\.[^.]+$/,""),url,dbId:id,origin:"My Upload",gender:"—",age:"—",emoji:"🎙",style:"Your recorded voice",desc:"Your own voice — plays back exactly as recorded."};
    try{await safeSaveClipToDB(id,file,nv.name,"audio/myvoice");}catch(e){}
    const upd=[nv,...myVoices];
    setMyVoices(upd);
    try{localStorage.setItem("ms_my_voices",JSON.stringify(upd.map(v=>({...v,url:undefined}))));}catch{}
    setSelVoice(id);
  };
  const startMyRecording=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream); micRef.current=mr; const chunks=[];
      mr.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      mr.onstop=async()=>{
        const blob=new Blob(chunks,{type:"audio/webm"});
        const f=new File([blob],"My Recording "+new Date().toLocaleTimeString()+".webm",{type:"audio/webm"});
        await addMyVoice(f);
        stream.getTracks().forEach(t=>t.stop());
        setRecordingMine(false);setRecTime(0);
      };
      mr.start(100);setRecordingMine(true);setRecTime(0);
      recTimerRef.current=setInterval(()=>setRecTime(t=>t+1),1000);
    }catch(e){alert("Microphone access denied. Please allow microphone and try again.");}
  };
  const stopMyRecording=()=>{
    if(micRef.current&&micRef.current.state!=="inactive")micRef.current.stop();
    if(recTimerRef.current)clearInterval(recTimerRef.current);
  };
  // Save the SELECTED own-voice recording as the film's narration — real audio,
  // not synthetic. Lands on the timeline audio track like any other clip.
  const saveMyVoiceAsNarration=async()=>{
    const mine=myVoices.find(v=>v.id===selVoice);
    if(!mine){alert("Pick or record your own voice first, then save it as narration.");return;}
    let blob=null;
    try{const st=await loadClipFromDB(mine.dbId||mine.id);if(st&&st.blob)blob=st.blob;}catch(e){}
    if(!blob&&mine.url){try{blob=await (await fetch(mine.url)).blob();}catch(e){}}
    if(!blob){alert("Could not find that recording's audio — try recording again.");return;}
    const id="narr_myvoice_"+Date.now();
    const asset={id,name:"My Voice Narration - "+new Date().toLocaleTimeString(),type:"audio/myvoice",dbId:id,date:new Date().toISOString()};
    await safeSaveClipToDB(id,blob,asset.name,"audio/myvoice");
    if(onSave)onSave(asset);
    if(setMediaLib)setMediaLib(p=>[...p,asset]);
    setSavedToLib(true);setTimeout(()=>setSavedToLib(false),3000);
  };
  const delMyVoice=(id)=>{const upd=myVoices.filter(v=>v.id!==id);setMyVoices(upd);try{localStorage.setItem("ms_my_voices",JSON.stringify(upd.map(v=>({...v,url:undefined}))));}catch{}};

  // ── HIDDEN CLONE FEATURE ────────────────────────────────────────
  // Not shown in normal UI. Turns the SELECTED own-voice recording into
  // a cloned voice the engine can speak new text in. The clone is stored
  // as an engine voice id on that my-voice entry; picking it later makes
  // the engine narrate in the cloned voice.
  const [cloning,setCloning]=useState(false);
  const cloneMyVoice=async()=>{
    const mine=myVoices.find(v=>v.id===selVoice);
    if(!mine){alert("Pick or record one of your own voices first, then clone it.");return;}
    if(mine.clonedVoiceId){alert("This voice is already cloned. Select it and the engine will narrate in your cloned voice.");return;}
    setCloning(true);
    try{
      // Get the real audio for the sample, as a data URI the engine can read.
      let blob=null;
      try{const st=await loadClipFromDB(mine.dbId||mine.id);if(st&&st.blob)blob=st.blob;}catch(e){}
      if(!blob&&mine.url){try{blob=await (await fetch(mine.url)).blob();}catch(e){}}
      if(!blob){setCloning(false);alert("Could not find that recording's audio — try recording again.");return;}
      const dataUri=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(blob);});
      const vid=await engineCloneVoice(dataUri);
      if(!vid){setCloning(false);alert("Voice clone did not complete. Check the engine has credit, then try again.");return;}
      const upd=myVoices.map(v=>v.id===mine.id?{...v,clonedVoiceId:vid,engineVoice:vid,desc:"Your cloned voice — the engine narrates new text in your voice.",style:"Your cloned voice"}:v);
      setMyVoices(upd);
      try{localStorage.setItem("ms_my_voices",JSON.stringify(upd.map(v=>({...v,url:undefined}))));}catch{}
      setCloning(false);
      alert("Cloned. Select this voice and the engine will narrate any text in your voice.");
    }catch(e){setCloning(false);alert("Voice clone failed — try again.");}
  };

  useEffect(()=>{
    const load=()=>{ if(typeof window==="undefined"||!window.speechSynthesis){return;} setSysVoices(window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en"))); };
    load(); if(typeof window!=="undefined"&&window.speechSynthesis){window.speechSynthesis.onvoiceschanged=load;}
    return()=>{window.speechSynthesis.cancel();if(timerRef.current)clearTimeout(timerRef.current);};
  },[]);

  const ORIGINS=["All","British","Scottish","Irish","Welsh","American","Australian","New Zealand","South African","West African","Indian","Spanish","French","Scandinavian","Nigerian","Fantasy","Neutral"];
  const AGES=["All","Child","Teen","Adult","Elderly"];
  const GENDERS=["All","Male","Female"];
  const filtered=VOICE_CHARACTERS.filter(v=>{
    const mg=filterGender==="All"||v.gender===filterGender;
    const ma=filterAge==="All"||v.age===filterAge;
    const mo=filterOrigin==="All"||v.origin===filterOrigin;
    const ms=search===""||v.name.toLowerCase().includes(search.toLowerCase())||v.style.toLowerCase().includes(search.toLowerCase());
    return mg&&ma&&mo&&ms;
  });
  // A selected own-voice that has been cloned resolves to itself, so its
  // engine voice id (the clone) flows into speakNow's meta.voice and the
  // engine narrates in the cloned voice.
  const mineSel=myVoices.find(v=>v.id===selVoice&&v.clonedVoiceId);
  const selected=mineSel||VOICE_CHARACTERS.find(v=>v.id===selVoice)||VOICE_CHARACTERS[0];

  const pickSysVoice=(vc)=>{
    const allRaw=sysVoices.length?sysVoices:((typeof window!=="undefined"&&window.speechSynthesis)?window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en")):[]);
    if(!allRaw.length)return null;
    // ── QUALITY FIRST — use Enhanced/Premium/Siri/Neural voices when present ──
    const isHiQ=(v)=>/premium|enhanced|siri|neural|natural|online|multilingual/i.test((v.name||"")+" "+(v.voiceURI||""));
    const hiQ=allRaw.filter(isHiQ);
    const all=hiQ.length?hiQ:allRaw;
    const gb=all.filter(v=>v.lang==="en-GB"),us=all.filter(v=>v.lang==="en-US"),au=all.filter(v=>v.lang==="en-AU");
    const hash=vc.id.split("").reduce((a,ch)=>a+ch.charCodeAt(0),0);
    const isMale=vc.gender==="Male",isBritish=["British","Scottish","Irish","Welsh"].includes(vc.origin),isAU=["Australian","New Zealand"].includes(vc.origin);
    const deepMaleNames=/daniel|oliver|arthur|malcolm|george|alex|fred|tom|aaron|guy|bruce|lee|david|mark/i;
    const softFemaleNames=/kate|serena|emily|moira|fiona|samantha|ava|victoria|zoe|susan|karen|tessa/i;
    let pool=[];
    if(isBritish&&isMale){pool=[...gb.filter(v=>deepMaleNames.test(v.name)),...gb.filter(v=>!softFemaleNames.test(v.name))];}
    else if(isBritish&&!isMale){pool=[...gb.filter(v=>softFemaleNames.test(v.name)),...gb.filter(v=>!deepMaleNames.test(v.name))];}
    else if(isAU){pool=[...au,...all];}
    else if(vc.origin==="Irish"){pool=gb.filter(v=>/moira/i.test(v.name));}
    else if(isMale){pool=[...us.filter(v=>deepMaleNames.test(v.name)),...us.filter(v=>!softFemaleNames.test(v.name)),...all.filter(v=>!softFemaleNames.test(v.name))];}
    else{pool=[...us.filter(v=>softFemaleNames.test(v.name)),...us.filter(v=>!deepMaleNames.test(v.name)),...all.filter(v=>!deepMaleNames.test(v.name))];}
    if(!pool.length)pool=all;
    const unique=[...new Map(pool.map(v=>[v.name,v])).values()];
    return unique[hash%unique.length]||all[0];
  };

  const speakOneShot=(vc,txt)=>{
    window.speechSynthesis.cancel();
    const utt=new SpeechSynthesisUtterance(txt);
    const sv=pickSysVoice(vc);if(sv)utt.voice=sv;
    utt.pitch=Math.max(0.1,Math.min(2.0,vc.pitch||1.0));
    utt.rate=vc.rate||0.85;utt.volume=1.0;
    window.speechSynthesis.speak(utt);
  };

  const speakDevice=(txt)=>{
    window.speechSynthesis.cancel();if(timerRef.current)clearTimeout(timerRef.current);
    // iOS Safari fix — keepalive ping every 10s
    if(/iphone|ipad|ipod/i.test(navigator.userAgent)){
      const keepAlive=setInterval(()=>{if(window.speechSynthesis.speaking){window.speechSynthesis.pause();window.speechSynthesis.resume();}else{clearInterval(keepAlive);}},9000);
    }
    const chunks=buildChunks(txt);chunksRef.current=chunks;idxRef.current=0;setSpeaking(true);
    const baseRate=speed*(selected.rate||0.9),basePitch=pitchV*(selected.pitch||1.0);
    const next=()=>{
      const idx=idxRef.current;
      if(idx>=chunksRef.current.length){setSpeaking(false);return;}
      const chunk=chunksRef.current[idx];
      if(!chunk||!chunk.text){idxRef.current=idx+1;timerRef.current=setTimeout(next,200);return;}
      const sv=pickSysVoice(selected);
      const utt=new SpeechSynthesisUtterance(chunk.text);
      if(sv)utt.voice=sv;utt.volume=volume;
      utt.rate=Math.max(0.1,Math.min(2.0,baseRate));
      utt.pitch=Math.max(0.1,Math.min(2.0,basePitch+(chunk.type==="question"?0.1:chunk.type==="exclaim"?0.07:0)));
      const ap=chunk.type==="question"?Math.round(pauseLen*1.1):chunk.type==="sentence"?pauseLen:Math.round(pauseLen*0.4);
      utt.onend=()=>{idxRef.current=idx+1;timerRef.current=setTimeout(next,ap);};
      utt.onerror=()=>{idxRef.current=idx+1;next();};
      window.speechSynthesis.speak(utt);
    };
    if(typeof window==="undefined"||!window.speechSynthesis){setTimeout(next,50);} else { window.speechSynthesis.getVoices().length>0?setTimeout(next,50):window.speechSynthesis.onvoiceschanged=()=>{window.speechSynthesis.onvoiceschanged=null;setTimeout(next,50);}; }
  };

  // Engine voice first. Identical on every device. Device voice only if the engine cannot deliver.
  const speakNow=async(txt)=>{
    window.speechSynthesis.cancel(); stopEngineAudio();
    if(timerRef.current)clearTimeout(timerRef.current);
    const chunks=buildChunks(txt); chunksRef.current=chunks; idxRef.current=0;
    setSpeaking(true);
    const meta={voice:selected.engineVoice||"",gender:selected.gender||"",origin:selected.origin||"",speed:speed*(selected.rate||0.9)};
    const first=chunks.find(c=>c&&c.text);
    if(!first){setSpeaking(false);return;}
    const probe=await engineSpeak(first.text,meta);
    if(!probe){ console.log("Cinema Voice Engine unavailable — using device voice"); speakDevice(txt); return; }
    console.log("\u2713 MANDASTRONG CINEMA VOICE ENGINE \u2014 studio narration ready");
    let url=probe;
    for(let i=0;i<chunks.length;i++){
      const c=chunks[i];
      if(!c||!c.text) continue;
      if(i>0){ url=await engineSpeak(c.text,meta); if(!url) continue; }
      const ok=await playEngineAudio(url,volume);
      if(!ok){ console.log("Cinema Voice Engine playback blocked — using device voice"); speakDevice(txt); return; }
      const ap=c.type==="question"?Math.round(pauseLen*1.1):c.type==="sentence"?pauseLen:Math.round(pauseLen*0.4);
      await new Promise(r=>setTimeout(r,ap));
    }
    setSpeaking(false);
  };

  const stop=()=>{window.speechSynthesis.cancel();stopEngineAudio();if(timerRef.current)clearTimeout(timerRef.current);setSpeaking(false);};

  const processAndSpeak=async()=>{
    if(!text.trim())return;setLoading(true);
    try{
      const d=await proxyFetch({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:"Speech coach for TTS. Speaker: "+selected.name+" - "+selected.style+". Mood: "+mood+". Reformat for natural speech: short sentences, commas for pauses, numbers spelled out. Return ONLY reformatted text:\n\n"+text}]});
      speakNow(d&&d.content&&d.content[0]?d.content[0].text.trim():text);
    }catch(e){speakNow(text);}
    setLoading(false);
  };

  const inp={width:"100%",background:"#000",border:"1px solid "+GOLDDIM,padding:"12px 14px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.9};

  return(
    <div style={{...Sp}}>
      {showMVS&&<MusicVideoStudio onClose={()=>setShowMVS(false)} onSave={onSave}/>}
      <div style={{padding:"12px 18px",borderBottom:"1px solid "+GOLDDIM+"",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>AI WORKSTATION 02 — CINEMA VOICE ENGINE</div><h1 style={{...H1,fontSize:24,margin:0}}>TEXT TO LIFELIKE SPEECH</h1></div>
        <button onClick={()=>setShowMVS(true)} style={{background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",padding:"10px 20px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>🎬 MUSIC VIDEO STUDIO</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"290px 1fr",minHeight:"calc(100vh - 120px)"}}>
        <div style={{borderRight:"1px solid "+GOLDDIM+"",background:"#030303",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 10px 6px"}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8}}>VOICE LIBRARY — {filtered.length} / {VOICE_CHARACTERS.length}</div>
            <div style={{marginBottom:5}}><div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>GENDER</div><div style={{display:"flex",gap:4}}>{GENDERS.map(g=><button key={g} onClick={()=>setFilterGender(g)} style={{flex:1,background:filterGender===g?GOLD:"#111",border:"1px solid "+(filterGender===g?"#000":GOLDDIM),color:filterGender===g?"#000":WHITE,padding:"3px 0",cursor:"pointer",fontSize:10,fontWeight:900}}>{g}</button>)}</div></div>
            <div style={{marginBottom:5}}><div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>AGE</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{AGES.map(a=><button key={a} onClick={()=>setFilterAge(a)} style={{background:filterAge===a?GOLD:"#111",border:"1px solid "+(filterAge===a?"#000":GOLDDIM),color:filterAge===a?"#000":WHITE,padding:"2px 8px",cursor:"pointer",fontSize:9,fontWeight:900}}>{a}</button>)}</div></div>
            <div style={{marginBottom:6}}><div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>ORIGIN</div><select value={filterOrigin} onChange={e=>setFilterOrigin(e.target.value)} style={{width:"100%",background:"#111",border:"1px solid "+GOLDDIM,color:WHITE,padding:"4px 8px",fontSize:11,outline:"none"}}>{ORIGINS.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search voices..." style={{...inp,padding:"6px 10px",fontSize:11,height:30}}/>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 6px 80px"}}>
            <input ref={myVoiceInputRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)addMyVoice(f);e.target.value="";}}/>
            {recordingMine?(
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#1a0000",border:"2px solid #ef4444",padding:"9px 12px",marginBottom:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#ef4444",boxShadow:"0 0 8px #ef4444"}}/>
                <span style={{color:"#ef4444",fontWeight:900,fontSize:11,letterSpacing:2,flex:1}}>RECORDING — {String(Math.floor(recTime/60)).padStart(2,"0")}:{String(recTime%60).padStart(2,"0")}</span>
                <button onClick={stopMyRecording} style={{background:"#ef4444",border:"none",color:"#fff",padding:"5px 14px",cursor:"pointer",fontSize:10,fontWeight:900,letterSpacing:2}}>■ STOP & SAVE</button>
              </div>
            ):(
              <button onClick={startMyRecording} style={{width:"100%",background:"linear-gradient(135deg,#7a0000,#ef4444)",border:"none",color:"#fff",padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>● RECORD MY VOICE NOW</button>
            )}
            <button onClick={()=>myVoiceInputRef.current&&myVoiceInputRef.current.click()} style={{width:"100%",background:"linear-gradient(135deg,#1a0800,#2a1200)",border:"2px solid "+GOLD,color:GOLD,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>＋ ADD YOUR OWN VOICE (FILE)</button>
            {myVoices.some(v=>v.id===selVoice)&&(
              <button onClick={saveMyVoiceAsNarration} style={{width:"100%",background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",padding:"11px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>🎙 USE MY VOICE AS NARRATION</button>
            )}
            {myVoices.map(v=>(
              <div key={v.id} onClick={()=>setSelVoice(v.id)} style={{padding:"10px 12px",marginBottom:4,background:selVoice===v.id?"#0a0800":"#000",border:"2px solid "+(selVoice===v.id?GOLD:GOLDDIM),cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {/* Hidden clone trigger: double-click the emoji of a selected own-voice to clone it. */}
                    <span style={{fontSize:18,cursor:selVoice===v.id?"pointer":"inherit"}} title="" onDoubleClick={e=>{e.stopPropagation();if(selVoice===v.id&&!cloning){setSelVoice(v.id);cloneMyVoice();}}}>{v.emoji}</span>
                    <div><div style={{color:selVoice===v.id?GOLD:WHITE,fontSize:13,fontWeight:900}}>{v.name}{v.clonedVoiceId&&<span style={{color:GOLD,fontSize:10,marginLeft:6}}>✦ CLONED</span>}</div><div style={{color:GOLDDIM,fontSize:10}}>{v.clonedVoiceId?"Your cloned voice — engine narrates in your voice":"Your uploaded voice"}</div></div>
                  </div>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    {v.url&&<button onClick={e=>{e.stopPropagation();const a=new Audio(v.url);a.play().catch(()=>{});}} style={{background:GOLDDIM,border:"none",color:"#000",padding:"3px 8px",cursor:"pointer",fontSize:9,fontWeight:900}}>▶</button>}
                    <button onClick={e=>{e.stopPropagation();delMyVoice(v.id);}} style={{background:"#000",border:"1px solid "+GOLD,color:GOLD,padding:"3px 8px",cursor:"pointer",fontSize:9,fontWeight:900}}>✕</button>
                  </div>
                </div>
                {selVoice===v.id&&<div style={{color:GOLD,fontSize:9,letterSpacing:2,marginTop:4,fontWeight:900}}>{cloning?"✦ CLONING YOUR VOICE…":"✓ SELECTED"}</div>}
              </div>
            ))}
            {filtered.map(v=>(
              <div key={v.id} onClick={()=>setSelVoice(v.id)} style={{padding:"10px 12px",marginBottom:4,background:selVoice===v.id?"#0a0800":"#000",border:"2px solid "+selVoice===v.id?GOLD:GOLDDIM,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:18}}>{v.emoji}</span>
                    <div><div style={{color:selVoice===v.id?GOLD:WHITE,fontSize:13,fontWeight:900}}>{v.name}</div><div style={{color:GOLDDIM,fontSize:10}}>{v.origin} · {v.gender} · {v.age}</div></div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setSelVoice(v.id);speakOneShot(v,"Hello, this is "+v.name+". "+v.desc);}}
                    style={{background:GOLDDIM,border:"none",color:"#000",padding:"3px 10px",cursor:"pointer",fontSize:9,fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif",whiteSpace:"nowrap",flexShrink:0}}>▶ TEST</button>
                </div>
                <div style={{color:DIM,fontSize:10,lineHeight:1.5}}>{v.style}</div>
                {selVoice===v.id&&<div style={{color:GOLD,fontSize:9,letterSpacing:2,marginTop:4,fontWeight:900}}>✓ SELECTED</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",background:"#030303",overflowY:"auto",padding:20}}>
          <div style={{background:"#000",border:"1px solid "+GOLDDIM,padding:"10px 14px",marginBottom:14}}>
            <div style={{color:WHITE,fontSize:13,fontWeight:900}}>{selected.name} {selected.emoji} · {selected.origin} · {selected.gender}</div>
            <div style={{color:GOLDDIM,fontSize:11,marginTop:3}}>{selected.style}</div>
            <div style={{color:DIM,fontSize:11,marginTop:2,fontStyle:"italic"}}>{selected.desc}</div>
          </div>
          <div style={{background:"#0a0a0a",border:"1px solid "+GOLDDIM,padding:"12px 14px",marginBottom:14}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:10}}>VOICE SETTINGS</div>
            <div style={{marginBottom:10}}><div style={{color:GOLDDIM,fontSize:10,fontWeight:900,letterSpacing:2,marginBottom:4}}>MOOD</div>
              <select value={mood} onChange={e=>setMood(e.target.value)} style={{width:"100%",background:"#0a0800",border:"1px solid "+GOLDDIM,color:WHITE,padding:"8px 12px",fontSize:13,fontFamily:"'Rajdhani',sans-serif",outline:"none"}}>
                {["Neutral","Happy","Sad","Angry","Excited","Calm","Dramatic","Mysterious","Romantic","Sarcastic","Melancholic","Authoritative","Warm"].map(m=><option key={m} value={m} style={{background:"#000"}}>{m}</option>)}
              </select>
            </div>
            {[["SPEED",speed,0.3,1.5,0.01,v=>setSpeed(v),speed.toFixed(2)+"x"],["PITCH",pitchV,0.3,2.0,0.01,v=>setPitchV(v),pitchV.toFixed(2)],["PAUSE (ms)",pauseLen,200,2000,50,v=>setPauseLen(v),pauseLen+"ms"],["VOLUME",volume,0.1,1.0,0.05,v=>setVolume(v),Math.round(volume*100)+"%"]].map(([label,val,mn,mx,st,setter,display])=>(
              <div key={label} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:GOLDDIM,fontSize:10,fontWeight:900,letterSpacing:2}}>{label}</span><span style={{color:GOLD,fontSize:11,fontWeight:900}}>{display}</span></div>
                <input type="range" min={mn} max={mx} step={st} value={val} onChange={e=>setter(+e.target.value)} style={{width:"100%",accentColor:GOLD}}/>
              </div>
            ))}
          </div>
          <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6}}>YOUR NARRATION SCRIPT</div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your narration script here..."
            style={{...inp,height:160,resize:"vertical",marginBottom:14}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={{background:"#0a0800",border:"1px solid "+GOLDDIM,padding:"12px 14px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2,marginBottom:6}}>TEST SCRIPT</div>
              <div style={{color:WHITE,fontSize:11,lineHeight:1.7,marginBottom:10}}>Hear your script with current voice and settings.</div>
              <button onClick={()=>speaking?stop():speakNow(text)} disabled={!text.trim()} style={{background:"transparent",border:"1px solid "+GOLD,color:GOLD,width:"100%",padding:"9px",fontSize:11,fontWeight:900,letterSpacing:2,cursor:!text.trim()?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",opacity:!text.trim()?0.5:1}}>{speaking?"⏹ STOP":"▶ TEST SCRIPT"}</button>
            </div>
            <div style={{background:"#0a0800",border:"1px solid "+GOLDDIM,padding:"12px 14px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2,marginBottom:6}}>RESET</div>
              <div style={{color:WHITE,fontSize:11,lineHeight:1.7,marginBottom:10}}>Clear script and reset all settings.</div>
              <button onClick={()=>{stop();setText("");setSavedToLib(false);setSpeed(0.62);setPitchV(0.86);setPauseLen(1600);setVolume(1.0);setMood("Neutral");}} style={{background:"transparent",border:"1px solid "+GOLD,color:GOLD,width:"100%",padding:"9px",fontSize:11,fontWeight:900,letterSpacing:2,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>↺ RESET ALL</button>
            </div>
          </div>
          <button onClick={()=>{
            if(!text.trim())return;
            speakText(selVoice, text, ()=>setSpeaking(true), ()=>setSpeaking(false));
          }} disabled={!text.trim()||speaking} style={{background:"linear-gradient(135deg,"+GOLDDIM+","+GOLD+")",border:"none",color:"#000",width:"100%",padding:"16px",fontSize:14,fontWeight:900,letterSpacing:3,cursor:!text.trim()?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",opacity:!text.trim()?0.5:1,marginBottom:8}}>
            {speaking?"⏺ SPEAKING...":"✦ PREPARE TO SPEAK"}
          </button>
          <button onClick={async()=>{
            if(!text.trim())return;
            setSavedToLib(false);
            const asset={
              id:"narr_"+Date.now(),
              name:"Narration - "+selected.name+" - "+new Date().toLocaleTimeString(),
              type:"narration",
              text:text,
              voice:selVoice,
              pitch:selected.pitch,
              rate:selected.rate,
              date:new Date().toISOString()
            };
            await safeSaveClipToDB(asset.id,new Blob([text],{type:"text/plain"}),asset.name,"narration");
            if(onSave)onSave(asset);
            if(setMediaLib)setMediaLib(p=>[...p,asset]);
            setSavedToLib(true);
            setTimeout(()=>setSavedToLib(false),3000);
          }} disabled={!text.trim()} style={{background:"transparent",border:"1px solid "+GOLD,color:GOLD,width:"100%",padding:"14px",fontSize:13,fontWeight:900,letterSpacing:3,cursor:!text.trim()?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",opacity:!text.trim()?0.5:1,marginBottom:8}}>
            💾 SAVE TO MEDIA LIBRARY
          </button>
          {savedToLib&&<div style={{background:"#061406",border:"1px solid #22c55e",padding:"10px 14px",textAlign:"center",marginBottom:8}}><span style={{color:"#22c55e",fontWeight:900,fontSize:12,letterSpacing:2}}>✓ NARRATION SAVED TO MEDIA LIBRARY — AUTO-ADDED TO TIMELINE</span></div>}
        </div>
      </div>
    </div>
  );
}
;



function P8VideoGenerator({ onSave, user, filmDuration, setFilmDuration }) {
  const canvasRef=useRef(null);
  const videoRef=useRef(null);
  const refMediaRef=useRef(null);
  const realityPhotoRef=useRef(null);
  const [prompt,setPrompt]=useState("");
  const [title,setTitle]=useState("");
  const [duration,setDuration]=useState(30);
  const [generating,setGenerating]=useState(false);
  const [progress,setProgress]=useState(0);
  const [log,setLog]=useState([]);
  const [videoUrl,setVideoUrl]=useState("");
  const [saved,setSaved]=useState(false);
  // ── BACKGROUND MUSIC ──────────────────────────────────────────
  const [addMusic,setAddMusic]=useState(false);
  const [musicTrack,setMusicTrack]=useState("");
  const MUSIC_LIBRARY=[
    {id:"epic",     label:"⚔️ Epic / Trailer",       url:"https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3"},
    {id:"drama",    label:"🎭 Drama / Powerful",     url:"https://cdn.pixabay.com/audio/2023/01/29/audio_5bf2f9f5b0.mp3"},
    {id:"emotional",label:"💧 Emotional / Piano",    url:"https://cdn.pixabay.com/audio/2021/11/25/audio_00fa5593f3.mp3"},
    {id:"ambient",  label:"🌌 Ambient / Cinematic",  url:"https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3"},
    {id:"uplifting",label:"☀️ Uplifting / Hopeful",   url:"https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"},
    {id:"tension",  label:"🎯 Tension / Suspense",    url:"https://cdn.pixabay.com/audio/2022/03/10/audio_d1718ab41b.mp3"},
    {id:"warm",     label:"🕯️ Warm / Reflective",     url:"https://cdn.pixabay.com/audio/2021/08/09/audio_54ca0ffa52.mp3"},
    {id:"inspiring",label:"🌅 Inspiring / Anthemic",  url:"https://cdn.pixabay.com/audio/2022/10/25/audio_946bc8a627.mp3"},
    {id:"sad",      label:"🌧️ Sad / Melancholy",      url:"https://cdn.pixabay.com/audio/2022/10/18/audio_31a1f6f2a6.mp3"},
    {id:"action",   label:"💥 Action / Driving",      url:"https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3"},
  ];
  const [refMedia,setRefMedia]=useState(null);
  const [refMediaType,setRefMediaType]=useState("");
  const [refDataUrl,setRefDataUrl]=useState(null);
  const [refImages,setRefImages]=useState([]);
  const [renderStyle,setRenderStyle]=useState("photorealistic");
  const [genre,setGenre]=useState("");
  const [targetMin,setTargetMin]=useState(0);
  const [madeClips,setMadeClips]=useState([]);
  const [gapPrompt,setGapPrompt]=useState(null);
  const [gapBusy,setGapBusy]=useState(false);
  const addLog=(msg)=>setLog(p=>[...p,msg]);
  const madeSeconds=madeClips.reduce((a,c)=>a+(c.duration||0),0);
  const targetSeconds=targetMin*60;
  const gapSeconds=Math.max(0,targetSeconds-madeSeconds);
  const fmtMin=(s)=>{const m=Math.floor(s/60),ss=Math.round(s%60);return m+"m "+(ss<10?"0":"")+ss+"s";};

  const RENDER_STYLES=[
    {id:"photorealistic",label:"📷 Photorealistic"},
    {id:"cinematic",label:"🎬 Cinematic"},
    {id:"documentary",label:"🎥 Documentary"},
    {id:"noir",label:"🌑 Film Noir"},
    {id:"golden",label:"🌅 Golden Hour"},
    {id:"scifi",label:"🚀 Sci-Fi"},
    {id:"horror",label:"👻 Horror"},
    {id:"animated",label:"✨ Stylised"},
  ];
  const FILM_GENRES=[
    {id:"",label:"— NO GENRE —"},
    {id:"feature",label:"🎬 Feature Film"},{id:"documentary",label:"🎥 Documentary"},
    {id:"musicvideo",label:"🎵 Music Video"},{id:"shortfilm",label:"🎭 Short Film"},
    {id:"horror",label:"👻 Horror"},{id:"scifi",label:"🚀 Sci-Fi"},
    {id:"romance",label:"💕 Romance"},{id:"thriller",label:"⚡ Thriller"},
    {id:"action",label:"💥 Action"},{id:"comedy",label:"😄 Comedy"},
    {id:"drama",label:"🎭 Drama"},{id:"animation",label:"✨ Animation"},
    {id:"historical",label:"🏛 Historical"},{id:"nature",label:"🌿 Nature"},
  ];
  const EXAMPLES=[
    "Earth rotating slowly in deep space. City lights blazing gold on the night side. Stars everywhere.",
    "A woman places a folded paper into a wooden ballot box. Morning light from a window.",
    "Night city skyline. Rain. Neon reflections on wet streets. A lone figure walks under a streetlight.",
    "Underwater coral reef. Vivid tropical fish. Light shafts from the surface above.",
    "An elderly couple on a park bench in autumn. Golden leaves falling. Neither speaking.",
    "Vast dark server room. Three people huddled around a single warm lantern. Faces lit gold.",
    "Cave interior. Torchlight. Ancient paintings on the walls. A figure looking at camera.",
    "Dawn breaking over a savanna. A silhouetted human figure stands at the horizon.",
  ];
