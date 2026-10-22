// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════
// MANDAS FILM & MUSIC STUDIO — one shot, one page, everything in, everything out.
// A separate app inside the MandaStrong Studio project. It does not touch the
// 25-page app. Powered by the MandaStrong Engine.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from "react";
import {
  supabase, engineAuthHeaders, msVoiceText, proxyFetch, translateText,
  msSpokenOnly, msParseCast, msCastVoices, VOICE_CHARACTERS, msBedSource, msBlobSeconds
} from "./engine.js";

const SB = "https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/";
const SE = SB + "studio-engine";
const LIPSYNC = SB + "lip-sync";
const SITE = "mandasfilmandmusicstudio.bolt.host";
const PLANS = [
  { id: "starter", name: "Starter", line: "Short clips · watermark", link: "https://buy.stripe.com/cNi8wRe8a9ZtcZh7YeafS05" },
  { id: "creator", name: "Creator", line: "Films up to 1 hour · no watermark", link: "https://buy.stripe.com/cNi8wRe8a3B52kDceuafS04" },
  { id: "studio", name: "Studio", line: "Up to 3 hours · every extra · dubbing", link: "https://buy.stripe.com/00wcN7fcefjNgbtceuafS03" },
];
const KINDS = ["Movie", "Documentary", "Music video", "Short clip", "Animation", "Ad / promo"];
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
async function se(body) { const r = await fetch(SE, { method: "POST", headers: await engineAuthHeaders(), body: JSON.stringify(body) }); return r.json(); }
async function seRun(body, maxMin) {
  const s = await se(body);
  if (s.error) throw new Error(s.error);
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
function wrapText(ctx, text, maxW) { const words = String(text).split(" "); const lines = []; let cur = ""; for (const w of words) { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; } if (cur) lines.push(cur); return lines; }

const CSS = `
:root{--bg:#0E0F12;--panel:#121419;--line:#2E2A22;--gold:#E6C98E;--text:#F3EDE2;--dim:#9A927F}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--text);font-family:Manrope,system-ui,sans-serif}
.mfs{max-width:1000px;margin:0 auto;padding:24px max(16px,env(safe-area-inset-left)) 80px max(16px,env(safe-area-inset-right))}
.brand{font-family:'Great Vibes',cursive;color:var(--gold);font-weight:400;line-height:1.05}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:12px}
.eng{font-size:11px;letter-spacing:.14em;color:var(--gold)}
.lab{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--gold);margin:22px 0 8px}
.ta{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:3px;color:var(--text);padding:12px;font:inherit;font-size:14px;resize:vertical;min-height:110px}
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
.msg{font-size:12px;color:#B9B1A0;margin-top:6px}.err{color:#E3A08F}
.rng{width:100%;accent-color:var(--gold)}
.ovl{position:fixed;inset:0;z-index:50;background:radial-gradient(ellipse at 50% 42%,#2b2416 0%,#0E0F12 62%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;transition:opacity .6s}
.ovl .brand{font-size:clamp(56px,11vw,120px)}
@media (prefers-reduced-motion: reduce){.ovl{transition:none}.pb i{transition:none}}
`;

export default function Studio() {
  // ── entry overlay ──
  const [entered, setEntered] = useState(() => { try { return sessionStorage.getItem("mfs_in") === "1"; } catch (e) { return false; } });
  const [fade, setFade] = useState(false);
  const enter = () => { setFade(true); setTimeout(() => { setEntered(true); try { sessionStorage.setItem("mfs_in", "1"); } catch (e) { } }, 550); };

  // ── account + plan ──
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [authMsg, setAuthMsg] = useState("");
  const [plan, setPlan] = useState(() => load("plan", "creator"));
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null)); const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null)); return () => { try { sub.subscription.unsubscribe(); } catch (e) { } }; }, []);
  const logIn = async () => { setAuthMsg("Logging in…"); const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw }); setAuthMsg(error ? error.message : ""); };
  const signUp = async () => { setAuthMsg("Creating your account…"); const { error } = await supabase.auth.signUp({ email: email.trim(), password: pw }); setAuthMsg(error ? error.message : "Account created. Check your email if asked to confirm, then log in."); };
  const logOut = async () => { await supabase.auth.signOut(); };
  const pay = () => { const p = PLANS.find(x => x.id === plan) || PLANS[1]; const em = (user && user.email) || email; window.open(p.link + (em ? "?prefilled_email=" + encodeURIComponent(em) : ""), "_blank", "noopener"); };

  // ── inputs (all remembered) ──
  const [kind, setKind] = useState(() => load("kind", "Movie"));
  const [title, setTitle] = useState(() => load("title", ""));
  const [narr, setNarr] = useState(() => load("narr", ""));
  const [script, setScript] = useState(() => load("script", ""));
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
  const [grade, setGrade] = useState(() => load("grade", "gold"));
  const [enhance, setEnhance] = useState(() => load("enhance", true));
  const [duck, setDuck] = useState(() => load("duck", true));
  const [cleanVoice, setCleanVoice] = useState(() => load("cleanVoice", true));
  const [minutes, setMinutes] = useState(() => load("minutes", 5));
  const [ratio, setRatio] = useState(() => load("ratio", "16:9"));
  const [quality, setQuality] = useState(() => load("quality", "1080p"));
  const [vVol, setVVol] = useState(() => load("vVol", 1));
  const [mVol, setMVol] = useState(() => load("mVol", 0.3));
  const [cVol, setCVol] = useState(() => load("cVol", 0.5));
  const [allRatios, setAllRatios] = useState(() => load("allRatios", false));
  const [credits, setCredits] = useState(() => load("credits", true));
  const [watermark, setWatermark] = useState(() => load("watermark", true));
  const [creditNames, setCreditNames] = useState(() => load("creditNames", ""));
  useEffect(() => { const o = { kind, title, narr, script, voiceMode, narrator, charVoices, lipSync, speed, spoken, subs, dubs, musicMode, mood, musicPrompt, style, grade, enhance, duck, cleanVoice, minutes, ratio, quality, vVol, mVol, cVol, allRatios, credits, watermark, creditNames, plan }; for (const k in o) save(k, o[k]); });

  // ── files ──
  const [photos, setPhotos] = useState([]); // {name,dataUrl}
  const [clips, setClips] = useState([]);   // {name,url,blob}
  const [myRec, setMyRec] = useState(null); // {name,blob,url}
  const [mySong, setMySong] = useState(null);
  const [endSong, setEndSong] = useState(null);
  const [logo, setLogo] = useState(null);   // dataUrl
  const [over, setOver] = useState(false);
  const [addMsg, setAddMsg] = useState("");
  const addFiles = async (list) => {
    const arr = Array.from(list || []); let n = 0;
    for (const f of arr) {
      const t = f.type || ""; const nm = f.name || "file";
      if (t.startsWith("image") || /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(nm)) { const d = await readAsDataURL(f); if (d) { const s = await shrinkPhoto(d, 1280); setPhotos(p => [...p, { name: nm, dataUrl: s }]); n++; } }
      else if (t.startsWith("video") || /\.(mp4|mov|m4v|webm)$/i.test(nm)) { setClips(p => [...p, { name: nm, url: URL.createObjectURL(f), blob: f }]); n++; }
      else if (t.startsWith("audio") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(nm)) { setMySong({ name: nm, blob: f, url: URL.createObjectURL(f) }); setMusicMode("mine"); n++; }
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
  const castNames = (() => { try { return msParseCast(narr || msSpokenOnly(script)).speakers.length; } catch (e) { return 0; } })();
  const langCount = 1 + dubs.length;

  // Bring back scenes from a render that was stopped or a reload.
  useEffect(() => {
    (async () => {
      const all = await dbAll(); const pre = projectId.current + "_scene_";
      const sc = all.filter(x => String(x.id).startsWith(pre)).sort((a, b) => a.meta.i - b.meta.i);
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
    if (charVoices && cast.speakers.length >= 2) {
      const cmap = msCastVoices(cast.speakers, narrator, t);
      for (let i = 0; i < cast.segments.length; i++) {
        const sg = cast.segments[i]; const vc = sg.sp ? cmap[sg.sp] : null;
        setStage("Voicing " + (sg.sp ? (cast.speakers.find(x => x.key === sg.sp) || {}).label : "narrator") + " — " + (i + 1) + " of " + cast.segments.length);
        const meta = vc ? { voice: vc.engineVoice || vc.id, gender: vc.gender || "", origin: vc.origin || "", speed: Number(speed) || 1 } : voiceMeta(narrator);
        const r = await msVoiceText(sg.text, { ...meta, language: lang && lang !== "English" ? lang : "" }); parts.push(...r.parts);
      }
    } else {
      const r = await msVoiceText(t, { ...voiceMeta(narrator), language: lang && lang !== "English" ? lang : "" }, (i, n) => setStage("MandaStrong Engine — voicing part " + i + " of " + n + (lang && lang !== "English" ? " (" + lang + ")" : ""))); parts = r.parts;
    }
    if (!parts.length) throw new Error("The voice engine returned no audio");
    return { blob: new Blob(parts, { type: parts[0].type || "audio/mpeg" }), text: t };
  }

  async function makeScene(i, text, list) {
    const look = style + " style, " + (GRADES.find(g => g.id === grade) || GRADES[0]).prompt + (enhance ? ", photorealistic, 35mm film grain, sharp detail" : "") + ", no on-screen text";
    const photo = photos.length ? photos[i % photos.length].dataUrl : "";
    const setS = (patch) => setScenes(p => p.map((s, k) => k === i ? { ...s, ...patch } : s));
    setS({ status: "making" });
    let blob = null, source = "engine", note = "";
    if (clips[i]) { blob = clips[i].blob; source = "your clip"; }
    if (!blob && i === 0 && lipSync && photo && list.firstVoice) {
      try { const r = await fetch(LIPSYNC, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: photo, audio: list.firstVoice }) }); const d = await r.json(); if (d.video) { blob = await toBlob(d.video); source = "lip sync"; } else note = d.error || ""; } catch (e) { }
    }
    if (!blob) { try { blob = await toBlob(await seRun({ kind: "video", prompt: text + "\n" + look, image: photo })); } catch (e) { note = e.message; } }
    if (!blob) { try { const im = await seRun({ kind: "image", prompt: text + "\n" + look, aspect_ratio: ratio }, 4); blob = await stillToClip(im, 6, i); source = "engine still"; } catch (e) { } }
    if (!blob && photo) { blob = await stillToClip(photo, 6, i); source = "your photo"; }
    if (!blob) { setS({ status: "failed", note: note || "No picture came back" }); return null; }
    await dbPut(projectId.current + "_scene_" + i, blob, { i, text, source });
    setS({ status: "done", blob, url: URL.createObjectURL(blob), source, note });
    return blob;
  }

  const makeMovie = async () => {
    setErr("");
    if (!user) { setErr("Log in first, at the top of the page."); return; }
    if (!narr.trim() && !script.trim() && !photos.length && !clips.length) { setErr("Add your narration, script, photos or clips first."); return; }
    setBusy(true); setDone(false); setPct(2);
    let wl = null; try { wl = await navigator.wakeLock.request("screen"); } catch (e) { }
    projectId.current = "p" + Date.now(); save("pid", projectId.current);
    try {
      // 1 — scene list
      setStage("Reading your script and writing the scenes…");
      const n = Math.max(sceneCount, clips.length);
      let list = [];
      try {
        const ask = "You are a film director making a " + kind + (title ? (' called "' + title + '"') : "") + ". Write an ordered shot list of EXACTLY " + n + " scenes for a " + minutes + "-minute film.\nLOOK for every scene: " + style + ", " + (GRADES.find(g => g.id === grade) || GRADES[0]).prompt + ". Keep the same characters looking the same in every scene.\nEach scene is one vivid visual paragraph (setting, who is there, light, camera move). No dialogue, no numbering.\nFollow the producer directions exactly.\n\nNARRATION:\n" + (narr || "(none)") + "\n\nSCRIPT AND PRODUCER DIRECTIONS:\n" + (script || "(none — build it from the narration and photos)") + "\n\nReturn ONLY a JSON array of " + n + " strings.";
        const d = await proxyFetch({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages: [{ role: "user", content: ask }] });
        const raw = (d && d.content ? d.content.filter(x => x.type === "text").map(x => x.text).join("") : "").replace(/```json|```/g, "");
        list = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)).map(s => String(s).trim()).filter(Boolean);
      } catch (e) {
        const paras = (script || narr).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
        list = paras.length ? paras : ["Opening establishing shot, cinematic light."];
      }
      while (list.length < n) list.push(list[list.length % Math.max(1, list.length)]);
      list = list.slice(0, n);
      setScenes(list.map(t => ({ text: t, status: "waiting" }))); setPct(6);

      // 2 — narration (yours or the engine), translated if asked
      let nUrl = "", nText = "", nSecs = 0, firstVoice = "";
      const spokenText = narr.trim() || msSpokenOnly(script);
      if (voiceMode === "mine" && myRec) { nUrl = myRec.url; nText = spokenText; nSecs = await msBlobSeconds(myRec.blob); await dbPut(projectId.current + "_narr", myRec.blob, { text: nText, secs: nSecs }); }
      else if (spokenText) {
        try { const v = await voiceIt(spokenText, spoken); nUrl = URL.createObjectURL(v.blob); nText = v.text; nSecs = await msBlobSeconds(v.blob); await dbPut(projectId.current + "_narr", v.blob, { text: nText, secs: nSecs }); if (lipSync) firstVoice = await readAsDataURL(v.blob.slice(0, 600000, v.blob.type)); }
        catch (e) { setErr("Voice: " + e.message + ". The film will be made without narration."); }
      }
      setNarrUrl(nUrl); setNarrText(nText); setNarrSecs(nSecs); setPct(14);
      // dubbed versions
      const dt = {};
      for (const lang of dubs) { if (lang === spoken || !spokenText) continue; try { setStage("Dubbing into " + lang + "…"); const v = await voiceIt(spokenText, lang); dt[lang] = { url: URL.createObjectURL(v.blob), text: v.text }; } catch (e) { } }
      setDubTracks(dt); setPct(20);

      // 3 — music
      let mUrl = "";
      if (musicMode === "mine" && mySong) mUrl = mySong.url;
      else if (musicMode === "make") { try { setStage("MandaStrong Engine — composing your music…"); const u = await seRun({ kind: "music", prompt: (musicPrompt || (style + " " + kind + " score, " + (MOODS.find(m => m.id === mood) || MOODS[0]).label)) + ", instrumental", duration: 30 }, 6); const b = await toBlob(u); await dbPut(projectId.current + "_music", b, {}); mUrl = URL.createObjectURL(b); } catch (e) { setErr("Music: " + e.message + ". Using the library track instead."); mUrl = (MOODS.find(m => m.id === mood) || MOODS[0]).url; } }
      else if (musicMode === "library") mUrl = (MOODS.find(m => m.id === mood) || MOODS[0]).url;
      setMusicUrl(mUrl); setPct(24);

      // 4 — scenes, three at a time
      let next = 0, finished = 0;
      const worker = async () => { while (next < list.length) { const i = next++; setStage("MandaStrong Engine — making scene " + (i + 1) + " of " + list.length + "…"); await makeScene(i, list[i], { firstVoice }); finished++; setPct(24 + Math.round(finished / list.length * 74)); } };
      await Promise.all([worker(), worker(), worker()]);
      setPct(100); setStage("Your film is ready. Press play, then Download or Export."); setDone(true);
    } catch (e) { setErr("Something stopped the film: " + e.message); }
    try { wl && wl.release(); } catch (e) { }
    setBusy(false);
  };
  const redoScene = async (i) => { if (busy) return; setBusy(true); await makeScene(i, scenes[i].text, {}); setBusy(false); };
  const removeScene = (i) => setScenes(p => p.filter((_, k) => k !== i));

  // ── preview player (picture + voice + music together) ──
  const vRef = useRef(null), nRef = useRef(null), mRef = useRef(null), wrapRef = useRef(null);
  const [playing, setPlaying] = useState(false); const [clock, setClock] = useState(0); const [cur, setCur] = useState(0); const [track, setTrack] = useState("main");
  const ready = scenes.filter(s => s.url);
  const total = Math.max(narrSecs || 0, minutes * 60 * (narrSecs ? 0 : 1), ready.length * 6);
  const sceneLen = ready.length ? total / ready.length : 6;
  const activeNarr = track === "main" ? narrUrl : (dubTracks[track] || {}).url;
  const activeText = track === "main" ? narrText : (dubTracks[track] || {}).text;
  const captions = splitCaptions(activeText, narrSecs || total);
  const curRef = useRef(0); useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => {
    if (!playing) return;
    const t0 = Date.now() - clock * 1000;
    const iv = setInterval(() => {
      const c = (Date.now() - t0) / 1000; setClock(c);
      const k = Math.min(ready.length - 1, Math.floor(c / sceneLen));
      if (k !== curRef.current && ready[k]) { curRef.current = k; setCur(k); const v = vRef.current; if (v) { v.src = ready[k].url; v.loop = true; v.play().catch(() => { }); } }
      const m = mRef.current; if (m) m.volume = Math.max(0, Math.min(1, mVol * (duck && activeNarr && nRef.current && !nRef.current.paused ? 0.45 : 1)));
      if (c >= total) { setPlaying(false); try { nRef.current && nRef.current.pause(); mRef.current && mRef.current.pause(); vRef.current && vRef.current.pause(); } catch (e) { } }
    }, 200);
    return () => clearInterval(iv);
  }, [playing, ready.length, sceneLen, total, duck, mVol, activeNarr]);
  const play = () => {
    if (!ready.length) return;
    const v = vRef.current, n = nRef.current, m = mRef.current;
    if (playing) { [v, n, m].forEach(x => { try { x && x.pause(); } catch (e) { } }); setPlaying(false); return; }
    if (clock >= total) { setClock(0); setCur(0); if (v) v.src = ready[0].url; if (n) n.currentTime = 0; if (m) m.currentTime = 0; }
    if (v) { if (!v.src) v.src = ready[cur].url; v.loop = true; v.muted = !ready[cur] || ready[cur].source !== "your clip"; v.volume = cVol; v.play().catch(() => { }); }
    if (n && activeNarr) { n.volume = vVol; n.play().catch(() => { }); }
    if (m && musicUrl) { m.loop = true; m.play().catch(() => { }); }
    setPlaying(true);
  };
  const restart = () => { [vRef.current, nRef.current, mRef.current].forEach(x => { try { if (x) { x.pause(); x.currentTime = 0; } } catch (e) { } }); setClock(0); setCur(0); setPlaying(false); if (vRef.current && ready[0]) vRef.current.src = ready[0].url; setTimeout(play, 50); };
  const fullScreen = () => { const el = wrapRef.current; const v = vRef.current; try { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); } catch (e) { try { v.webkitEnterFullscreen(); } catch (_) { } } };
  const caption = subs ? (captions.find(c => clock >= c.start && clock < c.end) || {}).text : "";

  // ── export: one file with picture, voice, music, captions, logo and credits ──
  const [exp, setExp] = useState({ busy: false, pct: 0, msg: "", files: [] });
  const stopExp = useRef(false);
  async function renderFile(opts) {
    const r = opts.ratio, [W, H] = sizeFor(r, quality);
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
    const AC = window.AudioContext || window.webkitAudioContext; const ac = new AC(); try { await ac.resume(); } catch (e) { }
    const dest = ac.createMediaStreamDestination();
    let nEl = null;
    const nSrc = opts.trailer ? "" : (opts.track === "main" ? narrUrl : (dubTracks[opts.track] || {}).url);
    if (nSrc) {
      nEl = new Audio(nSrc); nEl.preload = "auto";
      let node = ac.createMediaElementSource(nEl);
      if (cleanVoice) { const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 85; const comp = ac.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 3; node.connect(hp); hp.connect(comp); node = comp; }
      const g = ac.createGain(); g.gain.value = vVol; node.connect(g); g.connect(dest);
    }
    let bed = null; const mg = ac.createGain(); mg.gain.value = mVol * (duck && nSrc ? 0.45 : 1); mg.connect(dest);
    if (musicUrl) { try { const buf = await ac.decodeAudioData(await (await fetch(musicUrl)).arrayBuffer()); bed = ac.createBufferSource(); bed.buffer = buf; bed.loop = true; bed.connect(mg); } catch (e) { bed = msBedSource(ac, mg, 0.6).src; } }
    let endEl = null; if (endSong && !opts.trailer) { endEl = new Audio(endSong.url); const eg = ac.createGain(); eg.gain.value = mVol; ac.createMediaElementSource(endEl).connect(eg); eg.connect(dest); }
    const logoImg = logo ? await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = logo; }) : null;
    const stream = cv.captureStream(30); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    const mime = pickMime(true); const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: quality === "720p" ? 5000000 : 9000000, audioBitsPerSecond: 192000 } : {});
    const ch = []; rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); }; const stopped = new Promise(res => { rec.onstop = res; });
    const tint = (GRADES.find(g => g.id === grade) || GRADES[0]).tint;
    const caps = opts.trailer ? [] : splitCaptions(opts.track === "main" ? narrText : (dubTracks[opts.track] || {}).text, narrSecs || total);
    const len = opts.trailer ? Math.min(opts.trailer / Math.max(1, ready.length), 3) : sceneLen;
    const count = opts.trailer ? Math.min(ready.length, Math.ceil(opts.trailer / len)) : ready.length;
    const draw = (v, tSec) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      const vw = v.videoWidth || W, vh = v.videoHeight || H, sc = Math.max(W / vw, H / vh) * 1.02, dw = vw * sc, dh = vh * sc;
      try { ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh); } catch (e) { }
      ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H);
      if (subs && !opts.trailer) { const c = caps.find(x => tSec >= x.start && tSec < x.end); if (c) { ctx.font = "600 " + Math.round(H * 0.036) + "px Manrope, sans-serif"; ctx.textAlign = "center"; const lines = wrapText(ctx, c.text, W * 0.86); lines.forEach((ln, k) => { const y = H * 0.92 - (lines.length - 1 - k) * H * 0.048; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,.8)"; ctx.strokeText(ln, W / 2, y); ctx.fillStyle = "#fff"; ctx.fillText(ln, W / 2, y); }); } }
      if (logoImg) { const lw = W * 0.1, lh = lw * logoImg.height / logoImg.width; ctx.globalAlpha = 0.8; ctx.drawImage(logoImg, W - lw - W * 0.03, H * 0.03, lw, lh); ctx.globalAlpha = 1; }
      if (watermark && plan === "starter") { ctx.font = Math.round(H * 0.03) + "px Manrope"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.textAlign = "left"; ctx.fillText("Mandas Film & Music Studio", W * 0.03, H * 0.96); }
    };
    const card = (lines, big) => { ctx.fillStyle = "#0E0F12"; ctx.fillRect(0, 0, W, H); ctx.textAlign = "center"; ctx.fillStyle = "#E6C98E"; ctx.font = Math.round(H * (big ? 0.11 : 0.06)) + "px 'Great Vibes', cursive"; ctx.fillText(lines[0] || "", W / 2, H * 0.42); ctx.fillStyle = "#F3EDE2"; ctx.font = Math.round(H * 0.032) + "px Manrope, sans-serif"; lines.slice(1).forEach((l, k) => ctx.fillText(l, W / 2, H * 0.55 + k * H * 0.05)); };
    rec.start(1000); if (bed) try { bed.start(0); } catch (e) { }
    const t0 = Date.now();
    // opening title card
    if (title) { const tEnd = Date.now() + 3000; while (Date.now() < tEnd && !stopExp.current) { card([title, kind], true); await sleep(33); } }
    if (nEl) try { await nEl.play(); } catch (e) { }
    const tStart = Date.now();
    for (let i = 0; i < count && !stopExp.current; i++) {
      const v = document.createElement("video"); v.src = ready[i].url; v.muted = ready[i].source !== "your clip"; v.loop = true; v.playsInline = true;
      if (!v.muted) { try { const cg = ac.createGain(); cg.gain.value = cVol; ac.createMediaElementSource(v).connect(cg); cg.connect(dest); } catch (e) { v.muted = true; } }
      await new Promise(res => { v.onloadeddata = res; v.onerror = res; setTimeout(res, 15000); }); try { await v.play(); } catch (e) { }
      const end = Date.now() + len * 1000;
      while (Date.now() < end && !stopExp.current) { draw(v, (Date.now() - tStart) / 1000); await sleep(33); }
      try { v.pause(); v.src = ""; } catch (e) { }
      opts.onProgress && opts.onProgress((i + 1) / count, (Date.now() - t0) / 1000);
    }
    // credits
    if (credits && !opts.trailer && !stopExp.current) {
      if (endEl) try { endEl.play(); } catch (e) { }
      const names = creditNames.split("\n").map(s => s.trim()).filter(Boolean);
      const cEnd = Date.now() + Math.max(6000, names.length * 1500 + 4000);
      while (Date.now() < cEnd && !stopExp.current) { card([title || "The End", ...names.slice(0, 8), "Made with Mandas Film & Music Studio"]); await sleep(33); }
    }
    if (opts.trailer && title) { const e2 = Date.now() + 2500; while (Date.now() < e2) { card([title, "Coming soon"], true); await sleep(33); } }
    try { nEl && nEl.pause(); endEl && endEl.pause(); bed && bed.stop(); } catch (e) { }
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
      try { const f = await renderFile({ ...jobs[j], onProgress: (p, s) => setExp(x => ({ ...x, pct: Math.round(p * 100), msg: "File " + (j + 1) + " of " + jobs.length + " · " + Math.round(p * 100) + "% · " + fmt(s) })) }); files.push(f); await dbPut(projectId.current + "_final_" + f.name, f.blob, { name: f.name }); }
      catch (e) { setExp(x => ({ ...x, msg: "Export problem: " + e.message })); }
    }
    try { wl && wl.release(); } catch (e) { }
    setExp({ busy: false, pct: 100, msg: stopExp.current ? "Stopped." : "Ready. Tap a file to save it.", files });
  };
  const saveFile = async (f, toPhotos) => {
    try { const file = new File([f.blob], f.name, { type: f.blob.type }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: f.name }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = f.url; a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1500);
  };
  const shareFilm = async () => { const f = exp.files[0]; if (f) return saveFile(f); try { await navigator.share({ title: title || "My film", text: "Made with Mandas Film & Music Studio", url: "https://" + SITE }); } catch (e) { } };
  const poster = async () => {
    const s = ready[Math.floor(ready.length / 2)]; if (!s) return;
    const [W, H] = sizeFor(ratio === "16:9" ? "9:16" : ratio, "1080p"); const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
    const v = document.createElement("video"); v.muted = true; v.src = s.url; await new Promise(res => { v.onloadeddata = res; v.onerror = res; setTimeout(res, 8000); });
    try { v.currentTime = Math.min(2, (v.duration || 4) / 2); await new Promise(res => { v.onseeked = res; setTimeout(res, 2000); }); } catch (e) { }
    const vw = v.videoWidth || W, vh = v.videoHeight || H, sc = Math.max(W / vw, H / vh); try { ctx.drawImage(v, (W - vw * sc) / 2, (H - vh * sc) / 2, vw * sc, vh * sc); } catch (e) { }
    const g = ctx.createLinearGradient(0, H * 0.5, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.92)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "#E6C98E"; ctx.font = Math.round(W * 0.12) + "px 'Great Vibes', cursive"; ctx.fillText(title || "My Film", W / 2, H * 0.84);
    ctx.fillStyle = "#F3EDE2"; ctx.font = Math.round(W * 0.028) + "px Manrope, sans-serif"; ctx.fillText(kind.toUpperCase() + " · MANDAS FILM & MUSIC STUDIO", W / 2, H * 0.9);
    const blob = await new Promise(res => cv.toBlob(res, "image/png")); await saveFile({ blob, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_Poster.png", url: URL.createObjectURL(blob) });
  };
  const saveProject = async () => {
    const data = { title, kind, narr, script, minutes, ratio, style, grade, scenes: scenes.map(s => s.text), savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    await dbPut(projectId.current + "_project", blob, {});
    await saveFile({ blob, name: (title || "My_Film").replace(/[^\w]+/g, "_") + "_Project.json", url: URL.createObjectURL(blob) });
  };
  const newFilm = async () => { await dbClear(projectId.current); setScenes([]); setDone(false); setNarrUrl(""); setMusicUrl(""); setExp({ busy: false, pct: 0, msg: "", files: [] }); setStage(""); setPct(0); setClock(0); setCur(0); };

  // ── page ──
  const Chips = ({ items, value, onPick }) => <div className="row">{items.map(x => { const id = x.id || x, lb = x.label || x; return <button key={id} className={"c" + (value === id ? " on" : "")} onClick={() => onPick(id)}>{lb}</button>; })}</div>;
  const Toggle = ({ on, set, children }) => <button className={"c" + (on ? " on" : "")} onClick={() => set(!on)}>{children}</button>;
  const fileBtn = (id, accept, onFile, label) => <label className="c" htmlFor={id} style={{ display: "inline-block" }}>{label}<input id={id} type="file" accept={accept} style={{ display: "none" }} onChange={e => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) onFile(f); }} /></label>;
  const est = Math.round(sceneCount * 1.2 + (narr.length + script.length) / 4000);

  return (
    <div>
      <style>{CSS}</style>
      {!entered && (
        <div className="ovl" style={{ opacity: fade ? 0 : 1 }} onClick={enter} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") enter(); }}>
          <div className="eng" style={{ position: "absolute", top: 32 }}>POWERED BY THE MANDASTRONG ENGINE</div>
          <div className="brand">Mandas Film<br />&amp; Music Studio</div>
          <div style={{ width: 200, height: 1, background: "rgba(230,201,142,.4)", margin: "26px 0 16px" }} />
          <div style={{ fontSize: 16, letterSpacing: ".06em", color: "#B9B1A0", lineHeight: 1.5 }}>Welcome To The One Stop Shop All In One Movie And Music App</div>
          <button className="b" style={{ marginTop: 46, padding: "15px 44px" }}>TAP TO ENTER</button>
          <div style={{ position: "absolute", bottom: 30, fontSize: 13, color: "#9A927F" }}>{SITE}</div>
        </div>
      )}
      <div className="mfs">
        <div className="top">
          <div><div className="eng">POWERED BY THE MANDASTRONG ENGINE</div><h1 className="brand" style={{ fontSize: "clamp(38px,6vw,56px)", margin: "6px 0 0" }}>Mandas Film &amp; Music Studio</h1></div>
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

        <div className="lab">CHOOSE YOUR PLAN</div>
        <div className="g3">{PLANS.map(p => <button key={p.id} className={"plan" + (plan === p.id ? " on" : "")} onClick={() => setPlan(p.id)}><h3>{p.name}<span className="tick">{plan === p.id ? "✓" : ""}</span></h3><span style={{ fontSize: 12, color: "#B9B1A0" }}>{p.line}</span></button>)}</div>
        <button className="b g" style={{ width: "100%", marginTop: 10 }} onClick={pay}>PAY FOR {(PLANS.find(p => p.id === plan) || PLANS[1]).name.toUpperCase()} — SECURE CHECKOUT</button>

        <div className="lab">1 · WHAT ARE YOU MAKING?</div>
        <Chips items={KINDS} value={kind} onPick={setKind} />
        <input id="mfs-title" className="in" style={{ marginTop: 10 }} placeholder="Title (used for the title card, poster and credits)" value={title} onChange={e => setTitle(e.target.value)} />

        <div className="lab">2 · NARRATION — EVERYTHING SPOKEN</div>
        <textarea id="mfs-narr" className="ta" value={narr} onChange={e => setNarr(e.target.value)} placeholder="Paste the narration here. Every word in this box is spoken." />
        <div className="g3" style={{ marginTop: 8 }}>
          <button className={"c" + (recording ? " on" : "")} onClick={toggleRecord}>{recording ? "■ STOP RECORDING" : "● RECORD MY VOICE"}</button>
          {fileBtn("mfs-rec", "audio/*,.mp3,.m4a,.wav", f => { setMyRec({ name: f.name, blob: f, url: URL.createObjectURL(f) }); setVoiceMode("mine"); }, "UPLOAD MY RECORDING")}
          <button className={"c" + (voiceMode === "engine" ? " on" : "")} onClick={() => setVoiceMode(voiceMode === "engine" && myRec ? "mine" : "engine")}>{voiceMode === "engine" ? "USING ENGINE VOICE" : "USE ENGINE VOICE"}</button>
        </div>
        {myRec && <div className="msg">Your recording: {myRec.name} {voiceMode === "mine" ? "· in use" : "· not in use"} <audio src={myRec.url} controls style={{ verticalAlign: "middle", height: 30, maxWidth: "100%" }} /></div>}

        <div className="lab">3 · SCRIPT &amp; PRODUCER DIRECTIONS</div>
        <textarea id="mfs-script" className="ta" value={script} onChange={e => setScript(e.target.value)} placeholder="Paste the script, characters, scenes and directions here. The engine builds the characters, their voices and the scenes from this." />

        <div className="lab">4 · PHOTOS, CLIPS &amp; AUDIO</div>
        <label htmlFor="mfs-files" className={"drop" + (over ? " over" : "")} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); else dropLink(e); }}>
          DROP, DRAG OR TAP TO ADD PHOTOS, CLIPS AND AUDIO FROM ANYWHERE
          <input id="mfs-files" type="file" multiple accept="image/*,video/*,audio/*,.heic,.heif,.mp4,.mov,.mp3,.m4a,.wav,.txt" style={{ display: "none" }} onChange={e => { const f = Array.from(e.target.files || []); e.target.value = ""; addFiles(f); }} />
        </label>
        {addMsg && <div className="msg">{addMsg}</div>}
        {(photos.length > 0 || clips.length > 0) && <div className="thumbs">
          {photos.map((p, i) => <div key={"p" + i} className="th"><img src={p.dataUrl} alt={p.name} /><button aria-label="Remove" onClick={() => setPhotos(x => x.filter((_, k) => k !== i))}>×</button></div>)}
          {clips.map((c, i) => <div key={"c" + i} className="th"><video src={c.url} muted playsInline /><button aria-label="Remove" onClick={() => setClips(x => x.filter((_, k) => k !== i))}>×</button></div>)}
        </div>}
        {(photos.length > 0 || clips.length > 0) && <div className="msg">Photos keep the same faces in every scene. Clips are used as your first scenes, in order.</div>}

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

        <div className="lab">7 · MUSIC</div>
        <Chips items={[{ id: "library", label: "Music library" }, { id: "make", label: "Make my music" }, { id: "mine", label: "My own song" }, { id: "off", label: "No music" }]} value={musicMode} onPick={setMusicMode} />
        <div className="g3" style={{ marginTop: 8 }}>
          <div><span className="lbl">MOOD</span><select id="mfs-mood" className="in" value={mood} onChange={e => setMood(e.target.value)}>{MOODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
          <div><span className="lbl">DESCRIBE THE MUSIC (FOR MAKE MY MUSIC)</span><input id="mfs-mp" className="in" value={musicPrompt} onChange={e => setMusicPrompt(e.target.value)} placeholder="e.g. soft piano and strings, hopeful" /></div>
          <div><span className="lbl">MY SONG / END SONG</span><div className="row">{fileBtn("mfs-song", "audio/*,.mp3,.m4a,.wav", f => { setMySong({ name: f.name, blob: f, url: URL.createObjectURL(f) }); setMusicMode("mine"); }, mySong ? "Song ✓" : "My song")}{fileBtn("mfs-end", "audio/*,.mp3,.m4a,.wav", f => setEndSong({ name: f.name, url: URL.createObjectURL(f) }), endSong ? "End song ✓" : "End song")}</div></div>
        </div>

        <div className="lab">8 · LOOK</div>
        <Chips items={STYLES} value={style} onPick={setStyle} />
        <div className="row" style={{ marginTop: 6 }}>{GRADES.map(g => <button key={g.id} className={"c" + (grade === g.id ? " on" : "")} onClick={() => setGrade(g.id)}>{g.label}</button>)}<Toggle on={enhance} set={setEnhance}>Enhance {enhance ? "ON" : "OFF"}</Toggle></div>

        <div className="lab">9 · SOUND</div>
        <div className="row"><button className="c on">Stereo</button><Toggle on={duck} set={setDuck}>Music dips when someone speaks</Toggle><Toggle on={cleanVoice} set={setCleanVoice}>Clean up my voice</Toggle></div>

        <div className="lab">10 · FORMAT</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span>Length</span><b>{minutes >= 60 ? (Math.floor(minutes / 60) + " hr " + (minutes % 60 ? minutes % 60 + " min" : "")) : minutes + " min"}</b></div>
        <input type="range" className="rng" min={1} max={180} value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--dim)" }}><span>1 min</span><span>1 hr</span><span>2 hr</span><span>3 hr</span></div>
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

        <div style={{ marginTop: 18, border: "1px solid var(--line)", borderRadius: 3, padding: 12, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 13 }}>
          <span>Before you start: {minutes} min · {Math.max(sceneCount, clips.length)} scenes · {Math.max(1, castNames)} voice{castNames > 1 ? "s" : ""} · {langCount} language{langCount > 1 ? "s" : ""}</span>
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>About {est} min to make</span>
        </div>
        <button className="go" onClick={makeMovie} disabled={busy}>{busy ? "MAKING YOUR MOVIE…" : "MAKE MY MOVIE"}</button>
        {(busy || stage) && <div className="msg">{stage}<div className="pb"><i style={{ width: pct + "%" }} /></div></div>}
        {err && <div className="msg err">{err}</div>}

        <div className="lab">12 · PREVIEW</div>
        <div className="out">
          <div>
            <div ref={wrapRef} className="pv" style={{ aspectRatio: (RATIOS[ratio] || [16, 9]).join("/"), maxHeight: ratio === "9:16" ? 620 : undefined, margin: ratio === "9:16" ? "0 auto" : undefined }}>
              <video ref={vRef} playsInline loop muted={!ready[cur] || ready[cur].source !== "your clip"} src={ready[cur] ? ready[cur].url : undefined} />
              {!ready.length && <div style={{ position: "absolute", color: "var(--dim)", fontSize: 13 }}>Your movie plays here</div>}
              {caption && <div className="cap">{caption}</div>}
            </div>
            {activeNarr && <audio ref={nRef} src={activeNarr} preload="auto" />}
            {musicUrl && <audio ref={mRef} src={musicUrl} preload="auto" loop />}
            <div className="row" style={{ marginTop: 8, alignItems: "center" }}>
              <button className="b g" style={{ padding: "9px 22px" }} onClick={play} disabled={!ready.length}>{playing ? "PAUSE" : "PLAY"}</button>
              <button className="b s" style={{ padding: "9px 16px" }} onClick={restart} disabled={!ready.length}>RESTART</button>
              {Object.keys(dubTracks).length > 0 && <select id="mfs-track" className="in" style={{ width: "auto" }} value={track} onChange={e => setTrack(e.target.value)}><option value="main">{spoken}</option>{Object.keys(dubTracks).map(l => <option key={l} value={l}>{l}</option>)}</select>}
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--dim)" }}>Scene {ready.length ? cur + 1 : 0} of {ready.length} · {fmt(clock)} / {fmt(total)}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="b g" onClick={() => runExport("one")} disabled={!ready.length || exp.busy}>DOWNLOAD</button>
            <button className="b" onClick={() => runExport("all")} disabled={!ready.length || exp.busy}>EXPORT</button>
            <button className="b s" onClick={() => exp.files[0] ? saveFile(exp.files[0], true) : runExport("one")} disabled={!ready.length || exp.busy}>SAVE TO PHOTOS</button>
            <button className="b s" onClick={shareFilm} disabled={!ready.length}>SHARE</button>
            <button className="b s" onClick={fullScreen} disabled={!ready.length}>FULL SCREEN</button>
            <button className="b s" onClick={saveProject}>SAVE PROJECT</button>
            <button className="b s" onClick={() => runExport("trailer")} disabled={!ready.length || exp.busy}>TRAILER 30s + 60s</button>
            <button className="b s" onClick={poster} disabled={!ready.length}>POSTER</button>
            {exp.busy && <button className="b s" onClick={() => { stopExp.current = true; }}>STOP</button>}
          </div>
        </div>
        {(exp.busy || exp.msg) && <div className="msg">{exp.msg}<div className="pb"><i style={{ width: exp.pct + "%" }} /></div></div>}
        {exp.files.length > 0 && <div className="row" style={{ marginTop: 8 }}>{exp.files.map(f => <button key={f.name} className="b s" onClick={() => saveFile(f)}>⬇ {f.name}</button>)}</div>}

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
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--dim)", marginTop: 26 }}>Mandas Film &amp; Music Studio · Powered by the MandaStrong Engine · {SITE}</div>
      </div>
    </div>
  );
}
