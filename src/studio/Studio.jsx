// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════
// MANDAS 1 SHOT FILM STUDIO — one shot, one page, everything in, everything out.
// A separate app inside the MandaStrong Studio project. It does not touch the
// 25-page app. Powered by the MandaStrong Engine.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from "react";
import {
  supabase, engineAuthHeaders, msVoiceText, proxyFetch, translateText,
  msSpokenOnly, msParseCast, msCastVoices, VOICE_CHARACTERS, msBedSource, msBlobSeconds, engineCloneVoice
} from "./engine.js";

// Fast length of a recording (reads only the header, so a 60-minute file never has to be decoded).
const audioSecs = (blob) => new Promise(res => { try { const a = new Audio(); const u = URL.createObjectURL(blob); let done = false; const fin = (v) => { if (done) return; done = true; URL.revokeObjectURL(u); res(v); }; a.preload = "metadata"; a.onloadedmetadata = () => { if (isFinite(a.duration) && a.duration > 0) fin(a.duration); else { a.currentTime = 1e7; a.ontimeupdate = () => { a.ontimeupdate = null; fin(isFinite(a.duration) ? a.duration : 0); }; } }; a.onerror = () => fin(0); setTimeout(() => fin(0), 20000); a.src = u; } catch (e) { res(0); } });
const sentencesOf = (t) => (String(t || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]+["\u2019\u201D)]*\s*|[^.!?]+$/g) || []).map(x => x.trim()).filter(Boolean);
const wordsIn = (t) => (String(t || "").match(/\S+/g) || []).length;
// Professional voice chain: rumble cut, less mud, presence, air, gentle compression, limiter. Output is stereo.
function proVoice(ac, input) {
  const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 80; hp.Q.value = 0.7;
  const mud = ac.createBiquadFilter(); mud.type = "peaking"; mud.frequency.value = 280; mud.Q.value = 1; mud.gain.value = -3;
  const warm = ac.createBiquadFilter(); warm.type = "lowshelf"; warm.frequency.value = 140; warm.gain.value = 1.5;
  const pres = ac.createBiquadFilter(); pres.type = "peaking"; pres.frequency.value = 3200; pres.Q.value = 0.9; pres.gain.value = 3;
  const ess = ac.createBiquadFilter(); ess.type = "peaking"; ess.frequency.value = 7000; ess.Q.value = 3; ess.gain.value = -2.5;
  const air = ac.createBiquadFilter(); air.type = "highshelf"; air.frequency.value = 10000; air.gain.value = 2.5;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -22; comp.knee.value = 8; comp.ratio.value = 3.5; comp.attack.value = 0.008; comp.release.value = 0.2;
  const make = ac.createGain(); make.gain.value = 1.5;
  const lim = ac.createDynamicsCompressor(); lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.1;
  const st = ac.createGain(); st.channelCount = 2; st.channelCountMode = "explicit"; st.channelInterpretation = "speakers";
  input.connect(hp); hp.connect(mud); mud.connect(warm); warm.connect(pres); pres.connect(ess); ess.connect(air); air.connect(comp); comp.connect(make); make.connect(lim); lim.connect(st);
  return st;
}

const SB = "https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/";
const SE = SB + "studio-engine";
const LIPSYNC = SB + "lip-sync";
const SITE = "mandas1shot1filmstudio.bolt.host";
// One plan: $50 a month. Extra usage uses the same Stripe link as the main app.
const SUB_LINK = "https://buy.stripe.com/cNi8wRe8a9ZtcZh7YeafS05";
const TOPUP_LINK = SUB_LINK; // same $50 link the main app uses for "Purchase usage credits"
const PLANS = [
  { id: "starter", name: "Starter", line: "Short clips · watermark", link: "https://buy.stripe.com/00wcN7fcefjNgbtceuafS03" },
  { id: "creator", name: "Creator", line: "Films up to 1 hour · no watermark", link: "https://buy.stripe.com/cNi8wRe8a3B52kDceuafS04" },
  { id: "studio", name: "Studio", line: "Up to 3 hours · every extra · dubbing", link: "https://buy.stripe.com/cNi8wRe8a9ZtcZh7YeafS05" },
];
const KINDS = ["Movie", "Short film", "Video series", "Cartoon", "Animated series", "Documentary", "Music video", "Short clip", "Ad / promo", "Trailer", "Kids' story", "Explainer"];
// NO LOOPING, LOW COST: engine clips are 5 s and play at half speed (10 s on screen), so one new shot fills every 10 s and nothing repeats.
const SHOT_SECS = 10, SLOW = 0.5, SHOT_CAP = 360;
const ANGLES = ["wide establishing shot", "close-up on the faces", "slow push-in from behind", "over-the-shoulder shot", "low angle looking up", "high angle looking down", "side view, tracking along", "detail shot of hands and objects", "slow pull-back to reveal the room", "medium two-shot, gentle camera drift"];
const slowOf = s => (s && s.source === "engine") ? SLOW : 1;
const GENRES = ["Drama", "Comedy", "Family", "Holiday", "Adventure", "Fantasy", "Sci-fi", "Romance", "Action", "Mystery", "Thriller", "Horror", "Western", "Historical", "Inspirational", "Educational"];
const AUDIENCES = ["Kids", "Family", "Teens", "Adults"];
const TOONS = ["2D hand-drawn", "3D animated", "Anime", "Claymation", "Stop motion", "Watercolour storybook", "Comic book", "Pixel art"];
const CAMERAS = ["Cinematic", "Handheld", "Drone / aerial", "Close-ups", "Wide shots", "Slow motion"];
const PACES = ["Slow", "Balanced", "Fast cuts"];
const MUSIC_GENRES = ["Orchestral", "Piano", "Acoustic guitar", "Pop", "Rock", "Hip-hop", "Country", "Folk", "Electronic", "Jazz", "Choir", "Lullaby"];
const TEMPOS = ["Slow", "Medium", "Fast"];
const isAnimKind = k => /cartoon|animat|kids/i.test(k || "");
const isSeries = k => /series/i.test(k || "");
const STYLES = ["Cinematic", "Documentary", "Animated", "Vintage film", "Noir"];
const GRADES = [
  { id: "gold", label: "Gold & Amber", tint: "rgba(232,190,110,0.10)", prompt: "warm gold and amber colour grade" },
  { id: "cold", label: "Cold Blue", tint: "rgba(90,140,220,0.10)", prompt: "cold blue colour grade" },
  { id: "warm", label: "Warm Film", tint: "rgba(230,150,90,0.09)", prompt: "warm film stock grade" },
  { id: "natural", label: "Natural", tint: "rgba(0,0,0,0)", prompt: "natural colour grade" },
];
const MOODS = [
  { id: "ambient", label: "Cinematic ambient", url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3" },
  { id: "emotional", label: "Emotional piano", url: "https://cdn.pixabay.com/audio/2021/11/25/audio_00fa5593f3.mp3" },
  { id: "epic", label: "Epic trailer", url: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3" },
  { id: "uplifting", label: "Uplifting", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "tension", label: "Suspense", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_d1718ab41b.mp3" },
  { id: "sad", label: "Melancholy", url: "https://cdn.pixabay.com/audio/2022/10/18/audio_31a1f6f2a6.mp3" },
  { id: "action", label: "Action", url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" },
];
const LANGS = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Dutch", "Polish", "Russian", "Arabic", "Hindi", "Mandarin Chinese", "Japanese", "Korean", "Turkish", "Greek"];
const RATIOS = { "16:9": [16, 9], "9:16": [9, 16], "1:1": [1, 1], "21:9": [21, 9] };


// Library track: if it will not load (blocked or offline), a soft built-in music bed is used so there is always music under the voice.
async function bedBlob() {
  const sr = 22050, oc = new OfflineAudioContext(2, sr * 32, sr);
  const b = msBedSource(oc, oc.destination, 0.5); b.src.loop = false; b.src.start(0);
  const buf = await oc.startRendering(); const n = buf.length, out = new DataView(new ArrayBuffer(44 + n * 4));
  const w = (o, t) => { for (let k = 0; k < t.length; k++) out.setUint8(o + k, t.charCodeAt(k)); };
  w(0, "RIFF"); out.setUint32(4, 36 + n * 4, true); w(8, "WAVEfmt "); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, sr, true); out.setUint32(28, sr * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); w(36, "data"); out.setUint32(40, n * 4, true);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  for (let k = 0; k < n; k++) { out.setInt16(44 + k * 4, Math.max(-1, Math.min(1, L[k])) * 32767, true); out.setInt16(46 + k * 4, Math.max(-1, Math.min(1, R[k])) * 32767, true); }
  return new Blob([out], { type: "audio/wav" });
}
async function libraryMusic(url) {
  try { const r = await fetch(url); if (r.ok) { const b = await r.blob(); if (b.size > 20000) return URL.createObjectURL(b); } } catch (e) { }
  try { return URL.createObjectURL(await bedBlob()); } catch (e) { return url; }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fmt = (t) => { t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s; };
const load = (k, d) => { try { const v = localStorage.getItem("mfs_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem("mfs_" + k, JSON.stringify(v)); } catch (e) { } };
const readAsDataURL = (blob) => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => res(""); r.readAsDataURL(blob); });

// ── IndexedDB: every finished scene is kept, so a render is never lost ──
const DBN = "mfs_db";
const idb = () => new Promise((res, rej) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = e => e.target.result.createObjectStore("f", { keyPath: "id" }); r.onsuccess = e => res(e.target.result); r.onerror = rej; });
async function dbPut(id, blob, meta) { try { const db = await idb(); const tx = db.transaction("f", "readwrite"); tx.objectStore("f").put({ id, blob, meta: meta || {} }); await new Promise(r => { tx.oncomplete = r; tx.onerror = r; }); } catch (e) { } }
async function dbAll() { try { const db = await idb(); return await new Promise(res => { const q = db.transaction("f").objectStore("f").getAll(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); }); } catch (e) { return []; } }
async function dbClear(prefix) { try { const all = await dbAll(); const db = await idb(); const tx = db.transaction("f", "readwrite"); for (const x of all) if (String(x.id).startsWith(prefix)) tx.objectStore("f").delete(x.id); await new Promise(r => { tx.oncomplete = r; tx.onerror = r; }); } catch (e) { } }

// ── MandaStrong Engine (video / music / image) ──
// A throttled request is NOT a failure and NOT "out of credit": wait out the limit and send it again by itself.
async function se(body) {
  for (let a = 0; a < 14; a++) {
    const r = await fetch(SE, { method: "POST", headers: await engineAuthHeaders(), body: JSON.stringify(body) });
    let j = null; try { j = await r.json(); } catch (e) { j = { error: "The engine sent a bad reply" }; }
    const msg = String((j && j.error) || "");
    if ((r.status === 429 || /throttl|rate limit/i.test(msg)) && a < 13) { const m = msg.match(/resets in ~?(\d+)\s*s/i); await sleep(((m ? Number(m[1]) : 10) + 2) * 1000); continue; }
    return j;
  }
}
async function seRun(body, maxMin) {
  const s = await se(body);
  if (s.error) { const e = new Error(s.error); e.nocredit = !!s.nocredit || (/credit/i.test(s.error) && !/throttl|rate limit/i.test(s.error)); throw e; }
  if (s.url) return s.url;
  if (!s.id) throw new Error("The engine did not start the job");
  const end = Date.now() + (maxMin || 12) * 60000;
  while (Date.now() < end) {
    await sleep(4000);
    let p = null; try { p = await se({ id: s.id }); } catch (e) { continue; }
    if (p && p.url) return p.url;
    if (p && (p.status === "failed" || p.status === "canceled")) throw new Error(p.error || "The engine could not make this scene");
  }
  throw new Error("The engine took too long");
}
async function toBlob(url) { const r = await fetch(url); if (!r.ok) throw new Error("Download failed"); return r.blob(); }

function pickMime(audio) {
  const list = audio ? ["video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"] : ["video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  for (const m of list) { try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m; } catch (e) { } }
  return "";
}
function sizeFor(ratio, quality) {
  const AR = RATIOS[ratio] || [16, 9]; const base = quality === "720p" ? 1280 : 1920; let W, H;
  if (AR[0] >= AR[1]) { W = base; H = Math.round(base * AR[1] / AR[0]); } else { H = base; W = Math.round(base * AR[0] / AR[1]); }
  return [Math.round(W / 2) * 2, Math.round(H / 2) * 2];
}
// Records a moving picture from a still: slow push-in and drift (used for photos and as a backup).
const isStill = s => /image|photo|still/.test((s && s.source) || "");
// Shots that carry their own sound (your clips, and engine video) are never muted. Stills and lip-sync shots stay silent so voices are not doubled.
const hasSound = s => !!s && /^(your clip|engine)$/.test(String(s.source || ""));
// Takes a picture (a frame) out of one of YOUR clips, so the engine's new shots keep your characters and look.
async function grabFrame(blob, frac) {
  return new Promise((resolve) => {
    try {
      const v = document.createElement("video"); const u = URL.createObjectURL(blob); v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = u;
      const fin = (d) => { try { URL.revokeObjectURL(u); } catch (e) { } resolve(d); };
      const to = setTimeout(() => fin(""), 6000);
      v.onloadedmetadata = () => { try { v.currentTime = Math.max(0.1, (v.duration || 4) * frac); } catch (e) { clearTimeout(to); fin(""); } };
      v.onseeked = () => { try { const c = document.createElement("canvas"); const k = Math.min(1, 1024 / Math.max(v.videoWidth || 1024, v.videoHeight || 576)); c.width = Math.max(2, Math.round((v.videoWidth || 1024) * k)); c.height = Math.max(2, Math.round((v.videoHeight || 576) * k)); { const gw = v.videoWidth || 1024, gh = v.videoHeight || 576; c.getContext("2d").drawImage(v, gw * 0.08, gh * 0.08, gw * 0.84, gh * 0.84, 0, 0, c.width, c.height); } clearTimeout(to); fin(c.toDataURL("image/jpeg", 0.85)); } catch (e) { clearTimeout(to); fin(""); } };
      v.onerror = () => { clearTimeout(to); fin(""); };
    } catch (e) { resolve(""); }
  });
}
async function stillToClip(src, secs, idx) {
  return new Promise((resolve) => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const W = 1280, H = 720, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
        const mime = pickMime(false); const stream = cv.captureStream(24);
        const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4000000 } : {});
        const ch = []; rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); };
        rec.onstop = () => resolve(ch.length ? new Blob(ch, { type: (mime || "video/webm").split(";")[0] }) : null);
        const iw = img.naturalWidth || W, ih = img.naturalHeight || H, cover = Math.max(W / iw, H / ih), dir = idx % 2 ? -1 : 1, hold = Math.max(3, secs) * 1000, t0 = Date.now();
        rec.start(250);
        const step = () => {
          const el = Date.now() - t0, t = Math.min(1, el / hold), z = cover * (1.04 + 0.1 * t), dw = iw * z, dh = ih * z;
          ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); ctx.drawImage(img, (W - dw) / 2 - dir * W * 0.03 * t, (H - dh) / 2, dw, dh);
          if (el >= hold) { try { rec.stop(); } catch (e) { resolve(null); } return; }
          setTimeout(step, 40);
        };
        step();
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
async function shrinkPhoto(dataUrl, max) {
  return new Promise(res => { const i = new Image(); i.onload = () => { const s = Math.min(1, (max || 1024) / Math.max(i.width, i.height)); const c = document.createElement("canvas"); c.width = Math.round(i.width * s); c.height = Math.round(i.height * s); c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", 0.85)); }; i.onerror = () => res(dataUrl); i.src = dataUrl; });
}
function splitCaptions(text, total) {
  const sents = (String(text || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean);
  const chars = sents.reduce((a, s) => a + s.length, 0) || 1; let t = 0;
  return sents.map(s => { const d = total * s.length / chars; const c = { start: t, end: t + d, text: s }; t += d; return c; });
}
// Reads "SCENE 1 / SCENE 2 ..." blocks exactly as pasted. No AI needed.
function parseScenes(text) {
  const t = String(text || ""); const re = /^\s*SCENE\s+(\d+)\s*[:.\-—]?\s*(.*)$/gim; const marks = []; let m;
  while ((m = re.exec(t))) marks.push({ n: Number(m[1]), at: m.index, head: m[2] || "", end: re.lastIndex });
  if (marks.length < 2) return [];
  return marks.map((mk, k) => { const body = t.slice(mk.end, k + 1 < marks.length ? marks[k + 1].at : t.length).trim(); const txt = (mk.head + " " + body).replace(/\s+/g, " ").trim(); return txt; }).filter(Boolean);
}
const STOP = new Set("a an the and or of in on at to for with from by into onto over under above below beside behind between through across along around toward towards as is are was were be been being it its this that these those their his her them they he she we you your our one two each every all some any no not only just very slow slowly fast camera shot shots frame framing push pull dolly track tracking pan tilt crane static locked off wide close up close-up macro aerial lens light lit lighting grade graded warm cold cool gold golden amber blue teal orange black white sepia grain film cinematic documentary photorealistic shallow depth field bokeh soft deep heavy single continuous composed divided vertically centre center left right half halves interior exterior scene still stillness quiet gentle long held beat feels necessary hopeful serious respectful tender comic deadpan dust haze flare highlights glow glowing screen".split(" "));
function stockQuery(text) {
  const words = String(text || "").toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));
  return words.slice(0, 4).join(" ") || "landscape";
}

function wrapText(ctx, text, maxW) { const words = String(text).split(" "); const lines = []; let cur = ""; for (const w of words) { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; } if (cur) lines.push(cur); return lines; }

const CSS = `
:root{--bg:#0E0F12;--panel:#121419;--line:#332f27;--gold:#E6C98E;--text:#F3EDE2;--dim:#B0A797}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--text);font-family:"Inter",system-ui,sans-serif}
.mfs{max-width:1000px;margin:0 auto;padding:24px max(16px,env(safe-area-inset-left)) 80px max(16px,env(safe-area-inset-right))}
.brand{font-family:"Inter",system-ui,sans-serif;color:#f3ede2;font-weight:800;letter-spacing:.01em;line-height:1.1}.hero h2,.len,.ta{font-family:"Inter",system-ui,sans-serif!important}.hero h2{font-weight:800!important;letter-spacing:-.025em}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:12px}
.eng{font-size:11px;letter-spacing:.14em;color:var(--gold)}
.mfs{background:radial-gradient(ellipse at 50% -8%,rgba(230,201,142,.14),transparent 58%),radial-gradient(ellipse at 8% 42%,rgba(58,78,96,.08),transparent 48%)}.hero h2{font-size:clamp(48px,9vw,86px)!important;background:linear-gradient(90deg,#fff3c9,#E6C98E,#b98a3e,#E6C98E,#fff3c9);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:sheen 7s linear infinite;filter:drop-shadow(0 0 22px rgba(230,201,142,.28))}@keyframes sheen{to{background-position:220% 0}}.hero p{font-size:16px!important;max-width:560px!important}.len{margin-top:16px;border:1px solid var(--line);border-radius:6px;padding:14px 16px;background:linear-gradient(160deg,#15130d,#0e0f13)}.lenTop{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;letter-spacing:.1em;color:var(--gold)}.lenTop b{font-size:24px;letter-spacing:.02em;color:#fff3c9}.ticks{display:flex;justify-content:space-between;font-size:10px;color:var(--dim);margin-top:2px}.go{background:linear-gradient(180deg,#f3dba3,#E6C98E 55%,#c9a45c)!important;box-shadow:0 0 30px rgba(230,201,142,.28);transition:transform .15s,box-shadow .15s}.go:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 44px rgba(230,201,142,.42)}.op{box-shadow:0 0 0 3px rgba(230,201,142,.12),0 0 34px rgba(230,201,142,.14)!important}.sug{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}.sug span{font-size:11px;letter-spacing:.1em;color:var(--dim)}.sug .c{font-size:12px;padding:6px 10px}.hero{text-align:center;margin:26px 0 6px}.hero h2{font-family:'Inter',sans-serif;font-weight:800;letter-spacing:-.025em;color:var(--gold);font-size:clamp(34px,6vw,52px);margin:0;line-height:1.1}.hero p{color:var(--dim);margin:8px auto 0;max-width:620px;font-size:15px}.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:18px 0 6px}.stp{position:relative;background:linear-gradient(160deg,#17140d,#0f1014);border:1px solid var(--gold);border-radius:6px;padding:18px 14px 14px;box-shadow:0 0 22px rgba(230,201,142,.08)}.stp b.n{position:absolute;top:-14px;left:14px;width:28px;height:28px;border-radius:50%;background:var(--gold);color:#000;display:flex;align-items:center;justify-content:center;font-size:15px}.stp h3{margin:2px 0 6px;font-size:15px;letter-spacing:.06em;color:var(--gold)}.stp span{font-size:13px;color:var(--text);line-height:1.5}.gets{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0 4px}.gets i{font-style:normal;font-size:12px;letter-spacing:.06em;border:1px solid var(--line);border-radius:20px;padding:5px 12px;color:var(--gold);background:#12141a}.op{border:2px solid var(--gold)!important;min-height:200px!important;box-shadow:0 0 0 3px rgba(230,201,142,.12)}.guide{border:1px solid var(--line);border-radius:3px;padding:12px;margin-top:8px;background:var(--panel);font-family:Georgia,serif;font-size:14px;line-height:1.55;white-space:pre-wrap}.lab{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--gold);margin:22px 0 8px}
.ta{width:100%;background:rgba(18,20,25,.94);border:1px solid var(--line);border-radius:4px;color:var(--text);padding:14px;font-family:"Inter",system-ui,sans-serif;font-size:15px;line-height:1.6;resize:vertical;min-height:126px;transition:border-color .18s,box-shadow .18s}.ta:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(230,201,142,.12);outline:none}
.in{background:var(--panel);border:1px solid var(--line);border-radius:3px;color:var(--text);padding:11px 12px;font:inherit;font-size:14px;width:100%}
select.in{appearance:auto}
.login{display:grid;grid-template-columns:1fr 1fr auto auto;gap:8px}@media(max-width:640px){.login{grid-template-columns:1fr 1fr}}
.row{display:flex;gap:8px;flex-wrap:wrap}.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:640px){.g2,.g3{grid-template-columns:1fr}.out{grid-template-columns:1fr !important}}
.c{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:3px;padding:9px 13px;font:inherit;font-size:13px;cursor:pointer}
.c.on{background:var(--gold);color:#000;border-color:var(--gold);font-weight:700}
.b{border-radius:3px;padding:13px;font:inherit;font-size:14px;font-weight:700;letter-spacing:.05em;cursor:pointer;text-align:center;border:1px solid var(--gold);background:transparent;color:var(--gold)}
.b.g{background:var(--gold);color:#000}.b.s{border-color:var(--line);color:var(--text);font-size:13px}
.b:disabled{opacity:.45;cursor:default}
.c:focus-visible,.b:focus-visible,.in:focus-visible,.ta:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.drop{border:1px dashed rgba(230,201,142,.55);border-radius:3px;padding:20px;text-align:center;color:#B9B1A0;font-size:13px;cursor:pointer;display:block}
.drop.over{background:#1a1710}
.lbl{font-size:10px;letter-spacing:.07em;color:var(--dim);display:block;margin-bottom:4px}
.plan{border:1px solid var(--line);border-radius:3px;padding:12px;cursor:pointer;text-align:left;background:transparent;color:var(--text);font:inherit}
.plan.on{border-color:var(--gold);background:#1a1710}.plan h3{margin:0 0 4px;font-size:16px;display:flex;justify-content:space-between}
.tick{width:18px;height:18px;border:1px solid var(--gold);border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;color:#000}.plan.on .tick{background:var(--gold)}
.go{width:100%;margin-top:20px;background:var(--gold);color:#000;border:none;padding:18px;border-radius:3px;font:inherit;font-weight:800;font-size:20px;letter-spacing:.05em;cursor:pointer}
.go:disabled{background:#333;color:#888}
.pb{height:6px;border:1px solid var(--line);margin-top:6px}.pb i{display:block;height:100%;background:var(--gold);transition:width .3s}
.out{display:grid;grid-template-columns:1fr 210px;gap:12px}
.pv{position:relative;background:#000;border:1px solid var(--line);border-radius:3px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.pv video{width:100%;height:100%;object-fit:contain;background:#000}
.cap{position:absolute;bottom:6%;left:5%;right:5%;text-align:center;color:#fff;font-size:15px;text-shadow:0 1px 3px #000;pointer-events:none}
.thumbs{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.th{position:relative;width:64px;height:64px;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:#000;font-size:10px;color:var(--dim);display:flex;align-items:center;justify-content:center;text-align:center}
.th img,.th video{width:100%;height:100%;object-fit:cover}.th button{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:3px;background:#000c;color:#fff;cursor:pointer;font-size:11px;padding:0}
.tl{border:1px solid var(--line);border-radius:3px;padding:10px;margin-top:12px}
.sc{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}.scn{flex:0 0 120px;border:1px solid var(--line);border-radius:3px;padding:6px;font-size:11px;color:var(--dim)}
.scn.cur{border-color:var(--gold)}.scn video{width:100%;aspect-ratio:16/9;background:#000;object-fit:cover;display:block;margin-bottom:4px}
.msg{font-size:12px;color:#B9B1A0;margin-top:6px}.prow{display:flex;align-items:center;gap:12px;margin-top:8px;font-size:14px;color:#F3EDE2}.spin{flex:none;width:30px;height:30px;border-radius:50%;border:4px solid rgba(230,201,142,.2);border-top-color:#F5BC45;border-right-color:#F5BC45;box-shadow:0 0 14px rgba(245,188,69,.5);animation:mfsspin .9s linear infinite}@keyframes mfsspin{to{transform:rotate(360deg)}}.livebox{position:relative;max-width:480px;margin-top:6px;border-radius:8px;overflow:hidden;background:#000}.livebox canvas{display:block;width:100%;height:auto}.livetag{position:absolute;top:8px;left:8px;background:#C62828;color:#fff;font-weight:800;font-size:11px;letter-spacing:1px;padding:3px 8px;border-radius:5px}.err{color:#E3A08F}
.rng{width:100%;accent-color:var(--gold)}
.ovl{position:fixed;inset:0;z-index:50;background:radial-gradient(ellipse at 50% 42%,#2b2416 0%,#0E0F12 62%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;transition:opacity .6s}
.ovl .brand{font-size:clamp(56px,11vw,120px)}
@media (prefers-reduced-motion: reduce){.ovl{transition:none}.pb i{transition:none}.spin{animation-duration:2.4s}}
`;

// ── one .zip with every scene + the narration, so a film can be joined anywhere ──
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
async function makeZip(entries, onStep) {
  const parts = [], central = []; let off = 0;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]; if (onStep) onStep(i + 1, entries.length);
    const data = new Uint8Array(await e.blob.arrayBuffer()); const crc = crc32(data); const nm = new TextEncoder().encode(e.name);
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nm.length, true);
    parts.push(h.buffer, nm, new Blob([data]));
    const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
    central.push(c.buffer, nm); off += 30 + nm.length + data.length;
  }
  const csize = central.reduce((a, x) => a + (x.byteLength || x.length), 0);
  const end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true); end.setUint32(12, csize, true); end.setUint32(16, off, true);
  return new Blob([...parts, ...central, end.buffer], { type: "application/zip" });
}

export default function Studio() {
  // ── entry overlay ──

  // ── account + plan ──
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [authMsg, setAuthMsg] = useState("");
  const [plan, setPlan] = useState("studio");
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null)); const { data: sub } = supabase.auth.onAuthStateChange((ev, s) => { if (s && s.user) setUser(s.user); else if (ev === "SIGNED_OUT") setUser(null); }); return () => { try { sub.subscription.unsubscribe(); } catch (e) { } }; }, []);
  // Owner / admin (and paid Studio accounts) always get the Studio plan with everything on, no watermark.
  useEffect(() => { (async () => {
    if (!user) return;
    try {
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      const { data: sub } = await supabase.from("subscriptions").select("plan_tier,status").eq("user_id", user.id).maybeSingle();
      const tier = sub && sub.status === "active" ? sub.plan_tier : "";
      if ((role && role.role === "admin") || tier === "owner" || tier === "studio") setPlan("studio");
      if ((role && role.role === "admin") || (sub && sub.status === "active")) setSubActive(true);
    } catch (e) { }
  })(); }, [user]);
  const logIn = async () => { setAuthMsg("Logging in…"); const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw }); setAuthMsg(error ? error.message : ""); };
  const signUp = async () => { setAuthMsg("Creating your account…"); const { error } = await supabase.auth.signUp({ email: email.trim(), password: pw }); setAuthMsg(error ? error.message : "Account created. Check your email if asked to confirm, then log in."); };
  const logOut = async () => { await supabase.auth.signOut(); };
  const pay = () => { const p = PLANS.find(x => x.id === plan) || PLANS[1]; const em = (user && user.email) || email; window.open(p.link + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); };

  // ── inputs (all remembered) ──
  const [kind, setKind] = useState(() => load("kind", "Movie"));
  const [title, setTitle] = useState(() => load("title", ""));
  const [narr, setNarr] = useState(() => load("narr", ""));
  const [script, setScript] = useState(() => load("script", ""));
  // Pasted text is also kept in the device database (no size limit), so big pastes stay exactly as pasted.
  const textLoaded = useRef(false);
  useEffect(() => { (async () => { try { const all = await dbAll(); const x = all.find(y => y.id === "mfs_text" && y.blob); if (x) { const o = JSON.parse(await x.blob.text()); if (o.narr && o.narr.length > narr.length) setNarr(o.narr); if (o.script && o.script.length > script.length) setScript(o.script); if (o.title && !title) setTitle(o.title); } } catch (e) { } textLoaded.current = true; })(); }, []);
  useEffect(() => { if (!textLoaded.current) return; const t = setTimeout(() => dbPut("mfs_text", new Blob([JSON.stringify({ narr, script, title })], { type: "application/json" }), {}), 400); return () => clearTimeout(t); }, [narr, script, title]);
  const [voiceMode, setVoiceMode] = useState(() => load("voiceMode", "engine")); // engine | mine
  const [narrator, setNarrator] = useState(() => load("narrator", "james"));
  const [charVoices, setCharVoices] = useState(() => load("charVoices", true));
  const [lipSync, setLipSync] = useState(() => load("lipSync", false));
  const [speed, setSpeed] = useState(() => load("speed", 1));
  const [spoken, setSpoken] = useState(() => load("spoken", "English"));
  const [subs, setSubs] = useState(() => load("subs", true));
  const [dubs, setDubs] = useState(() => load("dubs", []));
  const [musicMode, setMusicMode] = useState(() => load("musicMode", "library")); // library | make | mine | off
  const [mood, setMood] = useState(() => load("mood", "ambient"));
  const [musicPrompt, setMusicPrompt] = useState(() => load("musicPrompt", ""));
  const [style, setStyle] = useState(() => load("style", "Cinematic"));
  const [genre, setGenre] = useState(() => load("genre", ""));
  const [audience, setAudience] = useState(() => load("audience", ""));
  const [toon, setToon] = useState(() => load("toon", ""));
  const [camera, setCamera] = useState(() => load("camera", ""));
  const [pace, setPace] = useState(() => load("pace", ""));
  const [place, setPlace] = useState(() => load("place", ""));
  const [episodes, setEpisodes] = useState(() => load("episodes", 1));
  const [mGenre, setMGenre] = useState(() => load("mGenre", ""));
  const [tempo, setTempo] = useState(() => load("tempo", ""));
  const [showMusic, setShowMusic] = useState(false);
  const [grade, setGrade] = useState(() => load("grade", "gold"));
  const [enhance, setEnhance] = useState(() => load("enhance", true));
  const [duck, setDuck] = useState(() => load("duck", true));
  const [cleanVoice, setCleanVoice] = useState(() => load("cleanVoice", true));
  const [minutes, setMinutes] = useState(() => load("minutes", 5));
  const [ratio, setRatio] = useState(() => load("ratio", "16:9"));
  const [quality, setQuality] = useState(() => load("quality", "1080p"));
  const [vVol, setVVol] = useState(() => load("vVol", 1));
  const [mVol, setMVol] = useState(() => load("mVol", 0.3));
  const [cVol, setCVol] = useState(() => load("cVol", 0.8));
  const [allRatios, setAllRatios] = useState(() => load("allRatios", false));
  const [credits, setCredits] = useState(() => load("credits", true));
  const [watermark, setWatermark] = useState(() => load("watermark", true));
  const [creditNames, setCreditNames] = useState(() => load("creditNames", ""));
  // Free mode: build every scene from YOUR images first, then free stock pictures. Uses no engine credit.
  const freeMode = false, setFreeMode = () => { }; // free mode is gone: films are made by the engine
  const [subActive, setSubActive] = useState(false);
  const trialKey = u => "mfs_trial_" + (u && u.id ? u.id : "x");
  const noCredit = useRef(false);
  const planRef = useRef([]);
  const shotMap = useRef(null);
  const engineFails = useRef(0), engineOff = useRef(false); // after 2 failed engine shots in a row the engine stops for this film, so no more credit is spent
  const lastClipRef = useRef(null), reuseN = useRef(0); // your clips are reused (never back to back) when the engine cannot make a scene
  useEffect(() => { const o = { kind, title, narr, script, voiceMode, narrator, charVoices, lipSync, speed, spoken, subs, dubs, musicMode, mood, musicPrompt, style, grade, enhance, duck, cleanVoice, minutes, ratio, quality, vVol, mVol, cVol, allRatios, credits, watermark, creditNames, plan, genre, audience, toon, camera, pace, place, episodes, mGenre, tempo }; for (const k in o) save(k, o[k]); });

  // ── files ──
  const [photos, setPhotos] = useState([]); // {name,dataUrl}
  const photosLoaded = useRef(false);
  useEffect(() => { (async () => { try { const all = await dbAll(); const x = all.find(y => y.id === "mfs_photos"); if (x && x.blob) setPhotos(JSON.parse(await x.blob.text())); } catch (e) { } photosLoaded.current = true; })(); }, []);
  useEffect(() => { if (photosLoaded.current) dbPut("mfs_photos", new Blob([JSON.stringify(photos)], { type: "application/json" }), {}); }, [photos]);
  const [clips, setClips] = useState([]);   // {name,url,blob}
  useEffect(() => { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { } }, []);
  // Your uploaded clips are kept on this device, so they are still here when you come back.
  useEffect(() => { (async () => { try { const all = await dbAll(); const mine = all.filter(x => String(x.id).startsWith("mfs_clip_") && x.blob).sort((x, y) => String(x.id).localeCompare(String(y.id))); if (mine.length) setClips(p => p.length ? p : mine.map(x => ({ name: (x.meta && x.meta.name) || "clip", url: URL.createObjectURL(x.blob), blob: x.blob, dbId: x.id }))); } catch (e) { } })(); }, []);
  const [myRec, setMyRec] = useState(null); // {name,blob,url}
  useEffect(() => { (async () => { try { const all = await dbAll(); const x = all.find(y => y.id === "mfs_myrec" && y.blob); if (x) setMyRec(p => p || { name: (x.meta && x.meta.name) || "audio", blob: x.blob, url: URL.createObjectURL(x.blob) }); } catch (e) { } })(); }, []);
  // ── CHARACTER VOICES YOU UPLOAD (e.g. Doxy, Lily, Ethan): kept on this device, one per file ──
  const [charRecs, setCharRecs] = useState([]); // {name,blob,url,dbId,cloneId}
  useEffect(() => { (async () => { try { const all = await dbAll(); const mine = all.filter(x => String(x.id).startsWith("mfs_cvoice_") && x.blob).sort((x, y) => String(x.id).localeCompare(String(y.id))); if (mine.length) setCharRecs(p => p.length ? p : mine.map(x => ({ name: (x.meta && x.meta.name) || "voice", blob: x.blob, url: URL.createObjectURL(x.blob), dbId: x.id, cloneId: (x.meta && x.meta.cloneId) || "" }))); } catch (e) { } })(); }, []);
  const addCharRecs = (files) => { Array.from(files || []).forEach((f, k) => { const nm = String(f.name || "voice").replace(/\.[a-z0-9]+$/i, ""); const did = "mfs_cvoice_" + Date.now() + "_" + String(k).padStart(3, "0"); setCharRecs(p => [...p, { name: nm, blob: f, url: URL.createObjectURL(f), dbId: did, cloneId: "" }]); dbPut(did, f, { name: nm }); }); };
  // Which uploaded voice each character uses. Read from the boxes:
  //   "DOXY'S VOICE:" heading, then "Santa: ..." lines under it   — or —   "Santa: use Doxy's saved voice"
  // A character with the same name as an uploaded voice (e.g. Lily) uses it too.
  const charVoiceMap = (speakers) => {
    const out = {}; if (!charRecs.length) return out;
    const findRec = (w) => { w = String(w || "").toLowerCase().trim(); if (!w) return null; return charRecs.find(r => r.name.toLowerCase() === w) || charRecs.find(r => r.name.toLowerCase().includes(w)) || null; };
    const norm = (x) => String(x || "").toUpperCase().replace(/\s+/g, " ").trim();
    let cur = null;
    for (const ln of String((script || "") + "\n" + (narr || "")).replace(/(\S)[ \t]+([A-Za-z]+['’]S VOICE\s*:)/gi, "$1\n$2").split(/\r?\n/)) {
      const t = ln.trim(); if (!t) { continue; }
      const h = t.match(/^([A-Za-z][A-Za-z .'-]{0,30}?)['’]S VOICE\s*:?\s*$/i); if (h) { cur = findRec(h[1]); continue; }
      // One-line form: "DOXY'S VOICE: Santa, Max, Mr. Thompson and Pepper."
      const h1 = t.match(/^([A-Za-z][A-Za-z .'-]{0,30}?)['’]S VOICE\s*:\s*(\S.*)$/i);
      if (h1) { const rec = findRec(h1[1]); cur = null; if (rec) h1[2].replace(/[.;]+\s*$/, "").split(/\s*(?:,|&|\band\b)\s*/i).forEach(nm => { const k = norm(nm); if (k && !out[k]) out[k] = rec; }); continue; }
      const m = t.match(/^([A-Za-z][A-Za-z0-9 .'-]{0,30}?)\s*:\s*(.*)$/); if (!m) continue;
      const u = m[2].match(/use\s+([A-Za-z][A-Za-z .'-]{0,30}?)['’]s\s+(?:saved\s+|uploaded\s+|own\s+)?voice/i);
      const r = u ? findRec(u[1]) : cur;
      if (r && !out[norm(m[1])]) out[norm(m[1])] = r;
    }
    for (const sp of speakers) { const k = norm(sp.label || sp.key); if (!out[k]) { const r = findRec(sp.label || sp.key); const lb = String(sp.label || sp.key).toLowerCase().replace(/[^a-z]/g, ""); if (r && lb && new RegExp("(^|[^a-z])" + lb + "([^a-z]|$)", "i").test(r.name)) out[k] = r; } }
    const res = {}; for (const sp of speakers) { const r = out[norm(sp.label || sp.key)]; if (r) res[sp.key] = r; } return res;
  };
  const cloneOf = async (r) => {
    if (r.cloneId && !/^mm_/.test(r.cloneId)) return r.cloneId; // an old copied-voice id from the empty account is not reused
    try { const uri = await readAsDataURL(r.blob.slice(0, 1500000, r.blob.type || "audio/mpeg")); const vid = await engineCloneVoice(uri); if (vid) { r.cloneId = vid; dbPut(r.dbId, r.blob, { name: r.name, cloneId: vid }); return vid; } } catch (e) { }
    return "";
  };
  // ── ENGINE TO COMPLETE NARRATION: your recording plays first, the engine reads the rest ──
  const [tail, setTail] = useState(null); // {blob,url,secs,text,start}
  const [comp, setComp] = useState(null); // {recSecs, sents, idx, busy, msg}
  useEffect(() => { (async () => { const all = await dbAll(); const t = all.find(x => x.id === "mfs_tail"); if (t && t.blob) setTail({ blob: t.blob, url: URL.createObjectURL(t.blob), secs: t.meta.secs || 0, text: t.meta.text || "", start: t.meta.start || "" }); })(); }, []);
  const tailEndRef = useRef(null);
  const openComplete = async () => {
    const txt = (narr || "").trim();
    if (!myRec) { setComp({ msg: "Upload or record your narration first." }); return; }
    if (!txt) { setComp({ msg: "Paste the full narration into box 2 first." }); return; }
    setComp({ msg: "Reading your recording…", busy: true });
    const recSecs = await audioSecs(myRec.blob);
    const sents = sentencesOf(txt);
    // Your pace with natural pauses: about 98 words a minute. Pick the sentence nearest where the recording stops.
    const est = recSecs * 1.63; let acc = 0, idx = sents.length;
    for (let i = 0; i < sents.length; i++) { if (acc + wordsIn(sents[i]) / 2 >= est) { idx = i; break; } acc += wordsIn(sents[i]); }
    setComp({ recSecs, sents, idx, msg: "" });
  };
  const hearEnd = () => { try { const a = tailEndRef.current || new Audio(); tailEndRef.current = a; a.src = myRec.url; a.onloadedmetadata = () => { try { a.currentTime = Math.max(0, (a.duration || comp.recSecs) - 20); a.play(); } catch (e) { } }; a.load(); } catch (e) { } };
  const makeRest = async () => {
    const rest = comp.sents.slice(comp.idx).join(" ").trim();
    if (!rest) { setComp({ ...comp, msg: "Your recording already covers the whole narration." }); return; }
    try { tailEndRef.current && tailEndRef.current.pause(); } catch (e) { }
    setComp({ ...comp, busy: true, msg: "Copying your voice…" });
    let meta = null, which = "your voice";
    try {
      const head = myRec.blob.slice(0, 1500000, myRec.blob.type || "audio/mpeg");
      const uri = await readAsDataURL(head);
      const vid = await engineCloneVoice(uri);
      if (vid) meta = { voice: vid, speed: Number(speed) || 1 };
    } catch (e) { }
    if (!meta) { meta = voiceMeta(narrator); which = "the " + ((VOICE_CHARACTERS.find(v => v.id === narrator) || {}).name || "narrator") + " voice (your voice couldn't be copied)"; }
    try {
      const r = await msVoiceText(rest, meta, (i, n) => setComp(c => ({ ...c, msg: "Engine reading the rest — part " + i + " of " + n + "…" })));
      if (!r.parts.length) throw new Error("the engine returned no audio — check it has credit");
      const blob = new Blob(r.parts, { type: r.parts[0].type || "audio/mpeg" });
      const secs = await audioSecs(blob);
      await dbPut("mfs_tail", blob, { secs, text: rest, start: comp.sents[comp.idx] });
      setTail({ blob, url: URL.createObjectURL(blob), secs, text: rest, start: comp.sents[comp.idx] });
      setVoiceMode("mine"); if (musicMode === "off") setMusicMode("library");
      if (narrUrl && myRec && narrUrl === myRec.url) { setNarrSecs(comp.recSecs + secs); setNarrText((narr || "").trim()); }
      setComp({ ...comp, busy: false, msg: "Done. Your recording plays first, then the engine finishes in " + which + "." + (r.failed ? " " + r.failed + " of " + r.total + " parts failed — press again to redo." : "") });
    } catch (e) { setComp({ ...comp, busy: false, msg: "Could not finish the narration: " + e.message }); }
  };
  const clearTail = async () => { setTail(null); try { const db = await idb(); const tx = db.transaction("f", "readwrite"); tx.objectStore("f").delete("mfs_tail"); } catch (e) { } };
  const [mySong, setMySong] = useState(null);
  const [endSong, setEndSong] = useState(null);
  const [logo, setLogo] = useState(null);   // dataUrl
  const [over, setOver] = useState(false);
  const [addMsg, setAddMsg] = useState("");
  const addFiles = async (list) => {
    const arr = Array.from(list || []); let n = 0;
    // A voice file can arrive from Drive or Files with an odd type: audio types, audio file endings,
    // or any file whose name is a voice named in your directions (e.g. "DOXY'S VOICE:") or contains "voice".
    const vNames = (() => { const out = new Set(); for (const ln of String((script || "") + "\n" + (narr || "")).split(/\r?\n/)) { const h = ln.trim().match(/^([A-Za-z][A-Za-z .'-]{0,30}?)['’]S\s+VOICE\b/i) || ln.match(/use\s+(?:my\s+)?(?:uploaded\s+)?([A-Za-z][A-Za-z .'-]{0,30}?)['’]?s?\s+(?:saved\s+|uploaded\s+|own\s+)?voice/i); if (h) out.add(h[1].trim().toLowerCase()); } return out; })();
    const base = f => String(f.name || "").replace(/\.[a-z0-9]+$/i, "").trim().toLowerCase();
    const isVisual = f => (f.type || "").startsWith("image") || (f.type || "").startsWith("video") || /\.(jpe?g|png|webp|heic|heif|gif|mp4|mov|m4v|webm)$/i.test(f.name || "");
    const speakerNames = new Set((String(narr || "").match(/^\[[^\]]+\]/gm) || []).flatMap(x => x.slice(1, -1).split(/&|,|\band\b/i).map(y => y.trim().toLowerCase())));
    const namedVoiceVideo = f => /^video\//.test(f.type || "") || /\.(mp4|mov|m4v|webm)$/i.test(f.name || "") ? (() => { const b = base(f).replace(/[\s_-]*(\d+|copy|final|new|voice)$/i, ""); return vNames.has(b) || speakerNames.has(b); })() : false;
    const isVoice = f => namedVoiceVideo(f) || !isVisual(f) && ((f.type || "").startsWith("audio") || /\.(mp3|wav|m4a|aac|ogg|opus|flac|weba|caf|aif|aiff|amr)$/i.test(f.name || "") || /voice/i.test(f.name || "") || vNames.has(base(f).replace(/[\s_-]*(\d+|copy|final|new)$/i, "")));
    const auds = arr.filter(isVoice);
    if (auds.length) { addCharRecs(auds); n += auds.length; }
    for (const f of arr) {
      if (auds.includes(f)) continue;
      const t = f.type || ""; const nm = f.name || "file";
      if (t.startsWith("image") || /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(nm)) { const d = await readAsDataURL(f); if (d) { const s = await shrinkPhoto(d, 1280); setPhotos(p => [...p, { name: nm, dataUrl: s }]); n++; } }
      else if (t.startsWith("video") || /\.(mp4|mov|m4v|webm)$/i.test(nm)) { { const did = "mfs_clip_" + Date.now() + "_" + String(n).padStart(3, "0"); setClips(p => [...p, { name: nm, url: URL.createObjectURL(f), blob: f, dbId: did }]); dbPut(did, f, { name: nm }); } n++; }
      else if (t.startsWith("audio") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(nm)) { setMyRec({ name: nm, blob: f, url: URL.createObjectURL(f) }); dbPut("mfs_myrec", f, { name: nm }); setVoiceMode("mine"); n++; }
      else if (t.startsWith("text") || /\.(txt|md|fountain|fdx)$/i.test(nm)) { const tx = await f.text(); setScript(p => (p ? p + "\n\n" : "") + tx); n++; }
    }
    setAddMsg(n + " added");
  };
  const dropLink = async (e) => {
    let u = ""; try { u = (e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain") || "").split("\n").map(x => x.trim()).find(x => /^(https?:|blob:|data:)/i.test(x)) || ""; } catch (_) { }
    if (!u) return;
    try { const b = await toBlob(u); const ext = (b.type.split("/")[1] || "bin").split(";")[0]; await addFiles([new File([b], "dropped." + ext, { type: b.type })]); } catch (_) { setAddMsg("That page won't let the file go. Save it first, then drop it here."); }
  };

  // ── record my voice ──
  const recRef = useRef(null); const [recording, setRecording] = useState(false);
  const toggleRecord = async () => {
    if (recording) { try { recRef.current.stop(); } catch (e) { } return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(st); const ch = [];
      mr.ondataavailable = e => { if (e.data.size) ch.push(e.data); };
      mr.onstop = () => { st.getTracks().forEach(t => t.stop()); const b = new Blob(ch, { type: mr.mimeType || "audio/mp4" }); setMyRec({ name: "My recording", blob: b, url: URL.createObjectURL(b) }); setVoiceMode("mine"); setRecording(false); };
      recRef.current = mr; mr.start(); setRecording(true);
    } catch (e) { setAddMsg("The microphone isn't available here. Upload a recording instead."); }
  };

  // ── the film ──
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(""); const [pct, setPct] = useState(0); const [err, setErr] = useState("");
  const [scenes, setScenes] = useState([]); // {text,status,url,blob,source}
  const [narrUrl, setNarrUrl] = useState(""); const [narrText, setNarrText] = useState(""); const [narrSecs, setNarrSecs] = useState(0);
  const [dubTracks, setDubTracks] = useState({}); // lang -> {url,text}
  const [musicUrl, setMusicUrl] = useState("");
  const [done, setDone] = useState(false);
  const projectId = useRef(load("pid", "p" + Date.now()));
  const sceneCount = Math.max(1, Math.round(minutes * (minutes <= 10 ? 2 : 1)));
  const animKind = isAnimKind(kind) || style === "Animated";
  const epCount = isSeries(kind) ? Math.max(1, Number(episodes) || 1) : 1;
  // What the picture engine is told for every shot.
  const shotBrief = [genre && genre + " genre", animKind && toon && toon + " animation", camera && camera + " camera", pace && pace.toLowerCase() + " pacing", place && place].filter(Boolean).join(", ");
  // What the film writer is told about the whole production.
  const brief = [genre && "Genre: " + genre, audience && "Audience: " + audience, animKind && toon && "Animation style: " + toon, camera && "Camera: " + camera, pace && "Pace: " + pace.toLowerCase(), place && "Time and place: " + place, epCount > 1 && "A series of " + epCount + " episodes of about " + Math.max(1, Math.round(minutes / epCount)) + " minutes each. Give every episode its own title and end each one with a hook into the next"].filter(Boolean).join(". ");
  const castNames = (() => { try { return msParseCast(narr || msSpokenOnly(script)).speakers.length; } catch (e) { return 0; } })();
  const langCount = 1 + dubs.length;

  // Bring back scenes from a render that was stopped or a reload.
  useEffect(() => {
    (async () => {
      const all = await dbAll();
      // Find the project with the MOST finished scenes. A newer, emptier project never hides your real footage.
      const counts = {}; all.forEach(x => { const m = /^(.*)_scene_\d+$/.exec(String(x.id)); if (m && x.blob) counts[m[1]] = (counts[m[1]] || 0) + 1; });
      const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      if (best && best !== projectId.current && (counts[best] || 0) > (counts[projectId.current] || 0)) { projectId.current = best; save("pid", best); }
      const pre = projectId.current + "_scene_";
      const sc = all.filter(x => String(x.id).startsWith(pre) && x.blob).sort((a, b) => a.meta.i - b.meta.i);
      if (!sc.length) return;
      setScenes(sc.map(x => ({ text: x.meta.text || "", status: "done", blob: x.blob, url: URL.createObjectURL(x.blob), source: x.meta.source })));
      const n = all.find(x => x.id === projectId.current + "_narr"); if (n) { setNarrUrl(URL.createObjectURL(n.blob)); setNarrText(n.meta.text || ""); setNarrSecs(n.meta.secs || 0); }
      const m = all.find(x => x.id === projectId.current + "_music"); if (m) setMusicUrl(URL.createObjectURL(m.blob));
      setDone(true); setStage("Your last film was brought back.");
    })();
  }, []);

  const voiceMeta = (id) => { const v = VOICE_CHARACTERS.find(x => x.id === id) || VOICE_CHARACTERS.find(x => x.id === "james"); return { voice: v.engineVoice || v.id, gender: v.gender || "", origin: v.origin || "", speed: Number(speed) || 1 }; };

  async function voiceIt(text, lang) {
    let t = text; if (lang && lang !== "English") t = await translateText(text, lang);
    const cast = msParseCast(t); let parts = [];
    if ((charVoices || charRecs.length) && cast.speakers.length >= 2) {
      const cmap = msCastVoices(cast.speakers, narrator, t);
      const umap = charVoiceMap(cast.speakers); const uid = {};
      // Nobody has to say who uses which voice: any character without a voice yet gets one of YOUR uploaded voices automatically (unused voices first).
      if (charRecs.length) { const usedR = new Set(Object.values(umap)); let rr = 0; for (const sp of cast.speakers) { if (umap[sp.key]) continue; const free_ = charRecs.filter(r => !usedR.has(r)); const pick = free_.length ? free_[0] : charRecs[rr++ % charRecs.length]; umap[sp.key] = pick; usedR.add(pick); } }
      for (const k of Object.keys(umap)) { setStage("Copying " + umap[k].name + "'s voice for " + ((cast.speakers.find(x => x.key === k) || {}).label || k) + "…"); uid[k] = await cloneOf(umap[k]); }
      // Your voices are never swapped for a stock voice without telling you: stop and say which character failed.
      if (charRecs.length) {
        const lab = k => (cast.speakers.find(x => x.key === k) || {}).label || k;
        for (const k of Object.keys(umap)) { if (!uid[k]) { uid[k] = await cloneOf(umap[k]); } }
        const noClone = Object.keys(umap).filter(k => !uid[k]).map(lab);
        if (noClone.length) throw Object.assign(new Error("Stopped before spending credit: your voice file could not be copied for " + noClone.join(", ") + ". Check the engine has credit and the file plays, then press Make again."), { stopFilm: true });
        const noVoice = cast.speakers.filter(sp => !umap[sp.key]).map(sp => sp.label || sp.key);
        if (noVoice.length) throw Object.assign(new Error("Stopped before spending credit: no uploaded voice is matched to " + noVoice.join(", ") + ". Name each voice file after its character (Doxy, Lily, Ethan) and list who uses it, like DOXY'S VOICE: Santa, Max."), { stopFilm: true });
      }
      for (let i = 0; i < cast.segments.length; i++) {
        const sg = cast.segments[i]; const vc = sg.sp ? cmap[sg.sp] : null;
        setStage("Voicing " + (sg.sp ? (cast.speakers.find(x => x.key === sg.sp) || {}).label : "narrator") + " — " + (i + 1) + " of " + cast.segments.length);
        const meta = (sg.sp && uid[sg.sp]) ? { voice: uid[sg.sp], speed: Number(speed) || 1 } : vc ? { voice: vc.engineVoice || vc.id, gender: vc.gender || "", origin: vc.origin || "", speed: Number(speed) || 1 } : voiceMeta(narrator);
        const r = await msVoiceText(sg.text, { ...meta, language: lang && lang !== "English" ? lang : "" }); parts.push(...r.parts);
      }
    } else {
      const r = await msVoiceText(t, { ...voiceMeta(narrator), language: lang && lang !== "English" ? lang : "" }, (i, n) => setStage("MandaStrong Engine — voicing part " + i + " of " + n + (lang && lang !== "English" ? " (" + lang + ")" : ""))); parts = r.parts;
    }
    if (!parts.length) throw new Error("The voice engine returned no audio");
    return { blob: new Blob(parts, { type: parts[0].type || "audio/mpeg" }), text: t };
  }

  // Turns a picture (your photo or a stock photo) into a moving shot.
  async function stockScene(plan, i, text, allowStock) {
    if (plan && plan.photo >= 0 && photos[plan.photo]) { const b = await stillToClip(photos[plan.photo].dataUrl, 7, i); if (b) return { blob: b, source: "your image" }; }
    // stock only when Free mode is on — never otherwise
    if (!allowStock) return null;
    // after a reload the scene plan is gone, so the scene's own words are used for the search
    const q = (plan && plan.query) || stockQuery(text) || "cinematic landscape";
    try {
      const st = await se({ kind: "stock", query: q });
      if (st && st.url) {
        if (st.type === "video") { const b = await toBlob(st.url); if (b && b.size > 10000) return { blob: b, source: "stock video" }; }
        else { const b = await stillToClip(st.url, 7, i); if (b) return { blob: b, source: "stock photo" }; }
      }
    } catch (e) { }
    return null;
  }

  async function makeScene(i, text, list) {
    const look = style + " style, " + (GRADES.find(g => g.id === grade) || GRADES[0]).prompt + (enhance ? (animKind ? ", crisp clean linework, rich colour, sharp detail" : ", photorealistic, 35mm film grain, sharp detail") : "") + (shotBrief ? ", " + shotBrief : "") + ", no on-screen text";
    const plan = planRef.current[i] || null;
    const photo = plan && plan.photo >= 0 && photos[plan.photo] ? photos[plan.photo].dataUrl : "";
    const setS = (patch) => setScenes(p => p.map((s, k) => k === i ? { ...s, ...patch } : s));
    setS({ status: "making" });
    let blob = null, source = "engine", note = "";
    // A clip named with a scene number (e.g. "Scene_17.mp4") goes on that scene; unnumbered clips fill scenes in order.
    // Every clip is used: a clip whose name ends in a scene number (1..number of scenes) goes on that scene;
    // all the other clips (IMG_4567, 45_minute_movie…) fill the remaining scenes in the order you added them.
    const total = (list && list.length) || Math.max(sceneCount, clips.length);
    const numOf = c => { const mm = String(c.name || "").replace(/\.[a-z0-9]+$/i, "").match(/(?:scene|sc|clip|part)?[\s_-]*0*(\d{1,3})\s*$/i); const k = mm ? Number(mm[1]) : 0; return k >= 1 && k <= total ? k : 0; };
    const byNum = clips.find(c => numOf(c) === i + 1);
    const taken = new Set(clips.map(numOf).filter(Boolean));
    const free_ = clips.filter(c => !numOf(c));
    const openSlots = []; for (let k = 1; k <= total; k++) if (!taken.has(k)) openSlots.push(k);
    const slot = openSlots.indexOf(i + 1);
    const ca = planRef.current && planRef.current.clipAssign;
    const cl = ca ? (ca[i] >= 0 ? clips[ca[i]] : null) : (byNum || (slot >= 0 && slot < free_.length ? free_[slot] : null));
    if (cl) { blob = cl.blob; source = "your clip"; lastClipRef.current = cl; }
    const free = () => freeMode || noCredit.current;
    // Footage order: your clip first, then the engine makes moving footage (your matched image is its starting picture),
    // and only if the engine cannot deliver (or Free mode is on) your image as a still. Stock only when Free mode is on.
    if (!blob && !free() && i === 0 && lipSync && photo && list.firstVoice) {
      try { const r = await fetch(LIPSYNC, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: photo, audio: list.firstVoice }) }); const d = await r.json(); if (d.video) { blob = await toBlob(d.video); source = "lip sync"; } else note = d.error || ""; } catch (e) { }
    }
    // No matched picture? Take a frame out of one of YOUR clips (a different clip and moment each time) so the engine keeps your look.
    let grab = "";
    if (!blob && clips.length && !photo) { const gc = clips[(i + reuseN.current) % clips.length]; if (gc && gc.blob) grab = await grabFrame(gc.blob, 0.25 + ((i * 37) % 50) / 100); }
    if (!blob && !free()) { try { blob = await toBlob(await seRun({ kind: "video", prompt: text + "\n" + look, image: photo || grab })); engineFails.current = 0; } catch (e) { note = e.message; if (e.nocredit) { noCredit.current = true; setStage("Engine is out of credit — using your own clips and images."); } } }
    // Replicate/stock finished or failed: the engine makes its own moving shot from a frame of YOUR clip or image (same look), before anything else.
    const stretchSrc = photo || (photos.length ? photos[i % photos.length].dataUrl : "") || grab;
    if (!blob && stretchSrc) { try { const b = await stillToClip(stretchSrc, 7, i); if (b) { blob = b; source = "engine still from your footage"; } } catch (e) { } }
    if (!blob && !free()) { try { const im = await seRun({ kind: "image", prompt: text + "\n" + look, aspect_ratio: ratio }, 4); blob = await stillToClip(im, 6, i); source = "engine still"; } catch (e) { if (e.nocredit) noCredit.current = true; } }
    if (!blob) { const r2 = await stockScene(plan, i, text, freeMode); if (r2) { blob = r2.blob; source = r2.source; } }
    if (!blob) { setS({ status: "failed", note: note || "No picture came back" }); return null; }
    await dbPut(projectId.current + "_scene_" + i, blob, { i, text, source });
    setS({ status: "done", blob, url: URL.createObjectURL(blob), source, note });
    return blob;
  }

  // Matches each scene to one of YOUR images (by looking at them), and writes a stock search for the rest.
  async function planScenes(list) {
    const n = list.length;
    let plan = list.map(t => ({ photo: -1, query: "" }));
    try {
      const pics = photos.slice(0, 40);
      const thumbs = [];
      // Your clips too: one small frame from each, so the engine can put every clip on the scene it fits.
      const cthumbs = [];
      for (const c of clips.slice(0, 40)) { let d = ""; try { d = c.blob ? await grabFrame(c.blob, 0.4) : ""; } catch (e) { } cthumbs.push(d ? (await shrinkPhoto(d, 320)).split(",")[1] || "" : ""); }
      for (const p of pics) { const t = await shrinkPhoto(p.dataUrl, 320); thumbs.push(t.split(",")[1] || ""); }
      const content = [];
      thumbs.forEach((d, k) => { content.push({ type: "text", text: "IMAGE " + k + ":" }); content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: d } }); });
      cthumbs.forEach((d, k) => { if (d) { content.push({ type: "text", text: "CLIP " + k + ":" }); content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: d } }); } });
      content.push({ type: "text", text: "Here are " + n + " film scenes in order:\n" + list.map((t, k) => (k + 1) + ". " + t).join("\n") + "\n\nFor EACH scene: if one of the images above clearly shows what the scene describes, give its IMAGE number, otherwise -1. Also, if one of the CLIPs clearly shows the scene, give its CLIP number as \"clip\", otherwise -1; use each CLIP for only one scene. An image may be used for more than one scene only if it truly fits. Also give a short 2 to 5 word stock-photo search for the scene's main subject (real things, places, people or objects; no style words).\nReturn ONLY a JSON array of " + n + " objects like {\"photo\":-1,\"clip\":-1,\"query\":\"cave paintings\"}." });
      const d = await proxyFetch({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages: [{ role: "user", content }] });
      const raw = (d && d.content ? d.content.filter(x => x.type === "text").map(x => x.text).join("") : "").replace(/```json|```/g, "");
      const arr = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1));
      plan = list.map((t, k) => { const a = arr[k] || {}; const ph = Number.isInteger(a.photo) && a.photo >= 0 && a.photo < pics.length ? a.photo : -1; const cp = Number.isInteger(a.clip) && a.clip >= 0 && a.clip < clips.length ? a.clip : -1; return { photo: ph, clip: cp, query: String(a.query || "").slice(0, 80) || t.split(/\s+/).slice(0, 4).join(" ") }; });
    } catch (e) { plan = list.map(t => ({ photo: -1, query: stockQuery(t) })); }
    // Your own images named with a scene number (e.g. "Scene 12.jpg", "12.png") always go on that scene.
    photos.forEach((p, k) => { const mm = String(p.name || "").match(/(?:scene|sc|clip)?[\s_-]*0*(\d{1,3})(?=\D*$)/i); if (mm) { const q = Number(mm[1]); const idx = shotMap.current ? (q >= 1 && q <= shotMap.current.origN ? shotMap.current.first[q - 1] : -1) : q - 1; if (idx >= 0 && idx < plan.length) plan[idx].photo = k; } });
    // Every image you gave is used: any image no scene was matched to fills the scenes that still have none, in file-name order, whatever order you uploaded them.
    { const usedP = new Set(plan.map(x => x.photo).filter(x => x >= 0)); const lp = photos.map((p, k) => k).filter(k => !usedP.has(k)).sort((x, y) => String(photos[x].name || "").localeCompare(String(photos[y].name || ""), undefined, { numeric: true })); let pi = 0; const fi = shotMap.current ? shotMap.current.first : plan.map((x, k) => k); for (const i of fi) { if (pi >= lp.length) break; if (plan[i].photo < 0) plan[i].photo = lp[pi++]; } if (shotMap.current) { let par = -1; plan.forEach((x, i) => { if (fi.includes(i)) par = i; else if (par >= 0 && x.photo < 0) x.photo = plan[par].photo; }); } }
    // CLIP ORDER: clips named with a scene number go there; then the clip each scene was matched to; then every leftover clip
    // fills the remaining scenes in the order you added them. Each clip is used once, whatever order you picked them in.
    const assign = new Array(n).fill(-1), usedC = new Set();
    const sm = shotMap.current, O = sm ? sm.origN : n, idxOf = q => (sm ? sm.first[q - 1] : q - 1), firstIdx = sm ? sm.first : plan.map((x, k) => k);
    const numOfC = c => { const mm = String(c.name || "").replace(/\.[a-z0-9]+$/i, "").match(/(?:scene|sc|clip|part)?[\s_-]*0*(\d{1,3})\s*$/i); const k = mm ? Number(mm[1]) : 0; return k >= 1 && k <= O ? k : 0; };
    clips.forEach((c, k) => { const q = numOfC(c); if (q && assign[idxOf(q)] < 0) { assign[idxOf(q)] = k; usedC.add(k); } });
    plan.forEach((pl, i) => { if (assign[i] < 0 && pl.clip >= 0 && !usedC.has(pl.clip)) { assign[i] = pl.clip; usedC.add(pl.clip); } });
    const nat = (x, y) => String((clips[x] || {}).name || "").localeCompare(String((clips[y] || {}).name || ""), undefined, { numeric: true });
    const left = clips.map((c, k) => k).filter(k => !usedC.has(k)).sort(nat); let li = 0;
    for (const i of firstIdx) { if (li >= left.length) break; if (assign[i] < 0) assign[i] = left[li++]; }
    plan.clipAssign = assign;
    planRef.current = plan;
    return plan;
  }

  // ONE PROMPT: one box → title, length, spoken lines (Box 2) and directions/voices (Box 3). Nothing is changed in your files or voices.
  const [showGuide, setShowGuide] = useState(false);
  const [gd, setGd] = useState({ title: "", len: "", genre: "", audience: "", anim: "", camera: "", pace: "", music: "", idea: "", chars: "", setting: "" });
  const gset = k => e => { const v = e.target.value; setGd(p => ({ ...p, [k]: v })); };
  // The guide writes the prompt box for you. Make my movie then reads the box and fills in Advanced by itself.
  const writeFromGuide = () => {
    const L = []; if (gd.title.trim()) L.push("Title: " + gd.title.trim()); if (Number(gd.len) >= 1) L.push("Length: " + Number(gd.len) + " min");
    [["Genre", gd.genre], ["Audience", gd.audience], ["Animation", gd.anim], ["Camera", gd.camera], ["Pace", gd.pace], ["Music style", gd.music]].forEach(([k, v]) => { if (v) L.push(k + ": " + v); });
    const para = [gd.idea.trim(), gd.chars.trim() ? "Characters: " + gd.chars.trim() : "", gd.setting.trim() ? "Setting and look: " + gd.setting.trim() : ""].filter(Boolean).join("\n");
    setOnePrompt([...L, para].filter(Boolean).join("\n")); setShowGuide(false);
  };
  const [showLogin, setShowLogin] = useState(false);
  const [showFiles, setShowFiles] = useState(true);
  const [simple, setSimple] = useState(() => load("simple", true)); // one-box view: one prompt, your files, one button
  useEffect(() => { try { localStorage.setItem("mfs_simple", JSON.stringify(simple)); } catch (e) { } }, [simple]);
  const fixEnc = t => { try { return ((String(t).match(/%(?:20|0A|5B|5D|27)/gi) || []).length >= 3) ? decodeURIComponent(String(t).replace(/\+/g, " ")) : t; } catch (e) { try { return String(t).replace(/%0A/gi, "\n").replace(/%20/g, " ").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%27/g, "'"); } catch (e2) { return t; } } };
  const [onePrompt, setOnePrompt] = useState(""); const [autoMake, setAutoMake] = useState(false);
  // The one prompt box is kept on the device too, at any size, exactly as pasted.
  const promptLoaded = useRef(false);
  useEffect(() => { (async () => { try { const all = await dbAll(); const x = all.find(y => y.id === "mfs_oneprompt" && y.blob); if (x) { const tx = await x.blob.text(); setOnePrompt(p => p || fixEnc(tx)); } } catch (e) { } promptLoaded.current = true; })(); }, []);
  useEffect(() => { if (!promptLoaded.current) return; const t = setTimeout(() => dbPut("mfs_oneprompt", new Blob([onePrompt || ""], { type: "text/plain" }), {}), 400); return () => clearTimeout(t); }, [onePrompt]);
  function splitPrompt() {
    const sp = [], dr = [], vo = [], opt = {}; let t = "", len = 0;
    fixEnc(String(onePrompt || "")).split(/\r?\n/).forEach(raw => {
      const l = raw.trim(); if (!l) { if (dr.length && dr[dr.length - 1] !== "") dr.push(""); return; }
      let m;
      if ((m = l.match(/^title\s*:\s*(.+)/i))) t = m[1].trim();
      else if ((m = l.match(/^(?:length|runtime|duration)\s*:\s*(\d+)\s*(hr|hour|h|min|m)?/i))) { const n = Number(m[1]); len = /^h/i.test(m[2] || "") ? n * 60 : n; }
      else if (/^\[[^\]]+\]/.test(l)) sp.push(l);
      else if ((m = l.match(/^(genre|audience|animation|camera|pace|place|grade|mood|tempo|ratio|quality|music style)\s*:\s*(.+)$/i))) opt[m[1].toLowerCase()] = m[2].trim();
      else dr.push(l);
    });
    if (t) setTitle(t);
    // SETTINGS lines in the prompt choose the Advanced options (the closest listed choice wins).
    const pick = (items, v) => { const x = String(v || "").toLowerCase().replace(/[^a-z0-9]/g, ""); if (!x) return ""; return items.find(i => String(i).toLowerCase().replace(/[^a-z0-9]/g, "") === x) || items.find(i => { const y = String(i).toLowerCase().replace(/[^a-z0-9]/g, ""); return y.includes(x) || x.includes(y); }) || ""; };
    { let v;
      if ((v = pick(GENRES, opt.genre))) setGenre(v);
      if ((v = pick(AUDIENCES, opt.audience))) setAudience(v);
      if ((v = pick(TOONS, opt.animation))) setToon(v);
      if ((v = pick(CAMERAS, opt.camera))) setCamera(v);
      if ((v = pick(PACES, opt.pace))) setPace(v);
      if (opt.place) setPlace(opt.place);
      if (opt.grade) { const g = GRADES.find(g => pick([g.id, g.label], opt.grade)); if (g) setGrade(g.id); }
      if (opt.mood) { const md = MOODS.find(md => pick([md.id, md.label], opt.mood)); if (md) { setMood(md.id); } }
      if ((v = pick(MUSIC_GENRES, opt["music style"]))) setMGenre(v);
      if ((v = pick(TEMPOS, opt.tempo))) setTempo(v);
      if (opt.ratio && RATIOS[opt.ratio.replace(/\s/g, "")]) setRatio(opt.ratio.replace(/\s/g, ""));
      if (/^(720p|1080p)$/i.test(opt.quality || "")) setQuality(opt.quality.toLowerCase());
    }
    if (/\b(animated|animation|pixar|cartoon)\b/i.test(onePrompt)) { setKind("Animation"); setStyle("Animated"); }
    if (simple) { setCharVoices(true); setVoiceMode("engine"); if (musicMode === "off") setMusicMode("library"); }
    if (len >= 1) setMinutes(Math.min(180, len));
    setNarr(sp.join("\n")); setScript(dr.join("\n").trim());
    return sp.length;
  }
  useEffect(() => { if (autoMake && narr && !busy) { setAutoMake(false); makeMovie(); } }, [autoMake, narr, script]);
  // RE-VOICE MY FILM: makes only the voices again, with your uploaded voices, and puts them on the film you already made. No video is re-made.
  const [pendingRV, setPendingRV] = useState(false); const [rvMsg, setRvMsg] = useState("");
  async function reVoice() {
    if (busy) return;
    if (!subActive) { setErr("Re-voicing uses the engine. Subscribe to use it."); return; }
    if (!narr.trim()) { if (onePrompt.trim() && splitPrompt()) { setPendingRV(true); return; } setErr("Paste your prompt in the box first, so I have the spoken lines."); return; }
    if (!charRecs.length) { setErr("Add your voice files first (Footage & voices), named Doxy, Lily and Ethan."); return; }
    setErr(""); setBusy(true); setRvMsg("Making your voices…");
    try {
      const v = await voiceIt(narr.trim(), spoken);
      const secs = await msBlobSeconds(v.blob);
      await dbPut(projectId.current + "_narr", v.blob, { text: v.text, secs });
      setNarrUrl(URL.createObjectURL(v.blob)); setNarrText(v.text); setNarrSecs(secs); setVoiceMode("engine");
      const ext = (v.blob.type || "").includes("wav") ? "wav" : "mp3";
      await saveFile({ blob: v.blob, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_voices." + ext, url: URL.createObjectURL(v.blob) });
      setRvMsg("Done. Your voices are on the film and the audio file is saved. Save the film again to get the new version.");
    } catch (e) { setErr("Voices: " + e.message); setRvMsg(""); }
    setBusy(false);
  }
  useEffect(() => { if (pendingRV && narr && !busy) { setPendingRV(false); reVoice(); } }, [pendingRV, narr, script]);
  // JUST AN IDEA: no [NAME] lines? Write the whole film from the idea (outline, then every scene's spoken lines), fill the boxes, make it.
  const [designing, setDesigning] = useState(false);
  async function designFromIdea() {
    const idea = fixEnc(String(onePrompt || "")).trim();
    if (!idea) { setAddMsg("Type your idea in the box first."); return; }
    setDesigning(true); setErr(""); setAddMsg(""); setPct(2); setStage("Designing your film from your idea…");
    const ask = async (prompt, max) => {
      for (let t = 0; t < 2; t++) {
        try {
          const d = await proxyFetch({ model: "claude-sonnet-4-20250514", max_tokens: max, messages: [{ role: "user", content: prompt }] });
          const txt = d && d.content ? d.content.filter(x => x.type === "text").map(x => x.text).join("") : "";
          if (txt) return txt;
        } catch (e) { }
      }
      throw new Error("The film writer did not answer. Press Make again.");
    };
    try {
      const words = { one: 1, two: 2, three: 3 };
      let mins = minutes; const mh = idea.match(/(\d+|one|two|three)\s*[- ]?\s*(?:hours?|hrs?|h)\b/i), mm = idea.match(/(\d+)\s*[- ]?\s*min/i);
      if (mh) mins = (words[mh[1].toLowerCase()] || Number(mh[1])) * 60; else if (mm) mins = Number(mm[1]);
      mins = (mh || mm) ? mins : minutes; mins = Math.max(1, Math.min(180, mins));
      const N = Math.max(4, Math.min(180, Math.round(mins * (mins <= 10 ? 2 : 1)))); // same rule as the scene counter: one scene a minute (two a minute up to 10 min)
      const animated = animKind || /\b(animated|animation|pixar|cartoon)\b/i.test(idea);
      const raw = await ask('You are a film writer and director. The idea: """' + idea + '"""\nDesign a ' + mins + '-minute ' + (animated ? "animated " : "") + 'film. Return ONLY JSON, no other text: {"title":"","premise":"2 sentences","look":"2 sentences on colours, light, style","setting":"time of year, weather, places","characters":[{"name":"UPPERCASE NAME","who":"age, sex, personality, what they look like"}],"scenes":[{"title":"","summary":"one short sentence"}]}. Use EXACTLY ' + N + ' scenes in story order with a clear beginning, middle and end. Use at most 8 characters. Names are UPPERCASE letters only. Keep it warm and family friendly unless the idea says otherwise.' + (brief ? " PRODUCTION BRIEF (follow it): " + brief + "." : ""), 8000);
      const o = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1).replace(/```json|```/g, ""));
      const chars = (o.characters || []).map(c => ({ name: String(c.name || "").toUpperCase().replace(/[^A-Z .'&-]/g, "").trim(), who: String(c.who || "") })).filter(c => c.name);
      const scs = (o.scenes || []).slice(0, N);
      if (!scs.length || !chars.length) throw new Error("The outline came back empty. Press Make again.");
      const names = chars.map(c => c.name).join(", ");
      const out = new Array(scs.length); let done = 0, next = 0;
      const worker = async () => {
        while (next < scs.length) {
          const i = next++;
          let txt = "", lines = [];
          const nameSet = chars.map(c => c.name);
          const clean = t => t.split(/\r?\n/).map(l => l.replace(/[*_`#>]+/g, "").replace(/^\s*(?:[-•]|\d+[.)])\s*/, "").trim()).map(l => { const m = l.match(/^\(?([A-Za-z][A-Za-z .'&-]{0,30}?)\)?\s*[:\-—]\s*(\S.*)$/); if (m && !/^\[/.test(l) && nameSet.includes(m[1].trim().toUpperCase())) return "[" + m[1].trim().toUpperCase() + "] " + m[2]; return l; }).filter(l => /^\[[^\]]+\]\s*\S/.test(l));
          for (let tries = 0; tries < 3 && !lines.length; tries++) {
          try {
            txt = await ask('You are writing scene ' + (i + 1) + ' of ' + scs.length + ' of the film "' + (o.title || "") + '".\nPremise: ' + (o.premise || "") + '\nLook: ' + (o.look || "") + '\nSetting: ' + (o.setting || "") + '\nCharacters: ' + chars.map(c => c.name + " (" + c.who + ")").join("; ") + '\nStory so far: ' + (i ? scs[i - 1].summary : "(this is the opening)") + '\nThis scene: ' + scs[i].title + " — " + scs[i].summary + '\nNext scene: ' + (scs[i + 1] ? scs[i + 1].summary : "(this is the ending)") + '\n\nWrite ONLY this, nothing else:\nVISUAL: one paragraph on what we see (place, action, camera, light, weather).\nThen 10 to 16 spoken lines, each on its own line as [NAME] line. NAME must be exactly one of: ' + names + '. Each line is one or two natural sentences. No stage directions, no narration unless NARRATOR is in the list.', 1800);
          } catch (e) { }
          lines = clean(txt);
          }
          const vis = (txt.split(/\r?\n/).find(l => /^VISUAL:/i.test(l.trim())) || "").replace(/^VISUAL:\s*/i, "").trim() || scs[i].summary;
          out[i] = { vis, lines };
          done++; setStage("Writing your film: scene " + done + " of " + scs.length + "…"); setPct(2 + Math.round(4 * done / scs.length));
        }
      };
      await Promise.all([worker(), worker(), worker()]);
      const title = String(o.title || "My Movie").trim();
      const sp = out.flatMap(x => x.lines);
      if (!sp.length) throw new Error("No spoken lines came back. Press Make again.");
      const tm = k => { const m = Math.round(k * mins / scs.length); return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0") + ":00"; };
      const dir = [
        "DESCRIPTION", o.premise || "", "",
        "DIRECTIONS",
        'MAKE a ' + mins + '-minute ' + (animated ? "animated " : "") + 'film called "' + title + '". BUILD it in the exact scene order below: ' + scs.length + ' scenes, no gaps. Render every scene and every line in SCRIPT ORDER, whatever order my files were uploaded in.', "",
        "SCRIPT. Use the spoken lines exactly as written. A name in square brackets, like [" + chars[0].name + "], is that character speaking.", "",
        "LOOK. " + (o.look || "") + " Keep every character looking the same from start to finish.", "",
        "SETTING. " + (o.setting || ""), "",
        "WHO THEY ARE.", ...chars.map(c => c.name + ": " + c.who), "",
        "VOICES. Use my uploaded character voices where I added them. Otherwise give each character a separate voice that fits their name, age and sex. Each character keeps the same voice for the whole film.", "",
        "FOOTAGE ORDER. 1. Use my uploaded images and clips first, in script order. 2. Use the audio already in my clips. 3. Stretch each clip to fill its scene. 4. Then stock footage. 5. Generate new clips only as a last resort, matching my look. Never show the same clip twice in a row.", "",
        "SOUND. Music under the voices that fits each scene. Room tone and ambient sound for every place. Footsteps, doors, weather and crowd sounds wherever the scene shows them. No silence.", "",
        "TIMING. Every scene fills its share of " + mins + ":00. No black frames. Fade out at the end.", "",
        "SCENE GUIDE.", ...out.map((x, i) => "SCENE " + (i + 1) + " (" + tm(i) + "-" + tm(i + 1) + "). " + (scs[i].title ? scs[i].title + ". " : "") + x.vis)
      ].join("\n");
      setTitle(title); setMinutes(mins); if (animated) { setKind("Animation"); setStyle("Animated"); } else setKind("Movie");
      setCharVoices(true); setVoiceMode("engine"); if (musicMode === "off") setMusicMode("library");
      setNarr(sp.join("\n")); setScript(dir);
      setDesigning(false); setStage("Your film is written: " + scs.length + " scenes, " + sp.length + " spoken lines. Making it now…");
      setAutoMake(true);
    } catch (e) {
      setDesigning(false); setErr(String((e && e.message) || e)); setStage("");
    }
  }
  const makeMovie = async () => {
    setErr("");
    if (voiceMode === "mine" && !myRec) { setErr("Your recording is not loaded. Press UPLOAD MY RECORDING, choose your file, then press Make again. I will not use another voice."); return; }
    let who = user;
    if (!who) { try { const { data } = await supabase.auth.getSession(); who = data && data.session && data.session.user; if (!who) { const r = await supabase.auth.refreshSession(); who = r && r.data && r.data.session && r.data.session.user; } if (who) setUser(who); } catch (e) { } }
    if (!who) { setShowLogin(true); setErr("Log in first, at the top of the page."); return; }
    if (!narr.trim() && !script.trim() && !photos.length && !clips.length) { setErr("Add your narration, script, photos or clips first."); return; }
    if (minutes < 1) { setErr("Move the length bar above 0 minutes."); return; }
    if (!subActive) {
      let used = false; try { used = !!localStorage.getItem(trialKey(who)); } catch (e) { }
      if (used) { setErr("Your free test film has been used. Subscribe for $50 a month to make more."); return; }
      if (minutes > 1) { setErr("The free test film is up to 1 minute. Move the length bar to 1 minute or less."); return; }
      // Server-side lock: the one free test film is claimed on the server, so clearing the browser does not reset it.
      try {
        const { data: ok, error: rpcErr } = await supabase.rpc("claim_studio_trial");
        if (!rpcErr && ok === false) { try { localStorage.setItem(trialKey(who), "1"); } catch (e) { } setErr("Your free test film has been used. Subscribe for $50 a month to make more."); return; }
      } catch (e) { }
    }
    setBusy(true); setDone(false); setPct(2);
    let wl = null; try { wl = await navigator.wakeLock.request("screen"); } catch (e) { }
    projectId.current = "p" + Date.now(); save("pid", projectId.current);
    try {
      // 1 — scene list
      setStage("Reading your script and writing the scenes…");
      const n = Math.max(sceneCount, clips.length);
      let list = parseScenes(script);
      if (list.length) { setStage("Using your " + list.length + " scenes exactly as written…"); }
      else try {
        const ask = "You are a film director making a " + kind + (title ? (' called "' + title + '"') : "") + ". Write an ordered shot list of EXACTLY " + n + " scenes for a " + minutes + "-minute film.\nLOOK for every scene: " + style + ", " + (GRADES.find(g => g.id === grade) || GRADES[0]).prompt + ". Keep the same characters looking the same in every scene.\nEach scene is one vivid visual paragraph (setting, who is there, light, camera move). No dialogue, no numbering.\nFollow the producer directions exactly." + (brief ? "\nPRODUCTION BRIEF: " + brief + "." : "") + "\n\nNARRATION:\n" + (narr || "(none)") + "\n\nSCRIPT AND PRODUCER DIRECTIONS:\n" + (script || "(none — build it from the narration and photos)") + "\n\nReturn ONLY a JSON array of " + n + " strings.";
        const d = await proxyFetch({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages: [{ role: "user", content: ask }] });
        const raw = (d && d.content ? d.content.filter(x => x.type === "text").map(x => x.text).join("") : "").replace(/```json|```/g, "");
        list = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)).map(s => String(s).trim()).filter(Boolean);
      } catch (e) {
        const paras = (script || narr).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
        list = paras.length ? paras : ["Opening establishing shot, cinematic light."];
      }
      if (!parseScenes(script).length) { while (list.length < n) list.push(list[list.length % Math.max(1, list.length)]); list = list.slice(0, n); }
      // Cut each scene into different shots (new angle each time), one per 10 s of film, so a clip never has to repeat to fill time.
      shotMap.current = null;
      { const origN = list.length, want = Math.min(SHOT_CAP, Math.ceil(minutes * 60 / SHOT_SECS));
        if (origN && want > origN) { const per = Math.ceil(want / origN), ex = [], first = [];
          list.forEach(tx => { first.push(ex.length); for (let k = 0; k < per; k++) ex.push(k ? tx + "\nThe same scene, a different shot: " + ANGLES[(k - 1) % ANGLES.length] + ". Same characters, same place, same look as the shot before. Continue the story of this scene." : tx); });
          shotMap.current = { first, origN }; list = ex; setStage("Cutting your " + origN + " scenes into " + ex.length + " shots, so nothing repeats…"); } }
      setScenes(list.map(t => ({ text: t, status: "waiting" }))); setPct(6);

      // 2 — narration (yours or the engine), translated if asked
      let nUrl = "", nText = "", nSecs = 0, firstVoice = "";
      // Your own clips carry their own voices. With clips and no narration, the engine does not voice the script at all.
      const clipVoices = clips.length > 0 && !narr.trim() && voiceMode !== "mine";
      const spokenText = clipVoices ? "" : (narr.trim() || msSpokenOnly(script));
      if (clipVoices) setStage("Using the voices in your clips.");
      if (voiceMode === "mine" && myRec) { nUrl = myRec.url; nText = spokenText; nSecs = (await audioSecs(myRec.blob)) || (await msBlobSeconds(myRec.blob)); await dbPut(projectId.current + "_narr", myRec.blob, { text: nText, secs: nSecs }); if (tail) nSecs += tail.secs; }
      else if (spokenText) {
        try { const v = await voiceIt(spokenText, spoken); nUrl = URL.createObjectURL(v.blob); nText = v.text; nSecs = await msBlobSeconds(v.blob); await dbPut(projectId.current + "_narr", v.blob, { text: nText, secs: nSecs }); if (lipSync) firstVoice = await readAsDataURL(v.blob.slice(0, 600000, v.blob.type)); }
        catch (e) {
          if (e && e.stopFilm) throw e;
          if (myRec) { nUrl = myRec.url; nText = spokenText; nSecs = (await audioSecs(myRec.blob)) || (await msBlobSeconds(myRec.blob)); await dbPut(projectId.current + "_narr", myRec.blob, { text: nText, secs: nSecs }); if (tail) nSecs += tail.secs; setStage("Engine has no credit. Using your own recording as the voice."); }
          else setErr("Voice: " + e.message + ". The film will be made without narration.");
        }
      }
      setNarrUrl(nUrl); setNarrText(nText); setNarrSecs(nSecs); setPct(14);
      // dubbed versions
      const dt = {};
      for (const lang of dubs) { if (lang === spoken || !spokenText) continue; try { setStage("Dubbing into " + lang + "…"); const v = await voiceIt(spokenText, lang); dt[lang] = { url: URL.createObjectURL(v.blob), text: v.text }; } catch (e) { } }
      setDubTracks(dt); setPct(20);

      // 3 — music
      let mUrl = "";
      if (musicMode === "mine" && mySong) mUrl = mySong.url;
      else if (musicMode === "make") { try { setStage("MandaStrong Engine — composing your music…"); const u = await seRun({ kind: "music", prompt: (musicPrompt || (style + " " + kind + " score, " + (MOODS.find(m => m.id === mood) || MOODS[0]).label)) + (mGenre ? ", " + mGenre : "") + (tempo ? ", " + tempo.toLowerCase() + " tempo" : "") + ", instrumental", duration: 30 }, 6); const b = await toBlob(u); await dbPut(projectId.current + "_music", b, {}); mUrl = URL.createObjectURL(b); } catch (e) { setErr("Music: " + e.message + ". Using the library track instead."); mUrl = await libraryMusic((MOODS.find(m => m.id === mood) || MOODS[0]).url); } }
      else if (musicMode === "library") mUrl = await libraryMusic((MOODS.find(m => m.id === mood) || MOODS[0]).url);
      setMusicUrl(mUrl); setPct(24);

      // 3b — match your images to scenes and plan free stock for the rest
      setStage("Matching your images to the scenes…"); noCredit.current = false; reuseN.current = 0; lastClipRef.current = null; engineFails.current = 0; engineOff.current = false;
      await planScenes(list);
      // 4 — scenes, ONE at a time (the engine limit allows one request at a time; throttled ones wait and retry by themselves)
      let next = 0, finished = 0; const failed = [];
      const worker = async () => { while (next < list.length) { const i = next++; setStage("MandaStrong Engine — making scene " + (i + 1) + " of " + list.length + "…"); const b = await makeScene(i, list[i], { firstVoice }); if (!b) failed.push(i); finished++; setPct(24 + Math.round(finished / list.length * 74)); } };
      await worker();
      // Any scene that came back empty gets one more try before the film is joined.
      for (const i of failed) { setStage("Trying scene " + (i + 1) + " again…"); await makeScene(i, list[i], { firstVoice }); }
      // Then every scene is joined into ONE film file automatically.
      autoJoin.current = true;
      setPct(100); setStage("All scenes made. Joining them into one film — keep this tab open."); setDone(true);
      if (!subActive) { try { localStorage.setItem(trialKey(who), "1"); } catch (e) { } }
    } catch (e) { setErr("Something stopped the film: " + e.message); }
    try { wl && wl.release(); } catch (e) { }
    setBusy(false);
  };
  const redoScene = async (i) => { if (busy) return; setBusy(true); await makeScene(i, scenes[i].text, {}); setBusy(false); };
  const removeScene = (i) => setScenes(p => p.filter((_, k) => k !== i));

  // ── preview player (picture + voice + music together) ──
  const vRef = useRef(null), nRef = useRef(null), mRef = useRef(null), tRef = useRef(null), wrapRef = useRef(null);
  const [playing, setPlaying] = useState(false); const [clock, setClock] = useState(0); const [cur, setCur] = useState(0); const [track, setTrack] = useState("main");
  const ready = scenes.filter(s => s.url);
  // Footage already made + your recording uploaded afterwards: your voice replaces the old voice, nothing is re-made.
  useEffect(() => { (async () => { if (busy || !myRec || voiceMode !== "mine" || !scenes.some(s => s.url)) return; if (narrUrl === myRec.url) return; const secs = (await audioSecs(myRec.blob)) || (await msBlobSeconds(myRec.blob)); setNarrUrl(myRec.url); setNarrSecs(secs + (tail ? tail.secs : 0)); setNarrText((narr || msSpokenOnly(script) || "").trim()); setStage("Your recording is now the voice. Your footage was kept. Press DOWNLOAD."); })(); }, [myRec, voiceMode, scenes.length, busy]);
  // The length bar is the film's length. Voices never make it shorter than the bar; each clip is stretched (looped) to fill its share.
  const total = Math.max(narrSecs || 0, minutes * 60, ready.length * 6);
  const sceneLen = ready.length ? total / ready.length : 6;
  const activeNarr = track === "main" ? narrUrl : (dubTracks[track] || {}).url;
  const useTail = !!(tail && track === "main" && myRec && narrUrl === myRec.url);
  const activeText = track === "main" ? narrText : (dubTracks[track] || {}).text;
  const captions = splitCaptions(activeText, narrSecs || total);
  const curRef = useRef(0); useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => {
    if (!playing) return;
    const t0 = Date.now() - clock * 1000;
    const iv = setInterval(() => {
      const c = (Date.now() - t0) / 1000; setClock(c);
      const k = Math.min(ready.length - 1, Math.floor(c / sceneLen));
      if (k !== curRef.current && ready[k]) { curRef.current = k; const v = vRef.current; if (v) { v.style.opacity = 0; setTimeout(() => { setCur(k); v.src = ready[k].url; v.loop = !isStill(ready[k]); v.playbackRate = slowOf(ready[k]); v.play().catch(() => { }); setTimeout(() => { v.style.opacity = 1; }, 120); }, 450); } else setCur(k); }
      const m = mRef.current; const talking = (nRef.current && !nRef.current.paused) || (tRef.current && !tRef.current.paused); if (m) m.volume = Math.max(0, Math.min(1, mVol * (duck && activeNarr && talking ? 0.45 : 1)));
      if (c >= total) { setPlaying(false); try { nRef.current && nRef.current.pause(); tRef.current && tRef.current.pause(); mRef.current && mRef.current.pause(); vRef.current && vRef.current.pause(); } catch (e) { } }
    }, 200);
    return () => clearInterval(iv);
  }, [playing, ready.length, sceneLen, total, duck, mVol, activeNarr]);
  const play = () => {
    if (!ready.length) return;
    const v = vRef.current, n = nRef.current, m = mRef.current;
    if (playing) { [v, n, m, tRef.current].forEach(x => { try { x && x.pause(); } catch (e) { } }); setPlaying(false); return; }
    if (clock >= total) { setClock(0); setCur(0); if (v) v.src = ready[0].url; if (n) n.currentTime = 0; if (m) m.currentTime = 0; if (tRef.current) { tRef.current.pause(); tRef.current.currentTime = 0; } }
    if (v) { if (!v.src) v.src = ready[cur].url; v.loop = !isStill(ready[cur]); v.playbackRate = slowOf(ready[cur]); v.muted = !hasSound(ready[cur]); v.volume = cVol; v.play().catch(() => { }); }
    if (n && activeNarr) { const t = tRef.current; if (useTail && t && n.ended && t.currentTime > 0) { t.volume = vVol; t.play().catch(() => { }); } else { n.volume = vVol; n.play().catch(() => { }); } }
    if (m && musicUrl) { m.loop = true; m.play().catch(() => { }); }
    setPlaying(true);
  };
  const restart = () => { [vRef.current, nRef.current, mRef.current, tRef.current].forEach(x => { try { if (x) { x.pause(); x.currentTime = 0; } } catch (e) { } }); setClock(0); setCur(0); setPlaying(false); if (vRef.current && ready[0]) vRef.current.src = ready[0].url; setTimeout(play, 50); };
  const fullScreen = () => { const el = wrapRef.current; const v = vRef.current; try { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); } catch (e) { try { v.webkitEnterFullscreen(); } catch (_) { } } };
  const caption = subs ? (captions.find(c => clock >= c.start && clock < c.end) || {}).text : "";

  // ── export: one file with picture, voice, music, captions, logo and credits ──
  const [exp, setExp] = useState({ busy: false, pct: 0, msg: "", files: [] });
  // Every finished film is kept on this device and listed under "My saved films", even after a reload.
  const [savedFilms, setSavedFilms] = useState([]);
  const loadSaved = async () => { const all = await dbAll(); setSavedFilms(all.filter(x => String(x.id).includes("_final_") && x.blob).sort((a, b) => String(b.id).localeCompare(String(a.id))).map(x => ({ id: x.id, name: (x.meta && x.meta.name) || "My film", blob: x.blob }))); };
  useEffect(() => { loadSaved(); }, []);
  const deleteSaved = async (id) => { try { const db = await idb(); const tx = db.transaction("f", "readwrite"); tx.objectStore("f").delete(id); await new Promise(res => { tx.oncomplete = res; tx.onerror = res; }); } catch (e) { } loadSaved(); };
  const stopExp = useRef(false); const pvRef = useRef(null);
  async function renderFile(opts) {
    const r = opts.ratio, [W, H] = sizeFor(r, quality);
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
    const AC = window.AudioContext || window.webkitAudioContext; const ac = new AC(); try { await ac.resume(); } catch (e) { }
    const dest = ac.createMediaStreamDestination(); try { dest.channelCount = 2; dest.channelCountMode = "explicit"; } catch (e) { }
    let nEl = null, tEl = null;
    const nSrc = opts.trailer ? "" : (opts.track === "main" ? narrUrl : (dubTracks[opts.track] || {}).url);
    if (nSrc) {
      nEl = new Audio(nSrc); nEl.preload = "auto";
      const mixIn = ac.createGain();
      ac.createMediaElementSource(nEl).connect(mixIn);
      if (opts.track === "main" && useTail) { tEl = new Audio(tail.url); tEl.preload = "auto"; ac.createMediaElementSource(tEl).connect(mixIn); nEl.addEventListener("ended", () => { try { tEl.play(); } catch (e) { } }); }
      let node = mixIn;
      if (cleanVoice) node = proVoice(ac, mixIn);
      const g = ac.createGain(); g.gain.value = vVol; node.connect(g); g.connect(dest);
    }
    let bed = null; const mg = ac.createGain(); mg.gain.value = mVol * (duck && nSrc ? 0.45 : 1); mg.connect(dest);
    if (musicUrl) { try { const buf = await ac.decodeAudioData(await (await fetch(musicUrl)).arrayBuffer()); bed = ac.createBufferSource(); bed.buffer = buf; bed.loop = true; bed.connect(mg); } catch (e) { bed = msBedSource(ac, mg, 0.6).src; } }
    let endEl = null;
    const logoImg = logo ? await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = logo; }) : null;
    const stream = cv.captureStream(30); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    const mime = pickMime(true); const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: quality === "720p" ? 5000000 : 9000000, audioBitsPerSecond: 192000 } : {});
    const ch = []; rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); }; const stopped = new Promise(res => { rec.onstop = res; });
    const tint = (GRADES.find(g => g.id === grade) || GRADES[0]).tint;
    const caps = opts.trailer ? [] : splitCaptions(opts.track === "main" ? narrText : (dubTracks[opts.track] || {}).text, narrSecs || total);
    const len = opts.trailer ? Math.min(opts.trailer / Math.max(1, ready.length), 3) : sceneLen;
    const count = opts.trailer ? Math.min(ready.length, Math.ceil(opts.trailer / len)) : ready.length;
    let lastPv = 0; const showPv = () => { const pv = opts.preview && opts.preview.current; if (!pv || Date.now() - lastPv < 150) return; lastPv = Date.now(); try { if (pv.width !== 480) { pv.width = 480; pv.height = Math.round(480 * H / W); } pv.getContext("2d").drawImage(cv, 0, 0, pv.width, pv.height); } catch (e) { } };
    const frame = (v, p, a) => {
      const vw = v.videoWidth || W, vh = v.videoHeight || H, sc = Math.max(W / vw, H / vh) * (1.02 + 0.06 * Math.min(1, p)) * (v._clip ? 1.15 : 1), dw = vw * sc, dh = vh * sc;
      ctx.globalAlpha = Math.max(0, Math.min(1, a)); try { ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh); } catch (e) { } ctx.globalAlpha = 1;
    };
    const draw = (v, tSec, p, prev, fa) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      if (prev && fa < 1) { frame(prev, 1, 1); frame(v, p, fa); } else frame(v, p, 1);
      ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H);
      if (subs && !opts.trailer) { const c = caps.find(x => tSec >= x.start && tSec < x.end); if (c) { ctx.font = "600 " + Math.round(H * 0.036) + "px Inter, sans-serif"; ctx.textAlign = "center"; const lines = wrapText(ctx, c.text, W * 0.86); lines.forEach((ln, k) => { const y = H * 0.92 - (lines.length - 1 - k) * H * 0.048; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,.8)"; ctx.strokeText(ln, W / 2, y); ctx.fillStyle = "#fff"; ctx.fillText(ln, W / 2, y); }); } }
      if (logoImg) { const lw = W * 0.1, lh = lw * logoImg.height / logoImg.width; ctx.globalAlpha = 0.8; ctx.drawImage(logoImg, W - lw - W * 0.03, H * 0.03, lw, lh); ctx.globalAlpha = 1; }
      if (watermark && plan === "starter") { ctx.font = Math.round(H * 0.03) + "px Inter"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.textAlign = "left"; ctx.fillText("Mandas 1 Shot Film Studio", W * 0.03, H * 0.96); }
      showPv();
    };
    const card = (lines, big) => { ctx.fillStyle = "#0E0F12"; ctx.fillRect(0, 0, W, H); ctx.textAlign = "center"; ctx.fillStyle = "#E6C98E"; ctx.font = Math.round(H * (big ? 0.11 : 0.06)) + "px Inter, sans-serif"; ctx.fillText(lines[0] || "", W / 2, H * 0.42); ctx.fillStyle = "#F3EDE2"; ctx.font = Math.round(H * 0.032) + "px Inter, sans-serif"; lines.slice(1).forEach((l, k) => ctx.fillText(l, W / 2, H * 0.55 + k * H * 0.05)); showPv(); };
    // Phones only allow sound that was started from a tap: wake the voice track now, then rewind it, so it can play after the title card.
    for (const el of [nEl, tEl]) { if (el) { try { await Promise.race([el.play(), sleep(800)]); el.pause(); el.currentTime = 0; } catch (e) { } } }
    try { await ac.resume(); } catch (e) { }
    rec.start(1000); if (bed) try { bed.start(0); } catch (e) { }
    const t0 = Date.now();
    // opening title card
    if (title) { const tEnd = Date.now() + 3000; while (Date.now() < tEnd && !stopExp.current) { card([title, kind], true); await sleep(33); } }
    if (nEl) try { await nEl.play(); } catch (e) { }
    const tStart = Date.now();
    const mkV = s => { const v = document.createElement("video"); v._clip = /^(your clip|engine still from your footage|engine)$/.test(String(s.source || "")); v.src = s.url; v.muted = !hasSound(s); v.loop = !isStill(s); v.playbackRate = slowOf(s); v.playsInline = true; v.preload = "auto"; v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", ""); v.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1"; try { document.body.appendChild(v); } catch (e) { }
      if (!v.muted) { try { const cg = ac.createGain(); cg.gain.value = cVol; ac.createMediaElementSource(v).connect(cg); cg.connect(dest); } catch (e) { v.muted = true; } }
      v._ok = new Promise(res => { v.onloadeddata = res; v.oncanplay = res; v.onerror = res; setTimeout(res, 8000); }); return v; };
    const FADE = Math.min(1.2, len * 0.3);
    const rmV = x => { try { x.pause(); x.removeAttribute("src"); x.load(); x.remove(); } catch (e) { } };
    const goPlay = async x => { try { await Promise.race([x.play(), sleep(4000)]); } catch (e) { } };
    let prevV = null, nextV = count ? mkV(ready[0]) : null;
    for (let i = 0; i < count && !stopExp.current; i++) {
      const v = nextV; await v._ok; await goPlay(v);
      nextV = i + 1 < count ? mkV(ready[i + 1]) : null;
      const s0 = Date.now(), end = s0 + len * 1000; let nudge = s0, lastP = 0;
      while (Date.now() < end && !stopExp.current) { const el = (Date.now() - s0) / 1000; if (v.paused && !isStill(ready[i]) && Date.now() - nudge > 1500) { nudge = Date.now(); try { v.play().catch(() => { }); } catch (e) { } } draw(v, (Date.now() - tStart) / 1000, el / len, prevV, el / FADE); if (prevV && el >= FADE) { rmV(prevV); prevV = null; } if (Date.now() - lastP > 1000) { lastP = Date.now(); opts.onProgress && opts.onProgress(Math.min(1, (i + el / len) / count), (Date.now() - t0) / 1000); } await sleep(33); }
      if (prevV) rmV(prevV); prevV = v;
      opts.onProgress && opts.onProgress((i + 1) / count, (Date.now() - t0) / 1000);
    }
    if (prevV) rmV(prevV);
    // credits
    if (credits && !opts.trailer && !stopExp.current) {
      if (endEl) try { endEl.play(); } catch (e) { }
      const names = creditNames.split("\n").map(s => s.trim()).filter(Boolean);
      const cEnd = Date.now() + Math.max(6000, names.length * 1500 + 4000);
      while (Date.now() < cEnd && !stopExp.current) { card([title || "The End", ...names.slice(0, 8), "Made with Mandas 1 Shot Film Studio"]); await sleep(33); }
    }
    if (opts.trailer && title) { const e2 = Date.now() + 2500; while (Date.now() < e2) { card([title, "Coming soon"], true); await sleep(33); } }
    try { nEl && nEl.pause(); tEl && tEl.pause(); endEl && endEl.pause(); bed && bed.stop(); } catch (e) { }
    try { rec.stop(); } catch (e) { } await stopped; try { ac.close(); } catch (e) { }
    const type = (mime || "video/webm").split(";")[0]; const ext = type.includes("mp4") ? ".mp4" : ".webm";
    const blob = new Blob(ch, { type }); const name = (title || "My_Film").replace(/[^\w]+/g, "_") + (opts.trailer ? "_Trailer" + opts.trailer + "s" : "") + "_" + r.replace(":", "x") + (opts.track !== "main" && !opts.trailer ? "_" + opts.track : "") + ext;
    return { blob, name, url: URL.createObjectURL(blob) };
  }
  const runExport = async (mode) => {
    if (!ready.length || exp.busy) return;
    try { [vRef.current, nRef.current, mRef.current].forEach(x => x && x.pause()); } catch (e) { } setPlaying(false);
    stopExp.current = false; let wl = null; try { wl = await navigator.wakeLock.request("screen"); } catch (e) { }
    const jobs = [];
    if (mode === "trailer") jobs.push({ ratio, trailer: 30, track: "main" }, { ratio, trailer: 60, track: "main" });
    else { const rs = mode === "all" && allRatios ? ["16:9", "9:16", "1:1"] : [ratio]; for (const r of rs) jobs.push({ ratio: r, track }); }
    const files = [];
    for (let j = 0; j < jobs.length && !stopExp.current; j++) {
      setExp({ busy: true, pct: 1, msg: "Making file " + (j + 1) + " of " + jobs.length + " — keep this tab open", files });
      try { const f = await renderFile({ ...jobs[j], preview: pvRef, onProgress: (p, s) => setExp(x => ({ ...x, pct: Math.round(p * 100), msg: "File " + (j + 1) + " of " + jobs.length + " · " + Math.round(p * 100) + "% · " + fmt(s) })) }); files.push(f); await dbPut(projectId.current + "_final_" + f.name, f.blob, { name: f.name }); }
      catch (e) { setExp(x => ({ ...x, msg: "Export problem: " + e.message })); }
    }
    try { wl && wl.release(); } catch (e) { }
    setExp({ busy: false, pct: 100, msg: stopExp.current ? "Stopped." : "Ready. Tap a file to save it.", files });
    loadSaved();
  };
  // When the scenes finish, the whole film is joined into one file without pressing anything.
  const autoJoin = useRef(false);
  useEffect(() => { if (done && !busy && autoJoin.current && ready.length && !join.busy) { autoJoin.current = false; SERVER_JOIN ? serverJoin() : runExport("one"); } }, [done, busy, ready.length]);
  // ── JOIN ON THE SERVER: the iPad sends the scenes once; a film server joins them into ONE file ──
  // Recording a whole film live in the browser drops the start on long films (iPad). The server
  // never does: it joins everything with ffmpeg and gives back a normal download link.
  const JOIN = SB + "film-join";
  // The film server is switched off until its GitHub account is unlocked; until then DOWNLOAD records in the browser.
  const SERVER_JOIN = false;
  const [join, setJoin] = useState({ busy: false, msg: "", pct: 0, urls: [], fileName: "" });
  const joinCall = async (body) => { const r = await fetch(JOIN, { method: "POST", headers: await engineAuthHeaders(), body: JSON.stringify(body) }); const d = await r.json(); if (d.error) throw new Error(d.error); return d; };
  const pollJoin = async (jobId) => {
    for (;;) {
      let d = null; try { d = await joinCall({ action: "status", jobId }); } catch (e) { if (/wasn't found|Log in/i.test(e.message)) { save("joinjob", ""); setJoin(j => ({ ...j, busy: false, msg: e.message })); return; } }
      if (d && d.status === "done") { save("joinjob", ""); setJoin({ busy: false, msg: "Your film is ready. Tap DOWNLOAD MY FILM.", pct: 100, urls: d.urls || [], fileName: d.fileName || "My_Film.mp4" }); return; }
      if (d && d.status === "failed") { save("joinjob", ""); setJoin({ busy: false, msg: "The film server couldn't join it: " + (d.error || "unknown problem") + ". Press DOWNLOAD to try again.", pct: 0, urls: [], fileName: "" }); return; }
      if (d) setJoin(j => ({ ...j, busy: true, msg: (d.progress || "Waiting for the film server") + " — you can close this page and come back.", pct: d.status === "running" ? 60 : 40 }));
      await sleep(20000);
    }
  };
  useEffect(() => { const j = load("joinjob", ""); if (j) { setJoin(x => ({ ...x, busy: true, msg: "Checking on your film…" })); pollJoin(j); } }, []);
  const serverJoin = async () => {
    if (!ready.length || join.busy) return;
    if (!user) { setJoin({ busy: false, msg: "Log in first, at the top of the page.", pct: 0, urls: [], fileName: "" }); return; }
    try { [vRef.current, nRef.current, mRef.current].forEach(x => x && x.pause()); } catch (e) { } setPlaying(false);
    let wl = null; try { wl = await navigator.wakeLock.request("screen"); } catch (e) { }
    try {
      setJoin({ busy: true, msg: "Getting your film ready to send…", pct: 2, urls: [], fileName: "" });
      const extOf = (b) => { const t = (b && b.type) || ""; return t.includes("webm") ? "webm" : t.includes("quicktime") ? "mov" : t.includes("mpeg") ? "mp3" : t.includes("wav") ? "wav" : t.includes("ogg") ? "ogg" : t.includes("audio") ? "m4a" : "mp4"; };
      // every file to send, big ones in 45 MB pieces (the storage takes pieces up to 50 MB)
      const files = []; const piece = 45 * 1048576;
      const addBlob = (base, blob) => { const names = []; if (blob.size <= piece) { const n = base + "." + extOf(blob); files.push({ n, b: blob }); names.push(n); } else { for (let o = 0, k = 0; o < blob.size; o += piece, k++) { const n = base + "." + extOf(blob) + ".part" + String(k).padStart(3, "0"); files.push({ n, b: blob.slice(o, o + piece) }); names.push(n); } } return names; };
      const sc = ready.map((x, i) => { const names = addBlob("scene_" + String(i).padStart(3, "0"), x.blob); return { file: names[0], still: isStill(x), audio: x.source === "your clip" }; });
      let narrNames = [], tailNames = [];
      // The recording chosen right now wins (e.g. a cleaned-up copy uploaded after the scenes were made).
      if (voiceMode === "mine" && myRec && myRec.blob) narrNames = addBlob("narr", myRec.blob);
      else if (narrUrl) { try { narrNames = addBlob("narr", await (await fetch(narrUrl)).blob()); } catch (e) { } }
      if (useTail && tail && tail.blob) tailNames = addBlob("tail", tail.blob);
      let music = null;
      if (musicUrl) { if (/^blob:/.test(musicUrl)) { try { music = { files: addBlob("music", await (await fetch(musicUrl)).blob()) }; } catch (e) { } } else music = { url: musicUrl }; }
      const { jobId } = await joinCall({ action: "start" });
      const { urls } = await joinCall({ action: "upload_urls", jobId, names: files.map(f => f.n) });
      const totalBytes = files.reduce((a, f) => a + f.b.size, 0) || 1; let sent = 0;
      for (let i = 0; i < files.length; i++) {
        const f = files[i]; let ok = false;
        for (let a = 0; a < 3 && !ok; a++) { try { const r = await fetch(urls[f.n], { method: "PUT", headers: { "x-upsert": "true", "Content-Type": f.b.type || "application/octet-stream" }, body: f.b }); ok = r.ok; if (!ok) await sleep(3000); } catch (e) { await sleep(3000); } }
        if (!ok) throw new Error("Sending " + f.n + " failed — check the internet connection and press DOWNLOAD again");
        sent += f.b.size;
        setJoin(j => ({ ...j, pct: 2 + Math.round(sent / totalBytes * 36), msg: "Sending your film to the film server — " + Math.round(sent / 1048576) + " of " + Math.round(totalBytes / 1048576) + " MB. Keep this page open until it's sent." }));
      }
      const [W, H] = sizeFor(ratio, quality);
      const tm = ((GRADES.find(g => g.id === grade) || GRADES[0]).tint.match(/[\d.]+/g) || [0, 0, 0, 0]).map(Number);
      const jp = {
        fileName: (title || "My_Film").replace(/[^\w]+/g, "_") + "_" + ratio.replace(":", "x") + ".mp4",
        W, H, fps: 30, title, kind, scenes: sc, narr: narrNames, tail: tailNames, music,
        vVol, mVol, cVol, duck, tint: tm, minutes, compact: true,
        watermark: !!(watermark && plan === "starter"),
        credits: { on: !!credits, title, lines: creditNames.split("\n").map(x => x.trim()).filter(Boolean) },
        subs: !!subs, subsText: narrText || "",
      };
      await joinCall({ action: "submit", jobId, plan: jp });
      save("joinjob", jobId);
      setJoin(j => ({ ...j, pct: 40, msg: "Sent. The film server is joining it into one film. You can close this page and come back." }));
      try { wl && wl.release(); } catch (e) { }
      pollJoin(jobId);
    } catch (e) { try { wl && wl.release(); } catch (_) { } setJoin({ busy: false, msg: "Couldn't send the film: " + e.message, pct: 0, urls: [], fileName: "" }); }
  };
  // Packs every finished scene + the narration + music into ONE .zip to send for joining.
  const [packMsg, setPackMsg] = useState("");
  const packFiles = async () => {
    if (!ready.length) return;
    try {
      setPackMsg("Packing your film files…");
      const extOf = (b) => { const t = (b && b.type) || ""; return t.includes("webm") ? "webm" : t.includes("quicktime") ? "mov" : t.includes("mpeg") ? "mp3" : t.includes("wav") ? "wav" : t.includes("audio") ? "m4a" : "mp4"; };
      const entries = ready.map((x, i) => ({ name: "scene_" + String(i + 1).padStart(3, "0") + (isStill(x) ? "_still" : "") + (x.source === "your clip" ? "_ownsound" : "") + "." + extOf(x.blob), blob: x.blob }));
      let nb = null; if (voiceMode === "mine" && myRec && myRec.blob) nb = myRec.blob; else if (narrUrl) { try { nb = await (await fetch(narrUrl)).blob(); } catch (e) { } }
      if (nb) entries.push({ name: "narration." + extOf(nb), blob: nb });
      if (useTail && tail && tail.blob) entries.push({ name: "narration_ending." + extOf(tail.blob), blob: tail.blob });
      if (musicUrl && /^blob:/.test(musicUrl)) { try { const mb = await (await fetch(musicUrl)).blob(); entries.push({ name: "music." + extOf(mb), blob: mb }); } catch (e) { } }
      const info = { title, kind, ratio, quality, grade, music: musicUrl && !/^blob:/.test(musicUrl) ? musicUrl : "", vVol, mVol, duck, subs, credits, creditNames, scenes: ready.map(x => x.text || ""), narrText: narrText || "" };
      entries.push({ name: "film.json", blob: new Blob([JSON.stringify(info, null, 1)], { type: "application/json" }) });
      const zip = await makeZip(entries, (i, n) => setPackMsg("Packing file " + i + " of " + n + "…"));
      setPackMsg("Packed: " + Math.round(zip.size / 1048576) + " MB. Choose Save to Files.");
      await saveFile({ blob: zip, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_film_files.zip", url: URL.createObjectURL(zip) });
    } catch (e) { setPackMsg("Couldn't pack the files: " + e.message); }
  };
  // A film that came back in pieces is put back together on this device, then saved.
  const getJoined = async () => {
    if (join.urls.length === 1) return;
    try { setJoin(j => ({ ...j, msg: "Downloading your film…" })); const parts = []; for (const u of join.urls) parts.push(await (await fetch(u)).blob()); const blob = new Blob(parts, { type: "video/mp4" }); await saveFile({ blob, name: join.fileName, url: URL.createObjectURL(blob) }); setJoin(j => ({ ...j, msg: "Your film is ready." })); } catch (e) { setJoin(j => ({ ...j, msg: "Download failed — try again." })); }
  };
  const saveFile = async (f, toPhotos) => {
    try { const file = new File([f.blob], f.name, { type: f.blob.type }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: f.name }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = f.url; a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1500);
  };
  const shareFilm = async () => { const f = exp.files[0]; if (f) return saveFile(f); try { await navigator.share({ title: title || "My film", text: "Made with Mandas 1 Shot Film Studio", url: "https://" + SITE }); } catch (e) { } };
  const poster = async () => {
    const s = ready[Math.floor(ready.length / 2)]; if (!s) return;
    const [W, H] = sizeFor(ratio === "16:9" ? "9:16" : ratio, "1080p"); const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
    const v = document.createElement("video"); v.muted = true; v.src = s.url; await new Promise(res => { v.onloadeddata = res; v.onerror = res; setTimeout(res, 8000); });
    try { v.currentTime = Math.min(2, (v.duration || 4) / 2); await new Promise(res => { v.onseeked = res; setTimeout(res, 2000); }); } catch (e) { }
    const vw = v.videoWidth || W, vh = v.videoHeight || H, sc = Math.max(W / vw, H / vh); try { ctx.drawImage(v, (W - vw * sc) / 2, (H - vh * sc) / 2, vw * sc, vh * sc); } catch (e) { }
    const g = ctx.createLinearGradient(0, H * 0.5, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.92)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "#E6C98E"; ctx.font = Math.round(W * 0.12) + "px Inter, sans-serif"; ctx.fillText(title || "My Film", W / 2, H * 0.84);
    ctx.fillStyle = "#F3EDE2"; ctx.font = Math.round(W * 0.028) + "px Inter, sans-serif"; ctx.fillText(kind.toUpperCase() + " · MANDAS 1 SHOT FILM STUDIO", W / 2, H * 0.9);
    const blob = await new Promise(res => cv.toBlob(res, "image/png")); await saveFile({ blob, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_Poster.png", url: URL.createObjectURL(blob) });
  };
  const saveProject = async () => {
    const data = { title, kind, narr, script, minutes, ratio, style, grade, scenes: scenes.map(s => s.text), savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    await dbPut(projectId.current + "_project", blob, {});
    await saveFile({ blob, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_Project.json", url: URL.createObjectURL(blob) });
  };
  const newFilm = async () => { const all = await dbAll(); const db = await idb(); const tx = db.transaction("f", "readwrite"); for (const x of all) if (String(x.id).startsWith(projectId.current) && !String(x.id).includes("_final_")) tx.objectStore("f").delete(x.id); await new Promise(res => { tx.oncomplete = res; tx.onerror = res; }); setScenes([]); setDone(false); setNarrUrl(""); setMusicUrl(""); setExp({ busy: false, pct: 0, msg: "", files: [] }); setStage(""); setPct(0); setClock(0); setCur(0); };

  // ── page ──
  const Chips = ({ items, value, onPick }) => <div className="row">{items.map(x => { const id = x.id || x, lb = x.label || x; return <button key={id} className={"c" + (value === id ? " on" : "")} onClick={() => onPick(id)}>{lb}</button>; })}</div>;
  const Toggle = ({ on, set, children }) => <button className={"c" + (on ? " on" : "")} onClick={() => set(!on)}>{children}</button>;
  const fileBtn = (id, accept, onFile, label) => <label className="c" htmlFor={id} style={{ display: "inline-block" }}>{label}<input id={id} type="file" accept={accept} style={{ display: "none" }} onChange={e => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) onFile(f); }} /></label>;
  const est = Math.round(sceneCount * 1.2 + (narr.length + script.length) / 4000);

  return (
    <div>
      <style>{CSS}</style>
      <style>{`.hero h2{font-weight:300!important;letter-spacing:-.035em!important;font-size:clamp(40px,7.5vw,72px)!important;margin:0!important}.hero p{font-size:15px!important;color:var(--dim)!important;margin:10px auto 0!important}.hero{margin:34px 0 22px!important}.len{border:0!important;background:none!important;padding:10px 2px 0!important}.mini{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:8px 0 12px;border-bottom:1px solid var(--line)}.wm{font-size:14px;font-weight:700;letter-spacing:.04em;color:#f3ede2}.mr{display:flex;align-items:center;gap:16px;font-size:13px}.lk{background:none;border:0;color:var(--text);font:inherit;font-size:13px;cursor:pointer;opacity:.75;padding:4px 0}.lk:hover{opacity:1}.sub{background:var(--gold);color:#17130a;border:0;border-radius:999px;padding:8px 16px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.opts{display:flex;gap:22px;justify-content:center;margin:14px 0 6px}.opts button{background:none;border:0;color:var(--dim);font:inherit;font-size:13px;letter-spacing:.04em;cursor:pointer;padding:6px 0;border-bottom:1px solid transparent}.opts button:hover{color:var(--gold);border-bottom-color:var(--gold)}.ft{text-align:center;font-size:11px;color:var(--dim);margin-top:40px;opacity:.7}@media(max-width:640px){.mfs{padding-left:14px;padding-right:14px;padding-bottom:48px}.mini{align-items:flex-start}.mr{width:100%;justify-content:flex-start;gap:10px;flex-wrap:wrap}.sub{padding:9px 13px}.hero{margin-top:28px!important}.hero h2{font-size:clamp(38px,12vw,58px)!important}.opts{gap:10px 16px}.opts button{font-size:12px}.go{font-size:18px!important;padding:15px!important}.lab{margin-top:20px}}`}</style>
      <div className="mfs">
        {simple && <div>
          <div className="mini">
            <div className="wm">Mandas 1 Shot Film Studio</div>
            <div className="mr">{user ? <><span style={{ opacity: .7 }}>{user.email}</span><button className="lk" onClick={logOut}>Log out</button></> : <button className="lk" onClick={() => setShowLogin(v => !v)}>Log in</button>}<button className="lk" onClick={() => { const em = (user && user.email) || email; window.open(TOPUP_LINK + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); }}>Buy extra usage</button><button className="sub" onClick={() => { const em = (user && user.email) || email; window.open(SUB_LINK + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); }}>Subscribe · $50/month</button></div>
          </div>
          {!user && showLogin && <div style={{ marginTop: 8 }}><div className="login">
            <input className="in" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            <input className="in" type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
            <button className="b g" onClick={logIn}>LOG IN</button><button className="b" onClick={signUp}>SIGN UP</button>
          </div></div>}
          {!user && authMsg && <div className="msg">{authMsg}</div>}
        </div>}
        {!simple && <div>
        <div className="top">
          <div><div className="eng">POWERED BY THE MANDASTRONG ENGINE</div><h1 className="brand" style={{ fontSize: "clamp(26px,4.4vw,38px)", margin: "6px 0 0" }}>Mandas 1 Shot Film Studio</h1></div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>{SITE}</div>
        </div>

        {user ? (
          <div className="row" style={{ marginTop: 14, alignItems: "center", justifyContent: "space-between" }}><div style={{ fontSize: 13 }}>Signed in as <b>{user.email}</b></div><button className="b s" onClick={logOut}>LOG OUT</button></div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div className="login">
              <input id="mfs-email" className="in" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <input id="mfs-pw" className="in" type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
              <button className="b g" onClick={logIn}>LOG IN</button><button className="b" onClick={signUp}>SIGN UP</button>
            </div>
            {authMsg && <div className="msg">{authMsg}</div>}
          </div>
        )}

        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <button className="b g" onClick={() => { const em = (user && user.email) || email; window.open(SUB_LINK + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); }}>SUBSCRIBE · $50 / MONTH</button>
          <button className="b" onClick={() => { const em = (user && user.email) || email; window.open(TOPUP_LINK + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); }}>BUY EXTRA USAGE</button>
        </div>

        </div>}

        {simple && <div className="hero">
          <h2>One Prompt. One Film.</h2>
          <p>Describe your film. The engine makes it.</p>
        </div>}
        {!simple && <div className="lab">ONE PROMPT — PUT EVERYTHING IN ONE BOX</div>}
        <textarea className="ta op" value={onePrompt} onChange={e => setOnePrompt(fixEnc(e.target.value))} placeholder={simple ? "Describe your film in as much detail as you like: the story, the characters, the look, the length.\n\nOr paste your full script with each speaker's name in [BRACKETS]." : "Title: Santa's List: The Book of Names\nLength: 60 min\n[SANTA] Ho ho ho!\n[LILY] I made a list!\nEverything else (directions, description, voices) goes on its own lines."} />
        <button className="go" style={{ marginTop: 10, display: simple ? "none" : undefined }} onClick={() => { const n = splitPrompt(); if (n) setAutoMake(true); else designFromIdea(); }}>SPLIT AND MAKE MY MOVIE</button>
        {simple && <div className="len">
          <div className="lenTop"><span>FILM LENGTH</span><b>{minutes >= 60 ? Math.floor(minutes / 60) + " hr" + (minutes % 60 ? " " + (minutes % 60) + " min" : "") : minutes + " min"}</b></div>
          <input type="range" className="rng" min={0} max={180} step={1} value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
          <div className="ticks"><span>0</span><span>1 hr</span><span>2 hr</span><span>3 hr</span></div>
          {!subActive && <div className="msg" style={{ marginTop: 6 }}>Your first film is a free test of up to 1 minute. Subscribe for $50 a month for up to 3 hours.</div>}
        </div>}
        <div className={simple ? "opts" : undefined} style={simple ? undefined : { display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {simple ? <button onClick={() => setSimple(false)}>Advanced controls</button> : <button className="b s" onClick={() => setSimple(true)}>RETURN TO ONE PROMPT</button>}
          {simple && <button onClick={() => setShowFiles(v => !v)}>{showFiles ? "Hide footage & voices" : "Footage & voices" + ((photos.length + clips.length + charRecs.length) ? " (" + (photos.length + clips.length + charRecs.length) + ")" : "")}</button>}
          <button className="b" style={{ display: simple ? "none" : undefined }} onClick={() => { const n = splitPrompt(); setAddMsg(n ? "Split into the boxes below. " + n + " spoken lines." : "No [NAME] lines found. Put each spoken line as [NAME] line."); }}>SPLIT INTO THE BOXES ONLY</button>
          {simple ? <button onClick={() => setShowGuide(v => !v)}>{showGuide ? "Close prompt guide" : "Prompt guide"}</button> : <button className="b s" onClick={() => setShowGuide(v => !v)}>{showGuide ? "CLOSE PROMPT GUIDE" : "PROMPT GUIDE"}</button>}
          {(scenes.length > 0 && !busy) && (simple ? <button onClick={reVoice}>Re-voice my film</button> : <button className="b s" onClick={reVoice}>RE-VOICE MY FILM</button>)}
        </div>
        {rvMsg && <div className="msg" style={{ marginTop: 6 }}>{rvMsg}</div>}
        {showGuide && <div className="guide" style={{ whiteSpace: "normal" }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>FILL IN WHAT YOU KNOW. LEAVE THE REST TO THE ENGINE.</div>
          <div style={{ display: "grid", gap: 8 }}>
            <input className="in" placeholder="Film title" value={gd.title} onChange={gset("title")} />
            <input className="in" placeholder="Length in minutes (e.g. 60)" inputMode="numeric" value={gd.len} onChange={gset("len")} />
            {[["genre", "Genre", GENRES], ["audience", "Audience", AUDIENCES], ["anim", "Animation style (if animated)", TOONS], ["camera", "Camera", CAMERAS], ["pace", "Pace", PACES], ["music", "Music style", MUSIC_GENRES]].map(([k, lab, arr]) => <select key={k} className="in" value={gd[k]} onChange={gset(k)}><option value="">{lab}: engine chooses</option>{arr.map(x => <option key={x} value={x}>{x}</option>)}</select>)}
            <textarea className="ta" placeholder="Your idea: what happens, in a paragraph or two" value={gd.idea} onChange={gset("idea")} />
            <textarea className="ta" placeholder="Characters: name, age, who they are" value={gd.chars} onChange={gset("chars")} />
            <textarea className="ta" placeholder="Setting and look: place, season, weather, mood" value={gd.setting} onChange={gset("setting")} />
            <button className="go" onClick={writeFromGuide}>WRITE MY PROMPT</button>
          </div>
        </div>}
        {showGuide && <div className="guide">{"HOW TO WRITE YOUR PROMPT\n\nLine 1:  Title: your film's name\nLine 2:  Length: 60 min\n\nEvery spoken line, in script order, with the speaker in square brackets:\n[NARRATOR] It was Christmas Eve.\n[LILY] Come on! We have to go look!\n\nEverything else goes on its own lines: what the film looks like, the weather, the mood, the music, and which voice plays which character.\n\nExample:\nTitle: Santa's List: The Book of Names\nLength: 60 min\n[SANTA] Ho ho ho!\n[LILY] I made a list!\nChristmas Eve night. Snow. Cold and crisp. Warm lights in the windows.\nVOICES: Doxy: Santa. Lily: Lily.\n\nThen add your photos, clips and voice files in box 4."}</div>}

        <div style={{ display: simple ? "none" : undefined }}>
        <div className="lab">1 · WHAT ARE YOU MAKING?</div>
        <Chips items={KINDS} value={kind} onPick={setKind} />
        <input id="mfs-title" className="in" style={{ marginTop: 10 }} placeholder="Title (used for the title card, poster and credits)" value={title} onChange={e => setTitle(e.target.value)} />
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>FILM LENGTH — up to 3 hours</span><b>{minutes >= 60 ? (Math.floor(minutes / 60) + " hr " + (minutes % 60 ? minutes % 60 + " min" : "")) : minutes + " min"}</b></div>
          <input type="range" className="rng" min={0} max={180} value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--dim)" }}><span>1 min</span><span>1 hr</span><span>2 hr</span><span>3 hr</span></div>
        </div>
        {isSeries(kind) && <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>EPISODES</span><b>{epCount} episode{epCount > 1 ? "s" : ""} · about {Math.max(1, Math.round(minutes / epCount))} min each</b></div>
          <input type="range" className="rng" min={1} max={24} value={epCount} onChange={e => setEpisodes(Number(e.target.value))} />
          <div className="msg">The length bar is the whole series. The engine writes it as separate episodes, each with its own title and a hook into the next, and they play in order in one film.</div>
        </div>}
        <div className="g3" style={{ marginTop: 12 }}>
          <div><span className="lbl">GENRE</span><Chips items={GENRES} value={genre} onPick={v => setGenre(genre === v ? "" : v)} /></div>
          <div><span className="lbl">AUDIENCE</span><Chips items={AUDIENCES} value={audience} onPick={v => setAudience(audience === v ? "" : v)} /></div>
          <div><span className="lbl">TIME AND PLACE</span><input id="mfs-place" className="in" value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. a snowy village, 1950s" /></div>
        </div>
        {animKind && <div style={{ marginTop: 10 }}><span className="lbl">ANIMATION STYLE</span><Chips items={TOONS} value={toon} onPick={v => setToon(toon === v ? "" : v)} /></div>}
        <div className="g3" style={{ marginTop: 10 }}>
          <div><span className="lbl">CAMERA</span><Chips items={CAMERAS} value={camera} onPick={v => setCamera(camera === v ? "" : v)} /></div>
          <div><span className="lbl">PACE</span><Chips items={PACES} value={pace} onPick={v => setPace(pace === v ? "" : v)} /></div>
        </div>

        <div className="lab">2 · SPOKEN LINES — NARRATION AND EVERY CHARACTER</div>
        <textarea id="mfs-narr" className="ta" value={narr} onChange={e => setNarr(e.target.value)} placeholder={"Paste every spoken line here, in script order.\nPut the speaker's name in square brackets:\n[LILY] Come on! We have to go look!\n[SANTA] Merry Christmas!\nLines with no name are read by the narrator.\nEvery word in this box is spoken."} />
        <div className="g3" style={{ marginTop: 8 }}>
          <button className={"c" + (recording ? " on" : "")} onClick={toggleRecord}>{recording ? "■ STOP RECORDING" : "● RECORD MY VOICE"}</button>
          {fileBtn("mfs-rec", "audio/*,.mp3,.m4a,.wav", f => { setMyRec({ name: f.name, blob: f, url: URL.createObjectURL(f) }); setVoiceMode("mine"); }, "UPLOAD MY RECORDING")}
          <button className={"c" + (voiceMode === "engine" ? " on" : "")} onClick={() => setVoiceMode(voiceMode === "engine" && myRec ? "mine" : "engine")}>{voiceMode === "engine" ? "USING ENGINE VOICE" : "USE ENGINE VOICE"}</button>
        </div>
        {myRec && <div className="msg">Your recording: {myRec.name} {voiceMode === "mine" ? "· in use" : "· not in use"} <audio src={myRec.url} controls style={{ verticalAlign: "middle", height: 30, maxWidth: "100%" }} /></div>}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="b g" style={{ padding: "9px 18px" }} onClick={openComplete} disabled={comp && comp.busy}>ENGINE TO COMPLETE NARRATION</button>
          <Toggle on={cleanVoice} set={setCleanVoice}>Enhance my recording — professional stereo</Toggle>
        </div>
        {comp && <div className="msg">
          {comp.sents && !comp.busy && !tail && <div>
            <div>Your recording is {Math.floor(comp.recSecs / 60)} min {Math.round(comp.recSecs % 60)} sec. The engine will start reading at:</div>
            <div style={{ color: "#E6C98E", margin: "6px 0" }}>"{comp.sents[comp.idx] || "(the end — nothing left to read)"}"</div>
            <div className="row">
              <button className="c" onClick={() => setComp({ ...comp, idx: Math.max(0, comp.idx - 1) })}>◀ EARLIER</button>
              <button className="c" onClick={() => setComp({ ...comp, idx: Math.min(comp.sents.length, comp.idx + 1) })}>LATER ▶</button>
              <button className="c" onClick={hearEnd}>HEAR MY LAST 20 SECONDS</button>
              <button className="b g" style={{ padding: "9px 18px" }} onClick={makeRest}>FINISH IT</button>
            </div>
          </div>}
          {comp.msg && <div style={{ marginTop: 6 }}>{comp.msg}</div>}
        </div>}
        {tail && <div className="msg">Engine finish ready — starts at "{tail.start}" · {Math.round(tail.secs / 60)} min <audio src={tail.url} controls style={{ verticalAlign: "middle", height: 30, maxWidth: "100%" }} /> <button className="c" onClick={() => { clearTail(); setComp(null); }}>REDO</button></div>}

        <div className="lab">3 · DIRECTIONS, DESCRIPTION &amp; VOICES</div>
        <textarea id="mfs-script" className="ta" value={script} onChange={e => setScript(e.target.value)} placeholder={"Paste your directions here: length, footage order, weather, sound, description, and who uses which voice.\nExample:\nDOXY'S VOICE:\nSanta: older man. Deeper, warm.\nLILY'S VOICE:\nLily: girl, age 10.\nThe engine builds the scenes and gives each character their voice from this."} />

        </div>
        <div style={{ display: simple && !showFiles ? "none" : undefined }}>
        <div className="lab">{simple ? "YOUR FOOTAGE & VOICES (OPTIONAL)" : "4 · PHOTOS, CLIPS & CHARACTER VOICES"}</div>
        <label htmlFor="mfs-files" className={"drop" + (over ? " over" : "")} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); else dropLink(e); }}>
          {simple ? "Drop or tap to add clips, pictures and character voices. Name each voice file after its character, like LILY." : "DROP, DRAG OR TAP TO ADD PHOTOS, CLIPS AND CHARACTER VOICES (AS MANY AS YOU LIKE). NAME EACH VOICE FILE, LIKE LILY, DOXY OR ETHAN."}
          <input id="mfs-files" type="file" multiple accept="image/*,video/*,audio/*,.heic,.heif,.mp4,.mov,.mp3,.m4a,.wav,.txt" style={{ display: "none" }} onChange={e => { const f = Array.from(e.target.files || []); e.target.value = ""; addFiles(f); }} />
        </label>
        {addMsg && <div className="msg">{addMsg}</div>}
        {(photos.length > 0 || clips.length > 0) && <div className="thumbs">
          {photos.map((p, i) => <div key={"p" + i} className="th"><img src={p.dataUrl} alt={p.name} /><button aria-label="Remove" onClick={() => setPhotos(x => x.filter((_, k) => k !== i))}>×</button></div>)}
          {clips.map((c, i) => <div key={"c" + i} className="th"><video src={c.url} muted playsInline /><button aria-label="Remove" onClick={() => { if (c.dbId) dbClear(c.dbId); setClips(x => x.filter((_, k) => k !== i)); }}>×</button></div>)}
        </div>}
        {(photos.length > 0 || clips.length > 0) && <div className="msg">Photos keep the same faces in every scene. Clips are used as your first scenes, in order.</div>}
        {charRecs.length > 0 && <div className="msg">Character voices ({charRecs.length}): {charRecs.map((r, i) => <span key={r.dbId} style={{ marginRight: 10, whiteSpace: "nowrap" }}>{r.name} <button aria-label="Remove" style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer" }} onClick={() => { dbClear(r.dbId); setCharRecs(x => x.filter((_, k) => k !== i)); }}>×</button></span>)} — each goes to the characters you give it in your directions, spoken in script order.</div>}

        <div style={{ display: simple ? "none" : undefined }}>
        <div className="lab">5 · VOICES</div>
        <div className="g3">
          <div><span className="lbl">NARRATOR</span><select id="mfs-narrator" className="in" value={narrator} onChange={e => setNarrator(e.target.value)}>{VOICE_CHARACTERS.filter(v => !v.isOwner).map(v => <option key={v.id} value={v.id}>{v.name} — {v.origin} {String(v.gender).toLowerCase()}</option>)}</select></div>
          <div><span className="lbl">CHARACTER VOICES</span><button className={"c" + (charVoices ? " on" : "")} style={{ width: "100%" }} onClick={() => setCharVoices(!charVoices)}>{charVoices ? "Auto-cast from script" : "Narrator only"}</button></div>
          <div><span className="lbl">VOICE SPEED {Number(speed).toFixed(1)}×</span><input type="range" className="rng" min={0.7} max={1.3} step={0.05} value={speed} onChange={e => setSpeed(Number(e.target.value))} /></div>
        </div>
        <div className="row" style={{ marginTop: 8 }}><Toggle on={lipSync} set={setLipSync}>Lip sync {lipSync ? "ON" : "OFF"}</Toggle>{lipSync && !photos.length && <span className="msg">Add a face photo for lip sync.</span>}</div>

        <div className="lab">6 · LANGUAGE</div>
        <div className="g3">
          <div><span className="lbl">SPOKEN LANGUAGE</span><select id="mfs-lang" className="in" value={spoken} onChange={e => setSpoken(e.target.value)}>{LANGS.map(l => <option key={l}>{l}</option>)}</select></div>
          <div><span className="lbl">SUBTITLES</span><button className={"c" + (subs ? " on" : "")} style={{ width: "100%" }} onClick={() => setSubs(!subs)}>{subs ? "Subtitles ON" : "Subtitles OFF"}</button></div>
          <div><span className="lbl">ALSO DUB INTO</span><select id="mfs-dub" className="in" value="" onChange={e => { const l = e.target.value; if (l && !dubs.includes(l)) setDubs([...dubs, l]); }}><option value="">Add a language…</option>{LANGS.filter(l => l !== spoken && !dubs.includes(l)).map(l => <option key={l}>{l}</option>)}</select></div>
        </div>
        {dubs.length > 0 && <div className="row" style={{ marginTop: 8 }}>{dubs.map(l => <button key={l} className="c on" onClick={() => setDubs(dubs.filter(x => x !== l))}>{l} ×</button>)}</div>}

        <div className="lab">7 · MUSIC STUDIO</div>
        <div className="row" style={{ alignItems: "center" }}>
          <button className={"c" + (showMusic ? " on" : "")} onClick={() => setShowMusic(v => !v)}>{showMusic ? "CLOSE MUSIC STUDIO" : "OPEN MUSIC STUDIO"}</button>
          <span className="msg" style={{ margin: 0 }}>Now: {({ library: "music library", make: "made for this film", mine: "my own song", off: "no music" })[musicMode]}{mood && musicMode !== "off" ? " · " + ((MOODS.find(m => m.id === mood) || MOODS[0]).label) : ""}</span>
        </div>
        {showMusic && <div className="tl" style={{ marginTop: 8 }}>
        <Chips items={[{ id: "library", label: "Music library" }, { id: "make", label: "Make my music" }, { id: "mine", label: "My own song" }, { id: "off", label: "No music" }]} value={musicMode} onPick={setMusicMode} />
        <div className="g3" style={{ marginTop: 8 }}>
          <div><span className="lbl">MOOD</span><select id="mfs-mood" className="in" value={mood} onChange={e => setMood(e.target.value)}>{MOODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
          <div><span className="lbl">DESCRIBE THE MUSIC (FOR MAKE MY MUSIC)</span><input id="mfs-mp" className="in" value={musicPrompt} onChange={e => setMusicPrompt(e.target.value)} placeholder="e.g. soft piano and strings, hopeful" /></div>
          <div><span className="lbl">MY OWN SONG</span><div className="row">{fileBtn("mfs-song", "audio/*,.mp3,.m4a,.wav", f => { setMySong({ name: f.name, blob: f, url: URL.createObjectURL(f) }); setMusicMode("mine"); }, mySong ? "Song ✓" : "My song")}</div></div>
        </div>
        <div className="g3" style={{ marginTop: 8 }}>
          <div><span className="lbl">MUSIC STYLE (FOR MAKE MY MUSIC)</span><Chips items={MUSIC_GENRES} value={mGenre} onPick={v => setMGenre(mGenre === v ? "" : v)} /></div>
          <div><span className="lbl">TEMPO (FOR MAKE MY MUSIC)</span><Chips items={TEMPOS} value={tempo} onPick={v => setTempo(tempo === v ? "" : v)} /></div>
        </div>
        </div>}

        <div className="lab">8 · LOOK</div>
        <Chips items={STYLES} value={style} onPick={setStyle} />
        <div className="row" style={{ marginTop: 6 }}>{GRADES.map(g => <button key={g.id} className={"c" + (grade === g.id ? " on" : "")} onClick={() => setGrade(g.id)}>{g.label}</button>)}<Toggle on={enhance} set={setEnhance}>Enhance {enhance ? "ON" : "OFF"}</Toggle></div>

        <div className="lab">9 · SOUND</div>
        <div className="row"><button className="c on">Stereo</button><Toggle on={duck} set={setDuck}>Music dips when someone speaks</Toggle><Toggle on={cleanVoice} set={setCleanVoice}>Clean up my voice</Toggle></div>

        <div className="lab">10 · FORMAT</div>
        <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
          <Chips items={Object.keys(RATIOS)} value={ratio} onPick={setRatio} />
          <Chips items={["720p", "1080p"]} value={quality} onPick={setQuality} />
        </div>
        <div className="g3" style={{ marginTop: 10, fontSize: 12 }}>
          <div>Voice {Math.round(vVol * 100)}%<input type="range" className="rng" min={0} max={1} step={0.05} value={vVol} onChange={e => { setVVol(Number(e.target.value)); if (nRef.current) nRef.current.volume = Number(e.target.value); }} /></div>
          <div>Music {Math.round(mVol * 100)}%<input type="range" className="rng" min={0} max={1} step={0.05} value={mVol} onChange={e => setMVol(Number(e.target.value))} /></div>
          <div>Clip sound {Math.round(cVol * 100)}%<input type="range" className="rng" min={0} max={1} step={0.05} value={cVol} onChange={e => setCVol(Number(e.target.value))} /></div>
        </div>

        <div className="lab">11 · EXTRAS</div>
        <div className="row">
          <button className="c on">Same faces every scene</button>
          <Toggle on={allRatios} set={setAllRatios}>Export 16:9 + 9:16 + square</Toggle>
          <Toggle on={credits} set={setCredits}>Credits at the end</Toggle>
          {fileBtn("mfs-logo", "image/*", async f => setLogo(await shrinkPhoto(await readAsDataURL(f), 512)), logo ? "My logo ✓" : "Add my logo")}
          <Toggle on={watermark} set={setWatermark}>Watermark on Starter</Toggle>
          <button className="c on">Never lose a render</button>
        </div>
        {credits && <textarea id="mfs-credits" className="ta" style={{ minHeight: 70, marginTop: 8 }} value={creditNames} onChange={e => setCreditNames(e.target.value)} placeholder={"Credits, one per line\nDirected by …\nNarrated by …"} />}

        </div>
        </div>

        <div style={{ marginTop: 18, border: "1px solid var(--line)", borderRadius: 3, padding: 12, display: simple ? "none" : "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 13 }}>
          <span>Before you start: {minutes} min · {Math.max(sceneCount, clips.length)} scenes · up to {Math.max(sceneCount, clips.length, Math.min(SHOT_CAP, Math.ceil(minutes * 60 / SHOT_SECS)))} shots (one new shot every {SHOT_SECS} seconds; your own clips count too) · {Math.max(1, castNames)} voice{castNames > 1 ? "s" : ""} · {langCount} language{langCount > 1 ? "s" : ""}</span>
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>About {est} min to make</span>
        </div>
        <button className="go" onClick={() => { if (simple && onePrompt.trim()) { const n = splitPrompt(); if (n) setAutoMake(true); else designFromIdea(); } else makeMovie(); }} disabled={busy || designing}>{designing ? "WRITING YOUR FILM…" : busy ? "MAKING YOUR MOVIE…" : "MAKE MY MOVIE"}</button>
        {(busy || designing) && <div aria-hidden="true" style={{ position: "fixed", right: 18, bottom: 18, zIndex: 60, width: 54, height: 54, pointerEvents: "none" }}>
          <style>{"@keyframes mfsGoldTurn{to{transform:rotate(360deg)}}@keyframes mfsGoldPulse{0%,100%{opacity:.55;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}"}</style>
          <svg viewBox="0 0 54 54" width="54" height="54" style={{ filter: "drop-shadow(0 0 8px rgba(230,201,142,.55))" }}>
            <defs><linearGradient id="mfsGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1C9" /><stop offset=".5" stopColor="#E6C98E" /><stop offset="1" stopColor="#A9812F" /></linearGradient></defs>
            <g style={{ transformOrigin: "27px 27px", animation: "mfsGoldTurn 1.6s linear infinite" }}>
              <circle cx="27" cy="27" r="22" fill="none" stroke="url(#mfsGold)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="78 60" />
              <circle cx="27" cy="5" r="3.2" fill="#FFF1C9" />
            </g>
            <polygon points="27,17 30,24 37,27 30,30 27,37 24,30 17,27 24,24" fill="url(#mfsGold)" style={{ transformOrigin: "27px 27px", animation: "mfsGoldPulse 1.4s ease-in-out infinite" }} />
          </svg></div>}
        {(busy || stage) && <div className="msg">{busy && <span className="spin" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 10 }} />}{stage}<div className="pb"><i style={{ width: pct + "%" }} /></div></div>}
        {err && <div className="msg err">{err}</div>}

        <div style={{ display: simple && !(busy || done || scenes.length > 0 || exp.files.length > 0) ? "none" : undefined }}>
        <div className="lab">{simple ? "YOUR FILM" : "12 · PREVIEW"}</div>
        <div className="out">
          <div>
            <div ref={wrapRef} className="pv" style={{ aspectRatio: (RATIOS[ratio] || [16, 9]).join("/"), maxHeight: ratio === "9:16" ? 620 : undefined, margin: ratio === "9:16" ? "0 auto" : undefined }}>
              <video ref={vRef} playsInline loop={!isStill(ready[cur])} style={{ transition: "opacity .45s ease, transform .3s linear", transform: "scale(" + (1 + 0.06 * Math.min(1, (clock % sceneLen) / sceneLen)) + ")" }} muted={!hasSound(ready[cur])} src={ready[cur] ? ready[cur].url : undefined} />
              {!ready.length && <div style={{ position: "absolute", color: "var(--dim)", fontSize: 13 }}>Your movie plays here</div>}
              {caption && <div className="cap">{caption}</div>}
            </div>
            {activeNarr && <audio ref={nRef} src={activeNarr} preload="auto" onEnded={() => { if (useTail && tRef.current) { tRef.current.volume = vVol; tRef.current.currentTime = 0; tRef.current.play().catch(() => { }); } }} />}
            {useTail && <audio ref={tRef} src={tail.url} preload="auto" />}
            {musicUrl && <audio ref={mRef} src={musicUrl} preload="auto" loop />}
            <div className="row" style={{ marginTop: 8, alignItems: "center" }}>
              <button className="b g" style={{ padding: "9px 22px" }} onClick={play} disabled={!ready.length}>{playing ? "PAUSE" : "PLAY"}</button>
              <button className="b s" style={{ padding: "9px 16px" }} onClick={restart} disabled={!ready.length}>RESTART</button>
              {Object.keys(dubTracks).length > 0 && <select id="mfs-track" className="in" style={{ width: "auto" }} value={track} onChange={e => setTrack(e.target.value)}><option value="main">{spoken}</option>{Object.keys(dubTracks).map(l => <option key={l} value={l}>{l}</option>)}</select>}
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--dim)" }}>Scene {ready.length ? cur + 1 : 0} of {ready.length} · {fmt(clock)} / {fmt(total)}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="b g" onClick={() => SERVER_JOIN ? serverJoin() : runExport("one")} disabled={!ready.length || join.busy || exp.busy}>{join.busy ? "JOINING…" : "DOWNLOAD"}</button>
            <button className="b" onClick={() => runExport("all")} disabled={!ready.length || exp.busy}>EXPORT</button>
            <button className="b s" onClick={() => exp.files[0] ? saveFile(exp.files[0], true) : (SERVER_JOIN ? serverJoin() : runExport("one"))} disabled={!ready.length || exp.busy || join.busy}>SAVE TO PHOTOS</button>
            <button className="b s" onClick={shareFilm} disabled={!ready.length}>SHARE</button>
            <button className="b s" onClick={fullScreen} disabled={!ready.length}>FULL SCREEN</button>
            <button className="b s" onClick={saveProject}>SAVE PROJECT</button>
            <button className="b s" onClick={() => runExport("trailer")} disabled={!ready.length || exp.busy}>TRAILER 30s + 60s</button>
            <button className="b s" onClick={poster} disabled={!ready.length}>POSTER</button>
            <button className="b s" onClick={packFiles} disabled={!ready.length}>PACK FILM FILES (.zip)</button>
            {exp.busy && <button className="b s" onClick={() => { stopExp.current = true; }}>STOP</button>}
          </div>
        </div>
        {(exp.busy || exp.msg) && <div className="msg">{exp.busy && <div className="livebox"><canvas ref={pvRef} /><span className="livetag">● LIVE</span></div>}<div className="prow">{exp.busy && <span className="spin" aria-hidden="true" />}<span>{exp.msg}</span></div><div className="pb"><i style={{ width: exp.pct + "%" }} /></div></div>}
        {packMsg && <div className="msg">{packMsg}</div>}
        {(join.busy || join.msg) && <div className="msg">{join.msg}<div className="pb"><i style={{ width: join.pct + "%" }} /></div></div>}
        {join.urls.length > 0 && <div className="row" style={{ marginTop: 8 }}>{join.urls.length === 1 ? <a className="b g" style={{ textDecoration: "none", padding: "13px 22px" }} href={join.urls[0]} download={join.fileName}>⬇ DOWNLOAD MY FILM · {join.fileName}</a> : <button className="b g" onClick={getJoined}>⬇ DOWNLOAD MY FILM · {join.fileName}</button>}</div>}
        {(exp.files.length > 0 || join.urls.length > 0 || (done && !busy && savedFilms.length > 0 && !exp.busy && !join.busy)) && (() => { const f = exp.files[0] || (savedFilms[0] && { blob: savedFilms[0].blob, name: savedFilms[0].name, url: URL.createObjectURL(savedFilms[0].blob) }); const nm = (title && title.trim()) || (f && f.name) || (join.fileName || "My film"); const go = () => { if (exp.files[0]) saveFile(exp.files[0]); else if (join.urls.length > 1) getJoined(); else if (join.urls.length === 1) { const a = document.createElement("a"); a.href = join.urls[0]; a.download = join.fileName; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1500); } else if (f) saveFile(f); }; return <div style={{ marginTop: 14, padding: 16, borderRadius: 6, background: "linear-gradient(135deg,#ffe08a,#ffb938)", color: "#000", textAlign: "center", boxShadow: "0 0 24px rgba(255,200,80,.55)" }}><div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".1em" }}>YOUR FILM IS READY</div><div style={{ fontSize: 22, fontWeight: 800, margin: "6px 0 12px", wordBreak: "break-word" }}>{nm}</div><button onClick={go} style={{ width: "100%", padding: "16px 10px", fontSize: 18, fontWeight: 800, border: "3px solid #000", borderRadius: 6, background: "#000", color: "#ffd45e", cursor: "pointer" }}>⬇ PRESS HERE TO SAVE YOUR FILM</button></div>; })()}
        {exp.files.length > 0 && <div className="row" style={{ marginTop: 8 }}>{exp.files.map(f => <button key={f.name} className="b s" onClick={() => saveFile(f)}>⬇ {f.name}</button>)}</div>}

        <div className="tl">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--gold)", marginBottom: 6 }}>MY SAVED FILMS · TAP TO SAVE TO PHOTOS OR FILES</div>
          {savedFilms.length === 0 ? <div className="msg">No film saved yet. When your film is ready, a bright gold box appears above with its name and a button to press.</div> :
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{savedFilms.map(f => <div key={f.id} className="row" style={{ alignItems: "center" }}>
              <button className="b g" style={{ padding: "9px 14px", textAlign: "left", flex: 1 }} onClick={() => saveFile({ blob: f.blob, name: f.name, url: URL.createObjectURL(f.blob) })}>⬇ {f.name} · {Math.round(f.blob.size / 1048576)} MB</button>
              <button className="c" onClick={() => deleteSaved(f.id)}>Delete</button>
            </div>)}</div>}
        </div>

        <div className="tl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--gold)" }}>TIMELINE · REDO OR REMOVE ANY SCENE</span>
            {done && <button className="c" onClick={newFilm}>Start a new film</button>}
          </div>
          {scenes.length === 0 ? <div className="msg">Your scenes appear here as they are made.</div> :
            <div className="sc">{scenes.map((s, i) => <div key={i} className={"scn" + (ready[cur] && ready[cur] === s ? " cur" : "")}>
              {s.url ? <video src={s.url} muted playsInline /> : <div style={{ aspectRatio: "16/9", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>{s.status === "making" ? "making…" : s.status === "failed" ? "failed" : "waiting"}</div>}
              <div>Scene {i + 1}{s.source ? " · " + s.source : ""}</div>
              {s.note && s.status === "failed" && <div className="err">{s.note}</div>}
              <div className="row" style={{ gap: 4, marginTop: 4 }}><button className="c" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => redoScene(i)} disabled={busy}>Redo</button><button className="c" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => removeScene(i)}>Remove</button></div>
            </div>)}</div>}
        </div>
        </div>
        <div className="ft">{simple ? "Powered by the MandaStrong Engine" : "Mandas 1 Shot Film Studio · Powered by the MandaStrong Engine · " + SITE}</div>
      </div>
    </div>
  );
}
