// @ts-nocheck
import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   CARECOVER — coordination for care & nursing agencies
   Built by a coordinator, for coordinators.
   Hero: a call-off instantly finds qualified, available cover.

   Stack: single-file React (Bolt) + Supabase + Stripe.
   - Real email/password auth via Supabase.
   - Live shared data across the whole agency via Supabase tables
     + realtime; falls back to local demo mode if keys are absent,
     so it always runs the moment it is pasted into Bolt.
   Wiring points are marked  // WIRE:
   ============================================================ */

// ---------- Supabase (set these in Bolt env or inline) ----------
// WIRE: paste your project URL + anon key. Until then, DEMO mode runs.
const SUPABASE_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || "https://njqfexhltjwpgvctmyaw.supabase.co";
const SUPABASE_ANON = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || "sb_publishable_wqRnYf5pnp68Qo6-McfwyA_JNYrh2VC";
const LIVE = Boolean(SUPABASE_URL && SUPABASE_ANON);
const sb = LIVE ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;

// ---------- Stripe ----------
// WIRE: paste your Stripe Payment Link URL for each plan (Stripe → Payment links).
// Leave "" to keep a button in "coming soon" state. Same approach as MandaStrong.
const STRIPE_LINKS = {
  "Starter": "https://buy.stripe.com/fZucN78NQ0oT3oHemCafS06",
  "Agency": "https://buy.stripe.com/bJe8wRfce7Rl2kD2DUafS07",
  "Multi-branch": "https://buy.stripe.com/8x200l7JMdbF7EX1zQafS08",
};

// ---------- design tokens: "clinical calm", precise and quiet ----------
const INK = "#101828";
const SUBINK = "#475467";
const PAPER = "#f8fafc";
const CANVAS = "#f1f5f9";
const CARD = "#ffffff";
const LINE = "#e4e9f0";
const MUTE = "#667085";
const FAINT = "#98a2b3";
const BRAND = "#0e7490";       // deep cyan — trustworthy, medical, not techy-neon
const BRANDDK = "#0b5566";
const BRANDSOFT = "#e0f2f7";
const GREEN = "#12805c";
const GREENSOFT = "#dcfae6";
const AMBER = "#b54708";
const AMBERSOFT = "#fef0c7";
const RED = "#b42318";
const REDSOFT = "#fee4e2";

const DISPLAY = "'Fraunces','Georgia',serif";   // characterful display, used with restraint
const UI = "'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif";

// ---------- helpers ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().slice(0, 10);
const fmtTime = (h, m = 0) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
const surname = (n) => n.split(" ").slice(-1)[0];
function load(k, fb) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ---------- seed demo data ----------
const SEED_STAFF = [
  { id: "s1", name: "Amara Okafor", role: "Senior Carer", phone: "07700 900001", skills: ["Meds", "Hoist", "Dementia"], status: "in", area: "North", capacity: 6, festive: { 2025: "xmas" } },
  { id: "s2", name: "Bea Whitfield", role: "Care Assistant", phone: "07700 900002", skills: ["Personal care", "Meals"], status: "in", area: "North", capacity: 6, festive: { 2025: "ny" } },
  { id: "s3", name: "Chloe Adeyemi", role: "Care Assistant", phone: "07700 900003", skills: ["Personal care", "Dementia"], status: "off", area: "South", capacity: 5, festive: { 2025: "xmas" } },
  { id: "s4", name: "Danny Rees", role: "Support Worker", phone: "07700 900004", skills: ["Meds", "Driving"], status: "in", area: "South", capacity: 6, festive: { 2025: "ny" } },
  { id: "s5", name: "Esther Mbeki", role: "Senior Carer", phone: "07700 900005", skills: ["Meds", "Hoist", "Wound care"], status: "break", area: "North", capacity: 5, festive: {} },
  { id: "s6", name: "Farah Nawaz", role: "Care Assistant", phone: "07700 900006", skills: ["Personal care", "Meals", "Driving"], status: "off", area: "East", capacity: 6, festive: {} },
];
const AREAS = ["North", "South", "East", "West", "Central"];
// a couple of demo absences (dates relative to today so they show as upcoming)
function seedAbsences() {
  const d = (offset) => { const x = new Date(); x.setDate(x.getDate() + offset); return x.toISOString().slice(0, 10); };
  return [
    { id: "a1", staffId: "s2", type: "Training", date: d(2), note: "Moving & handling refresher" },
    { id: "a2", staffId: "s4", type: "Annual leave", date: d(5), note: "" },
    { id: "a3", staffId: "s1", type: "Course", date: d(9), note: "Medication competency" },
  ];
}
const ABSENCE_TYPES = ["Training", "Shadowing", "Course", "Annual leave", "Sickness"];
const ABSENCE_TONE = { "Training": "#2563eb", "Shadowing": "#7c3aed", "Course": "#0e7490", "Annual leave": "#12805c", "Sickness": "#b54708" };

// ---------- festive fairness ----------
// Fully automatic: if a carer worked Christmas last year, they get Christmas OFF this
// year (and work New Year), and vice versa. Driven by stored history per carer.
function festivePlan(staff, year) {
  // staff[i].festive = { [year]: "xmas" | "ny" }  -> which they WORKED that year
  return staff.map((s) => {
    const lastYear = (s.festive || {})[year - 1];
    let worksXmas, worksNY;
    if (lastYear === "xmas") { worksXmas = false; worksNY = true; }
    else if (lastYear === "ny") { worksXmas = true; worksNY = false; }
    else { worksXmas = null; worksNY = null; } // no history yet
    return { staff: s, worksXmas, worksNY, lastYear };
  });
}
function seedVisits() {
  const t = todayKey();
  // days: array of weekday numbers this client is visited (0=Sun..6=Sat)
  // file: the client's care-file reference/URL the coordinator can open
  const mk = (id, cid, client, addr, start, dur, staffId, skills, days) => ({
    id, client_id: cid, client, addr, date: t, start, dur, staffId, skills, days,
    status: staffId ? "assigned" : "open",
    history: staffId ? [{ at: nowISO(), who: staffId, note: "Assigned on rota" }] : [],
  });
  return [
    mk("v1", "c1", "Mr J. Patel", "12 Elm Court", 8, 45, "s1", ["Meds"], [1, 3, 5]),
    mk("v2", "c2", "Mrs D. Okonkwo", "4 Birch Rise", 9, 60, "s2", ["Personal care"], [1, 2, 3, 4, 5]),
    mk("v3", "c3", "Mr R. Campbell", "88 Oak Lane", 10, 30, "s4", ["Meds", "Driving"], [2, 4]),
    mk("v4", "c4", "Ms L. Fenwick", "2 Cedar Mews", 11, 45, "s1", ["Dementia"], [1, 3, 5]),
    mk("v5", "c5", "Mr A. Simko", "31 Maple Grove", 13, 60, "s5", ["Wound care"], [0, 3, 6]),
    mk("v6", "c6", "Mrs P. Ncube", "7 Willow Walk", 14, 45, "s2", ["Hoist"], [1, 2, 3, 4, 5, 6, 0]),
    mk("v7", "c7", "Mr T. Bianchi", "19 Ash Close", 16, 30, null, ["Personal care"], [2, 4, 6]),
  ];
}
// Day shorthand: Mon–Sun -> M T W T F S S, with weekdays shown in CAPITALS the coordinator's way.
const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"]; // index = 0..6 (Sun..Sat)
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function daysShort(days) {
  if (!days || !days.length) return "";
  if (days.length === 7) return "Every day";
  // order Mon-first for reading, capital letters e.g. MWF
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.filter((d) => days.includes(d)).map((d) => DAY_LETTER[d]).join("");
}
function daysFull(days) {
  if (!days || !days.length) return "";
  if (days.length === 7) return "Every day";
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.filter((d) => days.includes(d)).map((d) => DAY_FULL[d]).join(", ");
}

// ---------- seed client records (generic: care client, resident, cleaning site) ----------
function seedClients() {
  const mk = (id, name, ref, addr, area, cName, cPhone, days, needs, keyInfo, notes, regular) =>
    ({ id, name, ref, addr, area, contact_name: cName, contact_phone: cPhone, days, needs, key_info: keyInfo, notes, regular_staff_id: regular, allocated: Boolean(regular) });
  return [
    mk("c1", "Mr J. Patel", "CL-1042", "12 Elm Court", "North", "Priya Patel (daughter)", "07811 220145", [1, 3, 5], ["Meds"], "Key safe 4471, front door", "Prefers morning calls. Diabetic — meds before breakfast.", "s1"),
    mk("c2", "Mrs D. Okonkwo", "CL-1043", "4 Birch Rise", "North", "Emeka Okonkwo (son)", "07811 220146", [1, 2, 3, 4, 5], ["Personal care"], "Ring bell twice, carer has key", "Hard of hearing on left side.", "s2"),
    mk("c3", "Mr R. Campbell", "CL-1044", "88 Oak Lane", "South", "Fiona Campbell (wife)", "07811 220147", [2, 4], ["Meds", "Driving"], "Parking on driveway only", "Needs lift to day centre Tue/Thu.", "s4"),
    mk("c4", "Ms L. Fenwick", "CL-1045", "2 Cedar Mews", "North", "Social worker: A. Bright", "07811 220148", [1, 3, 5], ["Dementia"], "Key safe 9820", "Gentle reminders, keep routine identical each visit.", "s1"),
    mk("c5", "Mr A. Simko", "CL-1046", "31 Maple Grove", "North", "Marta Simko (wife)", "07811 220149", [0, 3, 6], ["Wound care"], "Flat 3, buzzer 31", "Dressing change on schedule — district nurse Mondays.", "s5"),
    mk("c6", "Mrs P. Ncube", "CL-1047", "7 Willow Walk", "North", "Thabo Ncube (son)", "07811 220150", [1, 2, 3, 4, 5, 6, 0], ["Hoist"], "Key safe 2205, side gate", "Two-carer hoist call — never attempt alone.", "s2"),
    // Waiting for care — not yet allocated to anyone
    mk("c7", "Mr T. Bianchi", "CL-1048", "19 Ash Close", "East", "Self", "07811 220151", [2, 4, 6], ["Personal care"], "Knock loudly, slow to door", "Lives alone, values a chat.", null),
    mk("c8", "Mrs H. Kaur", "CL-1049", "5 Rowan Drive", "South", "Jaspreet Kaur (daughter)", "07811 220152", [1, 3, 5], ["Personal care", "Meals"], "Key safe 3390", "New referral — awaiting a regular carer.", null),
  ];
}

// ============================================================
//  SHARED DATA HOOK
//  Live mode: reads/writes Supabase + realtime, shared across
//  every device in the company. Demo mode: localStorage only.
// ============================================================
function useData(session) {
  const [staff, setStaff] = useState(() => load("cc_staff", SEED_STAFF));
  const [visits, setVisits] = useState(() => load("cc_visits", seedVisits()));
  const [clients, setClients] = useState(() => load("cc_clients", seedClients()));
  const [msgs, setMsgs] = useState(() => load("cc_msgs", [{ id: uid(), who: "System", text: "This is your live day. Report a call-off, pick up a visit, or mark one done — the whole team sees it.", at: nowISO() }]));
  const [absences, setAbsences] = useState(() => load("cc_absences", seedAbsences()));
  const [role, setRole] = useState("coordinator");   // coordinator | manager | carer
  const [myStaffId, setMyStaffId] = useState(null);
  const [joinCode, setJoinCode] = useState("DEMO-CODE");
  const agencyId = useRef(null);

  // demo persistence
  useEffect(() => { if (!LIVE) save("cc_staff", staff); }, [staff]);
  useEffect(() => { if (!LIVE) save("cc_visits", visits); }, [visits]);
  useEffect(() => { if (!LIVE) save("cc_clients", clients); }, [clients]);
  useEffect(() => { if (!LIVE) save("cc_msgs", msgs); }, [msgs]);
  useEffect(() => { if (!LIVE) save("cc_absences", absences); }, [absences]);

  // live load + realtime
  useEffect(() => {
    if (!LIVE || !session) return;
    let channel;
    (async () => {
      // who am I / which agency / role
      const { data: me } = await sb.from("members").select("agency_id,role,staff_id").eq("id", session.user.id).single();
      if (me) { agencyId.current = me.agency_id; setRole(me.role || "coordinator"); setMyStaffId(me.staff_id || null);
        const { data: ag } = await sb.from("agencies").select("join_code").eq("id", me.agency_id).single();
        if (ag?.join_code) setJoinCode(ag.join_code);
      }
      await refreshAll();
      // realtime: any change to shared tables refreshes everyone
      channel = sb.channel("cc")
        .on("postgres_changes", { event: "*", schema: "public", table: "visits" }, refreshAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "staff" }, refreshAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, refreshAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, refreshAll)
        .subscribe();
    })();
    return () => { if (channel) sb.removeChannel(channel); };
  }, [session]);

  async function refreshAll() {
    if (!LIVE) return;
    const [st, vi, cl, ms] = await Promise.all([
      sb.from("staff").select("*").order("name"),
      sb.from("visits").select("*").order("start_hour"),
      sb.from("clients").select("*").order("name"),
      sb.from("messages").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (st.data) setStaff(st.data.map(mapStaff));
    if (vi.data) setVisits(vi.data.map(mapVisit));
    if (cl.data) setClients(cl.data);
    if (ms.data) setMsgs(ms.data.map((m) => ({ id: m.id, who: m.who, text: m.text, at: m.created_at })));
  }

  // ---- writes (live -> Supabase, demo -> local state) ----
  async function saveClient(rec) {
    if (LIVE) {
      const row = { ...rec, agency_id: agencyId.current };
      if (rec.id && !String(rec.id).startsWith("c")) await sb.from("clients").update(row).eq("id", rec.id);
      else { delete row.id; await sb.from("clients").insert(row); }
      await refreshAll();
    } else {
      setClients((prev) => rec.id && prev.some((c) => c.id === rec.id)
        ? prev.map((c) => c.id === rec.id ? rec : c)
        : [...prev, { ...rec, id: rec.id || "c" + uid() }]);
    }
  }
  async function deleteClient(id) {
    if (LIVE) { await sb.from("clients").delete().eq("id", id); await refreshAll(); }
    else setClients((prev) => prev.filter((c) => c.id !== id));
  }
  async function patchVisit(id, patch, note) {
    setVisits((prev) => prev.map((v) => v.id === id ? { ...v, ...patch, history: note ? [...(v.history || []), { at: nowISO(), who: patch.staffId ?? v.staffId, note }] : v.history } : v));
    if (LIVE) {
      const row = { status: patch.status, staff_id: patch.staffId === undefined ? undefined : patch.staffId };
      await sb.from("visits").update(clean(row)).eq("id", id);
    }
  }
  async function postMsg(text, who = "You") {
    const m = { id: uid(), who, text, at: nowISO() };
    setMsgs((prev) => [m, ...prev]);
    if (LIVE) await sb.from("messages").insert({ agency_id: agencyId.current, who, text });
  }
  async function setStaffStatus(id, status) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
    if (LIVE) await sb.from("staff").update({ status }).eq("id", id);
  }
  // allocate a waiting client to a carer as their regular — does not affect anyone else
  async function allocateClient(clientId, staffId) {
    setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, regular_staff_id: staffId, allocated: true } : c));
    if (LIVE) await sb.from("clients").update({ regular_staff_id: staffId, allocated: true }).eq("id", clientId);
  }
  // book an absence (training/shadowing/course/leave/sickness) for a staff member
  async function addAbsence(rec) {
    const row = { ...rec, id: rec.id || "a" + uid() };
    setAbsences((prev) => [...prev, row]);
    if (LIVE) await sb.from("absences").insert({ agency_id: agencyId.current, staff_id: rec.staffId, type: rec.type, date: rec.date, note: rec.note });
  }
  async function removeAbsence(id) {
    setAbsences((prev) => prev.filter((a) => a.id !== id));
    if (LIVE) await sb.from("absences").delete().eq("id", id);
  }
  // record who worked which festive period, so next year flips automatically
  async function setFestive(staffId, year, worked) {
    setStaff((prev) => prev.map((s) => s.id === staffId ? { ...s, festive: { ...(s.festive || {}), [year]: worked } } : s));
    if (LIVE) { const s = staff.find((x) => x.id === staffId); const f = { ...(s?.festive || {}), [year]: worked }; await sb.from("staff").update({ festive: f }).eq("id", staffId); }
  }

  return { staff, visits, clients, msgs, absences, role, myStaffId, joinCode, saveClient, deleteClient, patchVisit, postMsg, setStaffStatus, allocateClient, addAbsence, removeAbsence, setFestive };
}
const isManager = (role) => role === "manager" || role === "coordinator";

// ============================================================
//  AUTO-ALLOCATION ENGINE
//  Matches clients WAITING for care to a carer with spare
//  capacity — local area first, then skills. NEVER removes a
//  client from their existing regular carer.
// ============================================================
function currentLoad(clients) {
  const load = {};
  clients.forEach((c) => { if (c.regular_staff_id) load[c.regular_staff_id] = (load[c.regular_staff_id] || 0) + 1; });
  return load;
}
// best carer for one waiting client; returns {staff, reason} or null
function bestCarerFor(client, staff, clients) {
  const load = currentLoad(clients);
  const hasCapacity = (s) => (load[s.id] || 0) < (s.capacity || 6);
  const qualified = (s) => (client.needs || []).every((n) => (s.skills || []).includes(n));
  const available = staff.filter((s) => s.status !== "off" && hasCapacity(s) && qualified(s));
  if (available.length === 0) return null;
  // local area first, then least loaded
  const local = available.filter((s) => s.area === client.area);
  const pool = local.length ? local : available;
  const pick = [...pool].sort((a, b) => (load[a.id] || 0) - (load[b.id] || 0))[0];
  return { staff: pick, reason: local.length ? `Local (${client.area}), spare capacity` : `Nearest available, spare capacity` };
}
// everything waiting, with its suggested carer
function allocationPlan(clients, staff) {
  return clients.filter((c) => !c.allocated && !c.regular_staff_id)
    .map((c) => ({ client: c, match: bestCarerFor(c, staff, clients) }));
}
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const mapStaff = (r) => ({ id: r.id, name: r.name, role: r.role, phone: r.phone, skills: r.skills || [], status: r.status || "off" });
const mapVisit = (r) => ({ id: r.id, client: r.client, client_id: r.client_id, addr: r.addr, date: r.date, start: r.start_hour, dur: r.dur, staffId: r.staff_id, skills: r.skills || [], status: r.status, days: r.days || [], history: r.history || [] });


// ============================================================
//  ROOT
// ============================================================
export function CareCoverApp() {
  const [session, setSession] = useState(null);
  const [demo, setDemo] = useState(false);
  const [booting, setBooting] = useState(true);
  const [entered, setEntered] = useState(false);

  // Actively remove the "Made in Bolt" badge — CSS alone can miss it,
  // so we also delete the element and keep watching in case it re-injects.
  useEffect(() => {
    const kill = () => {
      const nodes = document.querySelectorAll('a[href*="bolt.new"], a[href*="bolt.host"], [class*="bolt"], [id*="bolt"]');
      nodes.forEach((n) => {
        const t = (n.textContent || "").toLowerCase();
        if (t.includes("bolt") || (n.getAttribute("href") || "").includes("bolt")) {
          const box = n.closest("div") || n;
          try { box.remove(); } catch (e) { try { n.remove(); } catch (e2) {} }
        }
      });
    };
    kill();
    const iv = setInterval(kill, 1000);
    const obs = new MutationObserver(kill);
    try { obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    return () => { clearInterval(iv); obs.disconnect(); };
  }, []);

  useEffect(() => {
    if (!LIVE) { setBooting(false); return; }
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setBooting(false); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (booting) return <Splash />;
  if (!entered) return <Entrance onEnter={() => setEntered(true)} />;
  // Show the sign-in page after the doors. A test login lets you walk the whole app.
  if (!session && !demo) return <AuthGate onDemo={() => setDemo(true)} />;
  return <Studio session={session} />;
}

// ============================================================
//  ENTRANCE — teal doors that open with a soft chime
// ============================================================
function Entrance({ onEnter }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    // soft two-note chime on open (Web Audio, no file needed)
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5 E5 G5 — bright, welcoming
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        o.connect(g); g.connect(ctx.destination);
        const t = now + i * 0.14;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
        o.start(t); o.stop(t + 1.2);
      });
    } catch (e) {}
    setTimeout(() => setGone(true), 1400);
    setTimeout(onEnter, 1650);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(165deg, #12283e 0%, #0d1f31 50%, #091624 100%)", overflow: "hidden", fontFamily: UI, display: gone ? "none" : "block" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet" />
      <style>{`a[href*="bolt.new"],a[href*="bolt.host"][target="_blank"],[class*="bolt-badge"],[id*="bolt-badge"],.bolt-badge{display:none!important;visibility:hidden!important;}`}</style>

      {/* left door */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "50%", background: "linear-gradient(165deg, #12283e 0%, #0d1f31 50%, #091624 100%)", borderRight: `1px solid ${BRAND}55`, transform: opening ? "translateX(-100%)" : "translateX(0)", transition: "transform 1.35s cubic-bezier(.7,0,.2,1)", boxShadow: "inset -20px 0 40px rgba(0,0,0,.4)" }} />
      {/* right door */}
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "50%", background: "linear-gradient(165deg, #12283e 0%, #0d1f31 50%, #091624 100%)", borderLeft: `1px solid ${BRAND}55`, transform: opening ? "translateX(100%)" : "translateX(0)", transition: "transform 1.35s cubic-bezier(.7,0,.2,1)", boxShadow: "inset 20px 0 40px rgba(0,0,0,.4)" }} />

      {/* centre content sits above the doors, fades as they open */}
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", opacity: opening ? 0 : 1, transition: "opacity .5s ease", pointerEvents: opening ? "none" : "auto", padding: 20 }}>
        <div style={{ maxWidth: 380, width: "100%" }}>
          <div style={{ width: 116, height: 116, borderRadius: "50%", border: "2px solid #e8c96d", display: "grid", placeItems: "center", margin: "0 auto 26px", background: "radial-gradient(circle at 40% 34%, #123049, #0a1826)", boxShadow: "inset 0 0 22px rgba(0,0,0,.5)" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 72, lineHeight: 1, marginTop: 4, background: "linear-gradient(165deg,#f4e6c0,#c9a75e)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>C</span>
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: 1, lineHeight: 1, color: "#f4ead0" }}>CareCover</div>
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{ width: "78%", height: 28, margin: "14px auto 0", display: "block", stroke: "#e8c96d", fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }}><path d="M0 20 L95 20 L108 20 L116 16 L124 24 L132 4 L142 36 L150 20 L160 20 L168 14 L176 20 L300 20" /></svg>
          <div style={{ fontSize: 12, letterSpacing: 2.5, fontWeight: 800, color: "#c9d4de", marginTop: 20 }}>COMPLETE CARE WORKFORCE MANAGEMENT</div>
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{ width: "82%", height: 22, margin: "20px auto 0", display: "block", stroke: "#e8c96d", fill: "none", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" }}><path d="M0 20 L95 20 L108 20 L116 16 L124 24 L132 4 L142 36 L150 20 L160 20 L168 14 L176 20 L300 20" /></svg>
          <div style={{ fontFamily: DISPLAY, fontSize: 33, fontWeight: 800, letterSpacing: 0.4, color: "#f4ead0", marginTop: 36, lineHeight: 1.3 }}>Coordinated. Covered.</div>
          <div style={{ fontSize: 14.5, color: "#c9d4de", marginTop: 16, letterSpacing: 0.3, lineHeight: 1.5, maxWidth: 290, marginLeft: "auto", marginRight: "auto", fontWeight: 600 }}>Your agency's shifts, rotas, leave and team - managed together in one place.</div>
          <button onClick={open} style={{ marginTop: 36, width: 62, height: 62, borderRadius: "50%", border: "2px solid #e8c96d", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", marginLeft: "auto", marginRight: "auto" }} aria-label="Sign in">
            <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, stroke: "#e8c96d", fill: "none", strokeWidth: 2.2 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#c9d4de", fontWeight: 800, marginTop: 22 }}>SIGN IN</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  AUTH  (live mode only)
// ============================================================
function AuthGate({ onDemo }) {
  const [mode, setMode] = useState("in");   // in | up | join
  const [agency, setAgency] = useState("");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setErr(""); setBusy(true);
    try {
      if (mode === "up") {
        // Manager creates a new agency. A DB trigger reads this metadata to create
        // the agency row + a manager membership + a join code. (See setup SQL.)
        const { error } = await sb.auth.signUp({ email, password: pw, options: { data: { signup_kind: "agency", agency_name: agency, full_name: name, role: "manager", plan: "trial" } } });
        if (error) throw error;
      } else if (mode === "join") {
        // New staff joins an existing agency with its code. The trigger creates a
        // carer staff row in that agency, sets their area, and links the login.
        const { error } = await sb.auth.signUp({ email, password: pw, options: { data: { signup_kind: "staff", join_code: joinCode.trim().toUpperCase(), full_name: name, role: "carer", area } } });
        if (error) throw error;
      } else {
        if (!LIVE) { onDemo && onDemo(); return; }
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
    } catch (e) { setErr(e.message || "Something went wrong"); }
    setBusy(false);
  }

  const title = mode === "up" ? "Start your agency" : mode === "join" ? "Join your team" : "Welcome back";
  const subtitle = mode === "up" ? "3 days free. No card needed to start." : mode === "join" ? "Enter the code your coordinator gave you." : "Sign in to your desk.";
  const cta = busy ? "One moment…" : mode === "up" ? "Create agency account" : mode === "join" ? "Join team" : "Sign in";

  const on = "#f4ead0";              // cream-on-navy, matches the door
  const soft = "rgba(226,236,243,.72)";
  const fieldBg = "rgba(255,255,255,.92)";

  const Fld = ({ label, val, set, ph, type = "text" }) => (
    <div style={{ marginBottom: 13 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: on, marginBottom: 6, letterSpacing: .3 }}>{label}</div>
      <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} type={type}
        style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #2a4a68", background: fieldBg, borderRadius: 10, padding: "12px 14px", fontSize: 15, fontFamily: UI, color: INK, outline: "none" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg, #12283e 0%, #0d1f31 50%, #091624 100%)", fontFamily: UI, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 22px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: 400, margin: "8vh auto 40px" }}>

        {/* badge */}
        <div style={{ width: 88, height: 88, margin: "0 auto 18px", borderRadius: "50%", border: "2px solid #e8c96d", background: "radial-gradient(circle at 40% 34%, #123049, #0a1826)", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 700, background: "linear-gradient(165deg,#f4e6c0,#c9a75e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>C</span>
        </div>

        {/* wordmark */}
        <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, color: on, textAlign: "center", lineHeight: 1 }}>CareCover</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color: on, textAlign: "center", marginTop: 12, marginBottom: 26 }}>COMPLETE CARE WORKFORCE MANAGEMENT</div>

        {/* title */}
        <div style={{ fontFamily: DISPLAY, fontSize: 27, fontWeight: 800, color: on, textAlign: "center" }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: soft, textAlign: "center", marginTop: 5, marginBottom: 24 }}>{subtitle}</div>

        {(mode === "up" || mode === "join") && <Fld label="Your name" val={name} set={setName} ph="Full name" />}
        {mode === "up" && <Fld label="Agency name" val={agency} set={setAgency} ph="e.g. Bluebell Home Care" />}
        {mode === "join" && <Fld label="Join code" val={joinCode} set={setJoinCode} ph="e.g. BLUEBELL-4Q2" />}
        {mode === "join" && (
          <div style={{ marginBottom: 13 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: on, marginBottom: 6 }}>Your working area</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {AREAS.map((a) => (
                <button key={a} onClick={() => setArea(a)} style={{ border: `1.5px solid ${on}`, background: area === a ? "#e8c96d" : "transparent", color: area === a ? "#0d1f31" : on, borderRadius: 8, padding: "7px 13px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: UI }}>{a}</button>
              ))}
            </div>
          </div>
        )}
        <Fld label="Work email" val={email} set={setEmail} ph="you@agency.co.uk" type="email" />
        <Fld label="Password" val={pw} set={setPw} ph="Your password" type="password" />

        {err && <div style={{ background: REDSOFT, color: RED, fontSize: 13, fontWeight: 600, padding: "9px 12px", borderRadius: 9, marginBottom: 12 }}>{err}</div>}

        <button onClick={go} disabled={busy}
          style={{ width: "100%", border: "none", background: "#e8c96d", color: "#0d1f31", borderRadius: 11, padding: "14px 18px", fontSize: 15.5, fontWeight: 800, cursor: "pointer", fontFamily: UI, letterSpacing: .3, opacity: busy ? .6 : 1 }}>{cta}</button>

        <button onClick={() => onDemo && onDemo()}
          style={{ width: "100%", marginTop: 11, border: `2px solid ${on}`, background: "transparent", color: on, borderRadius: 11, padding: "13px 18px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: UI }}>Enter as test user &#8594;</button>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20, fontSize: 13.5, flexWrap: "wrap" }}>
          {mode !== "in" && <button onClick={() => { setMode("in"); setErr(""); }} style={{ border: "none", background: "transparent", color: on, fontWeight: 800, cursor: "pointer", fontFamily: UI, textDecoration: "underline" }}>Sign in</button>}
          {mode !== "up" && <button onClick={() => { setMode("up"); setErr(""); }} style={{ border: "none", background: "transparent", color: on, fontWeight: 800, cursor: "pointer", fontFamily: UI, textDecoration: "underline" }}>Start an agency</button>}
          {mode !== "join" && <button onClick={() => { setMode("join"); setErr(""); }} style={{ border: "none", background: "transparent", color: on, fontWeight: 800, cursor: "pointer", fontFamily: UI, textDecoration: "underline" }}>Join with a code</button>}
        </div>

        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 600, color: soft, marginTop: 20 }}>
          Managers start an agency. Carers join with the code their coordinator shares.
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  STUDIO  (the app)
// ============================================================
function Studio({ session }) {
  const D = useData(session);
  const { staff, visits, clients, msgs, role, myStaffId, joinCode } = D;
  const mgr = isManager(role);
  const [tab, setTab] = useState("board");
  const [coverFor, setCoverFor] = useState(null);
  const [toast, setToast] = useState(null);
  const ping = (t) => { setToast(t); setTimeout(() => setToast(null), 3400); };
  const staffById = (id) => staff.find((s) => s.id === id);

  // carers see only their own visits + clients; managers see all
  const myVisits = mgr ? visits : visits.filter((v) => v.staffId === myStaffId);
  const myClientIds = new Set(myVisits.map((v) => v.client_id).filter(Boolean));
  const myClients = mgr ? clients : clients.filter((c) => myClientIds.has(c.id));

  function findCover(visit) {
    const busy = {};
    visits.forEach((v) => { if (v.staffId) busy[v.staffId] = (busy[v.staffId] || 0) + 1; });
    return staff.filter((s) => s.status === "in" && s.id !== visit.staffId)
      .filter((s) => visit.skills.every((sk) => s.skills.includes(sk)))
      .sort((a, b) => (busy[a.id] || 0) - (busy[b.id] || 0));
  }
  function assignCover(visit, newId) {
    const s = staffById(newId);
    D.patchVisit(visit.id, { staffId: newId, status: "assigned" }, `Cover assigned to ${s?.name}`);
    D.postMsg(`${visit.client} at ${fmtTime(visit.start)} reassigned to ${s?.name} — cover confirmed.`, "System");
    ping(`Cover found — ${s?.name} is on ${visit.client}`); setCoverFor(null);
  }
  function leaveOpen(visit) {
    D.patchVisit(visit.id, { staffId: null, status: "open" }, "Call-off — left uncovered");
    D.postMsg(`${visit.client} at ${fmtTime(visit.start)} is UNCOVERED and needs a coordinator.`, "System");
    ping(`${visit.client} flagged uncovered`); setCoverFor(null);
  }
  function toggleStatus(id) {
    const s = staffById(id); const next = s.status === "in" ? "break" : s.status === "break" ? "off" : "in";
    D.setStaffStatus(id, next);
  }
  function pickUp(visit, byId) {
    const s = staffById(byId);
    D.patchVisit(visit.id, { staffId: byId, status: "assigned" }, `Picked up by ${s?.name}`);
    D.postMsg(`${s?.name} picked up ${visit.client} at ${fmtTime(visit.start)} — covered.`, "System");
    ping(`${s?.name} picked up ${visit.client} — covered`);
  }
  function markDone(visit) {
    const s = visit.staffId ? staffById(visit.staffId) : null;
    D.patchVisit(visit.id, { status: "done" }, "Marked completed");
    D.postMsg(`${visit.client} at ${fmtTime(visit.start)} completed${s ? ` by ${s.name}` : ""}.`, "System");
    ping(`${visit.client} marked done`);
  }

  // when a carer is booked absent, offer their day's visits to cover
  function coverForAbsence(staffId, date, type) {
    const affected = visits.filter((v) => v.staffId === staffId && v.status !== "done");
    affected.forEach((v) => D.patchVisit(v.id, { staffId: null, status: "open" }, `${type} booked — needs cover`));
    const s = staffById(staffId);
    if (affected.length) D.postMsg(`${s?.name} is on ${type} (${date}). ${affected.length} visit${affected.length > 1 ? "s" : ""} need cover — see the board.`, "System");
    else D.postMsg(`${s?.name} booked ${type} for ${date}.`, "System");
    ping(`${s?.name} booked ${type}${affected.length ? ` · ${affected.length} to cover` : ""}`);
  }

  const openCount = myVisits.filter((v) => v.status === "open").length;
  const agencyName = session?.user?.user_metadata?.agency_name || "Demo Agency";
  const waitingCount = clients.filter((c) => !c.allocated && !c.regular_staff_id).length;
  const tabs = mgr
    ? [["board", "Cover board"], ["allocate", "Allocate"], ["clients", "Clients"], ["team", "Team"], ["leave", "Leave & training"], ["rota", "Rota"], ["messages", "Messages"], ["guide", "Guide"], ["plans", "Plans"]]
    : [["board", "My visits"], ["clients", "My clients"], ["leave", "My leave"], ["messages", "Messages"], ["guide", "Guide"]];

  return (
    <Shell>
      <Header tabs={tabs} tab={tab} setTab={setTab} openCount={openCount} waitingCount={waitingCount} agencyName={agencyName} role={role} onSignOut={() => LIVE && sb.auth.signOut()} />
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "22px 18px 90px" }}>
        {!LIVE && <DemoRibbon />}
        {tab === "board" && <Board visits={myVisits} staff={staff} staffById={staffById} clients={clients} onCallOff={setCoverFor} onPickUp={pickUp} onDone={markDone} canManage={mgr} />}
        {tab === "allocate" && mgr && <Allocate clients={clients} staff={staff} onAllocate={(cid, sid, auto) => { D.allocateClient(cid, sid); const s = staff.find((x) => x.id === sid); const c = clients.find((x) => x.id === cid); D.postMsg(`${c?.name} allocated to ${s?.name}${auto ? " (auto, local area)" : ""}.`, "System"); ping(`${c?.name} → ${s?.name}`); }} />}
        {tab === "clients" && <Clients clients={myClients} canManage={mgr} onSave={D.saveClient} onDelete={D.deleteClient} ping={ping} />}
        {tab === "team" && mgr && <Team staff={staff} toggleStatus={toggleStatus} joinCode={joinCode} ping={ping} />}
        {tab === "leave" && <LeaveTraining absences={absences} staff={staff} canManage={mgr} myStaffId={myStaffId}
          onAdd={(rec) => { D.addAbsence(rec); coverForAbsence(rec.staffId, rec.date, rec.type); }}
          onRemove={D.removeAbsence} onSetFestive={D.setFestive} ping={ping} />}
        {tab === "rota" && mgr && <RotaGrid visits={visits} staff={staff} />}
        {tab === "messages" && <Messages msgs={msgs} onSend={(t) => D.postMsg(t)} />}
        {tab === "guide" && <Guide canManage={mgr} agencyName={agencyName} />}
        {tab === "plans" && mgr && <Plans ping={ping} />}
      </main>
      {coverFor && <CoverPanel visit={coverFor} candidates={findCover(coverFor)} onAssign={assignCover} onLeaveOpen={leaveOpen} onClose={() => setCoverFor(null)} />}
      {toast && <Toast text={toast} />}
    </Shell>
  );
}
const sys = (text) => ({ id: uid(), who: "System", text, at: nowISO() });

// ---------- header ----------
function Header({ tabs, tab, setTab, openCount, waitingCount, agencyName, role, onSignOut }) {
  const deskLabel = isManager(role) ? "Coordinator desk" : "Carer";
  return (
    <header style={{ background: CARD, borderBottom: `1px solid ${LINE}`, position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 18px", height: 64, display: "flex", alignItems: "center", gap: 22 }}>
        <Brand />
        <nav style={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
          {tabs.map(([k, label]) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} style={{
                border: "none", background: "transparent", cursor: "pointer", fontFamily: UI, fontSize: 14.5,
                fontWeight: on ? 700 : 500, color: on ? INK : MUTE, padding: "8px 12px", position: "relative",
              }}>
                {label}
                {k === "board" && openCount > 0 && (
                  <span style={{ marginLeft: 7, background: RED, color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 999, verticalAlign: "middle" }}>{openCount}</span>
                )}
                {k === "allocate" && waitingCount > 0 && (
                  <span style={{ marginLeft: 7, background: AMBER, color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 999, verticalAlign: "middle" }}>{waitingCount}</span>
                )}
                {on && <span style={{ position: "absolute", left: 12, right: 12, bottom: -21, height: 2, background: BRAND }} />}
              </button>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>{agencyName}</div>
            <div style={{ fontSize: 11, color: FAINT }}>{deskLabel}</div>
          </div>
          {onSignOut && <button onClick={onSignOut} style={ghostSm}>Sign out</button>}
        </div>
      </div>
    </header>
  );
}

// ---------- COVER BOARD (signature) ----------
function Board({ visits, staff, staffById, clients, onCallOff, onPickUp, onDone, canManage }) {
  const now = new Date();
  const cur = now.getHours() + now.getMinutes() / 60;
  const risk = (v) => v.status === "done" ? "done" : v.status === "open" ? "red" : (v.start - cur <= 1 && v.start - cur > 0) ? "amber" : "green";
  const rank = { red: 0, amber: 1, green: 2, done: 3 };
  const rows = [...visits].sort((a, b) => (rank[risk(a)] - rank[risk(b)]) || (a.start - b.start));
  const c = visits.reduce((a, v) => (a[risk(v)]++, a), { red: 0, amber: 0, green: 0, done: 0 });
  const freeIn = staff.filter((s) => s.status === "in");

  return (
    <div>
      <PageHead
        kicker="Live · today"
        title="Cover board"
        sub="Uncovered and imminent visits rise to the top. Report a call-off to find cover, pick up an open visit, or mark one done — everyone sees it live."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, maxWidth: 720 }}>
        <Metric n={c.red} label="Uncovered" tone={RED} soft={REDSOFT} />
        <Metric n={c.amber} label="Within the hour" tone={AMBER} soft={AMBERSOFT} />
        <Metric n={c.green} label="Covered" tone={GREEN} soft={GREENSOFT} />
        <Metric n={c.done} label="Done" tone={BRAND} soft={BRANDSOFT} />
      </div>

      <div style={{ display: "grid", gap: 9 }}>
        {rows.map((v) => {
          const r = risk(v);
          const done = r === "done";
          const tone = done ? BRAND : r === "red" ? RED : r === "amber" ? AMBER : GREEN;
          const soft = done ? BRANDSOFT : r === "red" ? REDSOFT : r === "amber" ? AMBERSOFT : GREENSOFT;
          const s = v.staffId ? staffById(v.staffId) : null;
          return (
            <div key={v.id} style={{ background: done ? PAPER : CARD, border: `1px solid ${LINE}`, borderRadius: 13, padding: "0", display: "flex", overflow: "hidden", opacity: done ? 0.85 : 1 }}>
              <div style={{ width: 5, background: tone }} />
              <div style={{ flex: 1, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ minWidth: 56 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, color: INK }}>{fmtTime(v.start)}</div>
                  <div style={{ fontSize: 12, color: FAINT }}>{v.dur} min</div>
                </div>
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                    <ClientLink v={v} client={clients?.find((c) => c.id === v.client_id)} />
                    <DayBadge days={v.days} />
                  </div>
                  <div style={{ fontSize: 13, color: MUTE }}>{v.addr}</div>
                  <div style={{ marginTop: 5, display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {v.skills.map((sk) => <span key={sk} style={chip}>{sk}</span>)}
                  </div>
                </div>
                <div style={{ minWidth: 150 }}>
                  {s ? <div style={{ fontSize: 14 }}><span style={{ color: FAINT }}>Carer</span><br /><b>{s.name}</b></div>
                    : <div style={{ fontSize: 14, color: RED, fontWeight: 700 }}>No carer assigned</div>}
                  <Pill tone={tone} soft={soft} text={done ? "✓ Done" : r === "red" ? "Uncovered" : r === "amber" ? "Starting soon" : "Covered"} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 128 }}>
                  {done ? (
                    <span style={{ fontSize: 13, color: BRAND, fontWeight: 700, textAlign: "center" }}>Completed</span>
                  ) : v.status === "open" ? (
                    <>
                      {canManage && <button onClick={() => onCallOff(v)} style={primarySm}>Find cover</button>}
                      <PickUp visit={v} carers={freeIn} onPickUp={onPickUp} />
                    </>
                  ) : (
                    <>
                      <button onClick={() => onDone(v)} style={{ ...primarySm, background: GREEN }}>Mark done</button>
                      {canManage && <button onClick={() => onCallOff(v)} style={outline}>Report call-off</button>}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- PICK UP (a carer claims an open visit) ----------
function PickUp({ visit, carers, onPickUp }) {
  const [open, setOpen] = useState(false);
  // Only carers with the required skills can pick it up.
  const able = carers.filter((s) => visit.skills.every((sk) => s.skills.includes(sk)));
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ ...outline, borderColor: GREEN, color: GREEN }}>Pick this up</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <Kicker text="Pick up visit" />
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 2px" }}>{visit.client} · {fmtTime(visit.start)}</div>
          <div style={{ fontSize: 14, color: MUTE, marginBottom: 16 }}>{visit.addr} · needs {visit.skills.join(", ") || "no special skills"}</div>
          <div style={{ fontSize: 13, color: MUTE, marginBottom: 8 }}>Who's taking it? (Signed-in carers pick themselves automatically in live mode.)</div>
          {able.length === 0 ? (
            <div style={{ background: AMBERSOFT, color: "#7a4708", borderRadius: 10, padding: 12, fontSize: 14 }}>No on-shift carer has the required skills yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {able.map((s) => (
                <button key={s.id} onClick={() => { onPickUp(visit, s.id); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 11, padding: "10px 12px", background: CARD, cursor: "pointer", fontFamily: UI, textAlign: "left" }}>
                  <Avatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, color: MUTE }}>{s.role}</div>
                  </div>
                  <span style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>Take it →</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ textAlign: "right", marginTop: 16 }}><button onClick={() => setOpen(false)} style={outline}>Cancel</button></div>
        </Modal>
      )}
    </>
  );
}

// ---------- COVER PANEL ----------
function CoverPanel({ visit, candidates, onAssign, onLeaveOpen, onClose }) {
  return (
    <Modal onClose={onClose}>
      <Kicker text="Call-off cover" />
      <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 2px" }}>{visit.client}</div>
      <div style={{ fontSize: 14, color: MUTE, marginBottom: 18 }}>{fmtTime(visit.start)} · {visit.addr} · needs {visit.skills.join(", ") || "no special skills"}</div>

      {candidates.length === 0 ? (
        <div style={{ background: REDSOFT, border: `1px solid ${RED}`, color: "#7a271a", borderRadius: 11, padding: 14, fontSize: 14 }}>
          No qualified carer is clocked in right now. Leave it uncovered and it stays at the top of the board, in red, until you fill it.
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: MUTE, marginBottom: 8 }}>Clocked in, qualified, least busy first</div>
          <div style={{ display: "grid", gap: 8 }}>
            {candidates.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 11, padding: "10px 12px" }}>
                <Avatar name={s.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: MUTE }}>{s.role} · {s.skills.join(", ")}</div>
                </div>
                <button onClick={() => onAssign(visit, s.id)} style={primarySm}>Assign</button>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button onClick={() => onLeaveOpen(visit)} style={danger}>Leave uncovered</button>
        <button onClick={onClose} style={outline}>Cancel</button>
      </div>
    </Modal>
  );
}

// ---------- ALLOCATE (auto-coordination of clients waiting for care) ----------
function Allocate({ clients, staff, onAllocate }) {
  const plan = allocationPlan(clients, staff);
  const load = currentLoad(clients);
  function autoAll() {
    plan.forEach(({ client, match }) => { if (match) onAllocate(client.id, match.staff.id, true); });
  }
  return (
    <div>
      <PageHead kicker="Auto-coordination" title="Clients waiting for care"
        sub="New clients are matched to a carer with spare capacity in their local area. Existing clients are never moved — this only fills free capacity." />
      {plan.length === 0 ? (
        <div style={{ background: GREENSOFT, border: `1px solid #a6e9c8`, color: "#065f41", borderRadius: 12, padding: 16, fontSize: 14.5 }}>
          Everyone waiting has been allocated. New referrals will appear here automatically.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 14, color: MUTE }}>{plan.length} client{plan.length > 1 ? "s" : ""} waiting</div>
            <button onClick={autoAll} style={primary}>Auto-allocate all</button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {plan.map(({ client, match }) => (
              <div key={client.id} style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 190 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{client.name}</span>
                    <span style={{ fontSize: 11.5, background: BRANDSOFT, color: BRANDDK, padding: "2px 9px", borderRadius: 999, fontWeight: 700 }}>{client.area}</span>
                    <DayBadge days={client.days} />
                  </div>
                  <div style={{ fontSize: 13, color: MUTE }}>{client.addr}</div>
                  <div style={{ marginTop: 5, display: "flex", gap: 5, flexWrap: "wrap" }}>{(client.needs || []).map((n) => <span key={n} style={chip}>{n}</span>)}</div>
                </div>
                <div style={{ minWidth: 200 }}>
                  {match ? (
                    <>
                      <div style={{ fontSize: 12.5, color: FAINT }}>Suggested carer</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 3 }}>
                        <Avatar name={match.staff.name} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{match.staff.name}</div>
                          <div style={{ fontSize: 12, color: MUTE }}>{match.reason} · {load[match.staff.id] || 0}/{match.staff.capacity} clients</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 13.5, color: AMBER, fontWeight: 700 }}>No carer free in area with these skills</div>
                  )}
                </div>
                {match ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={() => onAllocate(client.id, match.staff.id, true)} style={primarySm}>Allocate</button>
                    <ManualPick client={client} staff={staff} load={load} onAllocate={onAllocate} />
                  </div>
                ) : (
                  <ManualPick client={client} staff={staff} load={load} onAllocate={onAllocate} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function ManualPick({ client, staff, load, onAllocate }) {
  const [open, setOpen] = useState(false);
  const eligible = staff.filter((s) => s.status !== "off" && (client.needs || []).every((n) => (s.skills || []).includes(n)));
  return (
    <>
      <button onClick={() => setOpen(true)} style={outline}>Choose carer</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <Kicker text="Allocate client" />
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 2px" }}>{client.name}</div>
          <div style={{ fontSize: 14, color: MUTE, marginBottom: 16 }}>{client.area} · {client.addr} · needs {(client.needs || []).join(", ") || "no special skills"}</div>
          {eligible.length === 0 ? (
            <div style={{ background: AMBERSOFT, color: "#7a4708", borderRadius: 10, padding: 12, fontSize: 14 }}>No qualified carer available.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {eligible.map((s) => (
                <button key={s.id} onClick={() => { onAllocate(client.id, s.id, false); setOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 11, padding: "10px 12px", background: CARD, cursor: "pointer", fontFamily: UI, textAlign: "left" }}>
                  <Avatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, color: MUTE }}>{s.area} · {load[s.id] || 0}/{s.capacity} clients · {s.skills.join(", ")}</div>
                  </div>
                  <span style={{ color: BRAND, fontWeight: 700, fontSize: 14 }}>Assign →</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ textAlign: "right", marginTop: 16 }}><button onClick={() => setOpen(false)} style={outline}>Cancel</button></div>
        </Modal>
      )}
    </>
  );
}

// ---------- LEAVE & TRAINING (absences + automatic festive rotation) ----------
function LeaveTraining({ absences, staff, canManage, myStaffId, onAdd, onRemove, onSetFestive, ping }) {
  const [adding, setAdding] = useState(false);
  const staffById = (id) => staff.find((s) => s.id === id);
  const year = new Date().getFullYear();
  const mine = canManage ? absences : absences.filter((a) => a.staffId === myStaffId);
  const upcoming = [...mine].sort((a, b) => a.date.localeCompare(b.date));
  const plan = festivePlan(staff, year);

  return (
    <div>
      <PageHead kicker={canManage ? "Workforce" : "Your time"} title={canManage ? "Leave & training" : "My leave & training"}
        sub={canManage ? "Book training, shadowing, courses, leave or sickness. The person's visits for that day are sent to the cover board automatically." : "Your booked training, courses and leave."} />

      {canManage && (
        <div style={{ marginBottom: 18 }}>
          <button onClick={() => setAdding(true)} style={primary}>+ Book absence</button>
        </div>
      )}

      <div style={{ display: "grid", gap: 9, marginBottom: 30 }}>
        {upcoming.length === 0 && <div style={{ color: MUTE, fontSize: 14 }}>Nothing booked.</div>}
        {upcoming.map((a) => {
          const s = staffById(a.staffId); const tone = ABSENCE_TONE[a.type] || MUTE;
          return (
            <div key={a.id} style={{ background: CARD, border: `1px solid ${LINE}`, borderLeft: `4px solid ${tone}`, borderRadius: 12, padding: "12px 15px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ minWidth: 96 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{new Date(a.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontWeight: 700 }}>{s?.name || "—"}</div>
                {a.note && <div style={{ fontSize: 13, color: MUTE }}>{a.note}</div>}
              </div>
              <span style={{ background: tone + "18", color: tone, fontSize: 12.5, fontWeight: 700, padding: "3px 11px", borderRadius: 999 }}>{a.type}</span>
              {canManage && <button onClick={() => { onRemove(a.id); ping("Absence removed"); }} style={ghostSm}>Remove</button>}
            </div>
          );
        })}
      </div>

      {canManage && (
        <>
          <PageHead kicker="Automatic" title={`Christmas & New Year ${year}`}
            sub="Worked Christmas last year? You're off this year and on for New Year — and it flips again next year. Set once, and it self-manages." />
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", background: PAPER, borderBottom: `1px solid ${LINE}`, fontSize: 12.5, fontWeight: 700, color: MUTE }}>
              <div style={{ padding: "11px 14px" }}>Carer</div>
              <div style={{ padding: "11px 14px", textAlign: "center" }}>Christmas Day</div>
              <div style={{ padding: "11px 14px", textAlign: "center" }}>New Year</div>
            </div>
            {plan.map(({ staff: s, worksXmas, worksNY, lastYear }) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>
                <div style={{ padding: "11px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: FAINT }}>{lastYear ? `Last year: worked ${lastYear === "xmas" ? "Christmas" : "New Year"}` : "No history yet — set it below"}</div>
                </div>
                <div style={{ padding: "10px 14px", textAlign: "center" }}>
                  {worksXmas === null
                    ? <button onClick={() => onSetFestive(s.id, year, "xmas")} style={festBtn}>Set working</button>
                    : <FestTag on={worksXmas} label={worksXmas ? "Working" : "Off"} />}
                </div>
                <div style={{ padding: "10px 14px", textAlign: "center" }}>
                  {worksNY === null
                    ? <button onClick={() => onSetFestive(s.id, year, "ny")} style={festBtn}>Set working</button>
                    : <FestTag on={worksNY} label={worksNY ? "Working" : "Off"} />}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: FAINT, marginTop: 10 }}>Once a carer has a year recorded, next year flips automatically — no need to decide again.</div>
        </>
      )}

      {adding && <BookAbsence staff={staff} onClose={() => setAdding(false)} onSave={(rec) => { onAdd(rec); setAdding(false); }} />}
    </div>
  );
}
function FestTag({ on, label }) {
  return <span style={{ background: on ? AMBERSOFT : GREENSOFT, color: on ? AMBER : GREEN, fontSize: 12.5, fontWeight: 700, padding: "4px 13px", borderRadius: 999 }}>{label}</span>;
}
const festBtn = { border: `1px solid ${LINE}`, background: CARD, color: SUBINK, borderRadius: 8, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: UI };

function BookAbsence({ staff, onClose, onSave }) {
  const [staffId, setStaffId] = useState(staff[0]?.id || "");
  const [type, setType] = useState(ABSENCE_TYPES[0]);
  const [date, setDate] = useState(todayKey());
  const [note, setNote] = useState("");
  return (
    <Modal onClose={onClose}>
      <Kicker text="Book absence" />
      <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 14px" }}>Training, leave or sickness</div>
      <div style={{ marginBottom: 13 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 5 }}>Staff member</div>
        <select value={staffId} onChange={(e) => setStaffId(e.target.value)} style={selectStyle}>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 13 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 6 }}>Type</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ABSENCE_TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ border: `1px solid ${type === t ? (ABSENCE_TONE[t]) : LINE}`, background: type === t ? ABSENCE_TONE[t] : CARD, color: type === t ? "#fff" : SUBINK, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: UI }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 13 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 5 }}>Date</div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={selectStyle} />
      </div>
      <Field label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Moving & handling refresher" />
      <div style={{ background: BRANDSOFT, color: BRANDDK, borderRadius: 10, padding: "10px 13px", fontSize: 13, margin: "6px 0 16px" }}>
        Their visits that day will be sent to the cover board so other carers can pick them up.
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose} style={outline}>Cancel</button>
        <button onClick={() => onSave({ staffId, type, date, note })} style={primary}>Book & cover visits</button>
      </div>
    </Modal>
  );
}
const selectStyle = { width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "11px 13px", fontSize: 14.5, fontFamily: UI, outline: "none", background: PAPER };

// ---------- CLIENTS (editable records; managers edit, carers read their own) ----------
function Clients({ clients, canManage, onSave, onDelete, ping }) {
  const [editing, setEditing] = useState(null); // record or {} for new
  const [q, setQ] = useState("");
  const list = clients.filter((c) => (c.name + " " + (c.ref || "") + " " + (c.addr || "")).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHead kicker={canManage ? "Records" : "Your clients"} title={canManage ? "Clients" : "My clients"}
        sub={canManage ? "The people or sites you serve. Add, edit, and keep key info in one place — shared live with your team." : "The clients on your visits. Tap a name to see their care details and key info."} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, reference or address…"
          style={{ flex: 1, minWidth: 220, border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 13px", fontSize: 14, fontFamily: UI, outline: "none", background: CARD }} />
        {canManage && <button onClick={() => setEditing({})} style={primary}>+ New client</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {list.map((c) => (
          <div key={c.id} style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: FAINT }}>{c.ref || "No reference"}</div>
              </div>
              <DayBadge days={c.days} />
            </div>
            <div style={{ fontSize: 13, color: MUTE, marginTop: 8 }}>{c.addr}</div>
            {c.needs?.length > 0 && <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>{c.needs.map((n) => <span key={n} style={chip}>{n}</span>)}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => setEditing({ ...c, view: !canManage })} style={{ ...outline, flex: 1 }}>{canManage ? "Open & edit" : "Open record"}</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div style={{ color: MUTE, fontSize: 14 }}>No matching clients.</div>}
      </div>
      {editing && <ClientEditor rec={editing} canManage={canManage && !editing.view} onSave={(r) => { onSave(r); setEditing(null); ping("Client saved"); }} onDelete={onDelete ? (id) => { onDelete(id); setEditing(null); ping("Client removed"); } : null} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ClientEditor({ rec, canManage, onSave, onDelete, onClose }) {
  const [f, setF] = useState({
    id: rec.id, name: rec.name || "", ref: rec.ref || "", addr: rec.addr || "",
    contact_name: rec.contact_name || "", contact_phone: rec.contact_phone || "",
    days: rec.days || [], needs: (rec.needs || []).join(", "), key_info: rec.key_info || "", notes: rec.notes || "", link: rec.link || "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleDay = (d) => set("days", f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d]);
  const ro = !canManage;
  function submit() {
    onSave({ ...rec, ...f, needs: f.needs.split(",").map((s) => s.trim()).filter(Boolean) });
  }
  return (
    <Modal onClose={onClose}>
      <Kicker text={ro ? "Client record" : rec.id ? "Edit client" : "New client"} />
      <div style={{ maxHeight: "68vh", overflowY: "auto", paddingRight: 4 }}>
        {ro ? (
          <>
            <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 2px" }}>{f.name}</div>
            <div style={{ fontSize: 14, color: MUTE, marginBottom: 14 }}>{f.ref} · {f.addr}</div>
            <FileRow label="Visit days" value={daysFull(f.days) || "—"} />
            <FileRow label="Care needs" value={f.needs || "—"} />
            <FileRow label="Contact" value={f.contact_name ? `${f.contact_name} · ${f.contact_phone}` : "—"} />
            <FileRow label="Key info / access" value={f.key_info || "—"} />
            <div style={{ padding: "10px 0" }}>
              <div style={{ fontSize: 13, color: MUTE, marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 14, color: INK, whiteSpace: "pre-wrap" }}>{f.notes || "—"}</div>
            </div>
          </>
        ) : (
          <>
            <Field label="Full name" value={f.name} onChange={(v) => set("name", v)} placeholder="e.g. Mr J. Patel / Oakfield Office" />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Field label="Reference" value={f.ref} onChange={(v) => set("ref", v)} placeholder="CL-1042" /></div>
            </div>
            <Field label="Address" value={f.addr} onChange={(v) => set("addr", v)} placeholder="12 Elm Court" />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Field label="Contact name" value={f.contact_name} onChange={(v) => set("contact_name", v)} placeholder="Next of kin / site contact" /></div>
              <div style={{ flex: 1 }}><Field label="Contact phone" value={f.contact_phone} onChange={(v) => set("contact_phone", v)} placeholder="07…" /></div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 6 }}>Visit days</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <button key={d} onClick={() => toggleDay(d)} style={{
                    width: 36, height: 36, borderRadius: 9, cursor: "pointer", fontFamily: UI, fontWeight: 700, fontSize: 14,
                    border: `1px solid ${f.days.includes(d) ? BRAND : LINE}`, background: f.days.includes(d) ? BRAND : CARD, color: f.days.includes(d) ? "#fff" : SUBINK,
                  }}>{DAY_LETTER[d]}</button>
                ))}
              </div>
            </div>
            <Field label="Care needs / requirements (comma separated)" value={f.needs} onChange={(v) => set("needs", v)} placeholder="Meds, Hoist, Dementia" />
            <Field label="Key info / access" value={f.key_info} onChange={(v) => set("key_info", v)} placeholder="Key safe code, entry notes, allergies" />
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 5 }}>Notes</div>
              <textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
                style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "11px 13px", fontSize: 14.5, fontFamily: UI, outline: "none", background: PAPER, resize: "vertical" }} />
            </div>
            <Field label="External record link (optional)" value={f.link} onChange={(v) => set("link", v)} placeholder="https://…" />
          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 8 }}>
        {ro ? <span /> : (rec.id && onDelete ? <button onClick={() => onDelete(rec.id)} style={danger}>Delete</button> : <span />)}
        <div style={{ display: "flex", gap: 8 }}>
          {f.link && <button onClick={() => window.open(f.link, "_blank")} style={outline}>Open external</button>}
          <button onClick={onClose} style={outline}>{ro ? "Close" : "Cancel"}</button>
          {!ro && <button onClick={submit} style={primary}>Save client</button>}
        </div>
      </div>
    </Modal>
  );
}

// ---------- TEAM ----------
function Team({ staff, toggleStatus, joinCode, ping }) {
  const tone = { in: GREEN, break: AMBER, off: FAINT };
  const soft = { in: GREENSOFT, break: AMBERSOFT, off: CANVAS };
  const label = { in: "On shift", break: "On break", off: "Off" };
  const inCount = staff.filter((s) => s.status === "in").length;
  const [invite, setInvite] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <PageHead kicker="Live" title="Team" sub={`${inCount} on shift now. Tap a card to change status — only ‘on shift’ carers are offered for cover.`} />
        <button onClick={() => setInvite(true)} style={primary}>+ Invite carers</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 12 }}>
        {staff.map((s) => (
          <button key={s.id} onClick={() => toggleStatus(s.id)} style={{ textAlign: "left", background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, padding: 15, cursor: "pointer", fontFamily: UI }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar name={s.name} big />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: MUTE }}>{s.role}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: soft[s.status], color: tone[s.status], fontSize: 12.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>● {label[s.status]}</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
              {s.skills.map((sk) => <span key={sk} style={chip}>{sk}</span>)}
            </div>
          </button>
        ))}
      </div>
      {invite && (
        <Modal onClose={() => setInvite(false)}>
          <Kicker text="Invite carers" />
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 10px" }}>Add your team</div>
          <div style={{ fontSize: 14, color: MUTE, marginBottom: 16 }}>Share this join code with your carers. They go to your CareCover link, tap <b>Join with a code</b>, enter it, pick their area — and they're in. They'll only ever see their own visits and clients.</div>
          <div style={{ fontSize: 12.5, color: FAINT, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>YOUR JOIN CODE</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1, background: BRANDSOFT, border: `1.5px dashed ${BRAND}`, borderRadius: 11, padding: "14px 16px", fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, color: BRANDDK, textAlign: "center", letterSpacing: 1 }}>{joinCode}</div>
            <button onClick={() => { try { navigator.clipboard.writeText(joinCode); ping("Join code copied"); } catch { ping("Code: " + joinCode); } }} style={primary}>Copy</button>
          </div>
          <div style={{ marginTop: 16, background: CANVAS, borderRadius: 10, padding: "12px 14px", fontSize: 13.5, color: SUBINK }}>
            <b>How your carer joins:</b><br/>
            1. Open your CareCover link<br/>
            2. Tap <b>Join with a code</b><br/>
            3. Enter <b>{joinCode}</b>, their name, and choose their area<br/>
            4. Done — they appear here in your Team.
          </div>
          <div style={{ textAlign: "right", marginTop: 16 }}><button onClick={() => setInvite(false)} style={outline}>Close</button></div>
        </Modal>
      )}
    </div>
  );
}
function RotaGrid({ visits, staff }) {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  return (
    <div>
      <PageHead kicker="Today" title="Rota" sub="One row per carer. Empty cells are gaps you can fill." />
      <div style={{ overflowX: "auto", background: CARD, border: `1px solid ${LINE}`, borderRadius: 13 }}>
        <div style={{ minWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: `170px repeat(${hours.length},1fr)`, borderBottom: `1px solid ${LINE}`, background: PAPER }}>
            <div style={{ padding: "11px 12px", fontSize: 12, fontWeight: 700, color: MUTE }}>Carer</div>
            {hours.map((h) => <div key={h} style={{ padding: "11px 6px", fontSize: 12, color: FAINT, textAlign: "center" }}>{fmtTime(h)}</div>)}
          </div>
          {staff.map((s, i) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: `170px repeat(${hours.length},1fr)`, borderBottom: i === staff.length - 1 ? "none" : `1px solid ${LINE}` }}>
              <div style={{ padding: "11px 12px", fontSize: 13.5, fontWeight: 600 }}>{s.name}</div>
              {hours.map((h) => {
                const v = visits.find((x) => x.staffId === s.id && x.start === h);
                return (
                  <div key={h} style={{ padding: 5, borderLeft: `1px solid ${PAPER}` }}>
                    {v && <div style={{ background: BRANDSOFT, color: BRANDDK, borderRadius: 7, padding: "5px 7px", fontSize: 11.5, fontWeight: 600 }}>{surname(v.client)}</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- MESSAGES ----------
function Messages({ msgs, onSend }) {
  const [text, setText] = useState("");
  const send = () => { if (!text.trim()) return; onSend(text.trim()); setText(""); };
  return (
    <div style={{ maxWidth: 720 }}>
      <PageHead kicker="Team" title="Messages" sub="One thread for the whole agency. Every call-off and cover is posted here automatically." />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message the team…"
          style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 10, padding: "11px 13px", fontSize: 14, fontFamily: UI, outline: "none", background: CARD }} />
        <button onClick={send} style={primary}>Send</button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {msgs.map((m) => {
          const sysMsg = m.who === "System";
          return (
            <div key={m.id} style={{ background: sysMsg ? BRANDSOFT : CARD, border: `1px solid ${sysMsg ? "#bde3ec" : LINE}`, borderRadius: 11, padding: "10px 13px" }}>
              <div style={{ fontSize: 12, color: sysMsg ? BRANDDK : MUTE, fontWeight: 700, marginBottom: 2 }}>{m.who}</div>
              <div style={{ fontSize: 14, color: INK }}>{m.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- GUIDE (how-to handbook) ----------
function Guide({ canManage, agencyName }) {
  const [open, setOpen] = useState(0);
  const sections = canManage ? [
    { t: "Getting started", b: [
      "You're the manager/coordinator for " + (agencyName || "your agency") + ". You see everything; carers see only their own visits and clients.",
      "Add your carers by sharing your join code (Team → invite, or from your dashboard). They register themselves and pick their working area.",
      "Add your clients in the Clients tab — name, address, area, visit days, needs, key info.",
    ]},
    { t: "The Cover board — your day at a glance", b: [
      "Every visit for today, with uncovered ones in red at the top, imminent ones amber, covered ones green.",
      "Report a call-off on any visit → the app shows qualified, available carers, least busy first → assign in one tap.",
      "If nobody's free, leave it uncovered and it stays red at the top until you fill it.",
      "Mark a visit Done when it's completed, so you can see what's outstanding versus finished.",
    ]},
    { t: "Allocating new clients", b: [
      "New clients waiting for care appear in the Allocate tab with a count badge.",
      "The app suggests the best carer — local area first, then skills, then who has spare capacity.",
      "Tap Auto-allocate all, or choose a carer manually. Existing clients are never moved off their regular carer.",
    ]},
    { t: "Leave, training & holidays", b: [
      "Book any carer out for Training, Shadowing, a Course, Annual leave or Sickness.",
      "Their visits for that day are sent straight to the Cover board so others can pick them up.",
      "Christmas & New Year rotate fairly and automatically — work one this year, you're off it next year.",
    ]},
    { t: "Messaging & records", b: [
      "The Messages tab is one thread for the whole team. Every call-off, cover and completed visit posts here automatically.",
      "Client records hold key info, access codes and notes — tap a client name anywhere to open the record.",
    ]},
    { t: "Billing", b: [
      "Your plan is on the Plans tab. Start on the free trial; upgrade when you're ready.",
      "Plans scale by team size — Starter, Agency, Multi-branch.",
    ]},
  ] : [
    { t: "Welcome", b: [
      "You're signed in as a carer. You see your own visits and your own clients — nothing else.",
      "Set yourself On shift when you start, On break, or Off — only On-shift carers get offered cover.",
    ]},
    { t: "Your visits", b: [
      "My visits shows your day in order. Tap a client's name to open their record — address, key info, and notes.",
      "If a visit needs cover and you can take it, tap Pick this up — it becomes yours and the team is told.",
      "Tap Mark done when you finish a visit.",
    ]},
    { t: "Your clients & messages", b: [
      "My clients holds the records for the people you visit — key info, access codes, care needs.",
      "Messages is the team thread — you'll see cover requests and updates here.",
    ]},
    { t: "Your leave", b: [
      "My leave shows any training, courses or time off your coordinator has booked for you.",
    ]},
  ];
  return (
    <div style={{ maxWidth: 760 }}>
      <PageHead kicker="Handbook" title="How to use CareCover" sub="Everything you need, in plain steps. Tap a section to open it." />
      <div style={{ display: "grid", gap: 10 }}>
        {sections.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, overflow: "hidden" }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", textAlign: "left", border: "none", background: isOpen ? BRANDSOFT : CARD, cursor: "pointer", fontFamily: UI, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 15.5, color: INK }}>{i + 1}. {s.t}</span>
                <span style={{ color: BRAND, fontSize: 18, fontWeight: 700 }}>{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "6px 18px 16px" }}>
                  {s.b.map((line, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <span style={{ color: BRAND, fontWeight: 800, flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: 14.5, color: SUBINK, lineHeight: 1.5 }}>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, background: BRANDSOFT, border: `1px solid #bde3ec`, borderRadius: 12, padding: "14px 16px", fontSize: 14, color: BRANDDK }}>
        Need a hand? Email <b>SupportCareCover@gmail.com</b> and we'll help you get set up.
      </div>
    </div>
  );
}

// ---------- PLANS ----------
function Plans({ ping }) {
  const plans = [
    { name: "Starter", price: "£19", cap: "Up to 15 staff", feats: ["Cover board & rota", "Call-off cover finder", "Team messaging", "Visit tasks"] },
    { name: "Agency", price: "£39", cap: "Up to 30 staff", best: true, feats: ["Everything in Starter", "Auto-cover by skill & availability", "Uncovered-visit alerts", "Full reassignment history"] },
    { name: "Multi-branch", price: "£89", cap: "Up to 60 staff, then £3 each", feats: ["Everything in Agency", "Multiple branches", "Coverage-gap forecasting", "Priority support"] },
  ];
  return (
    <div>
      <PageHead kicker="Simple pricing" title="Plans" sub="3-day free trial. Cancel anytime." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: CARD, border: `1.5px solid ${p.best ? BRAND : LINE}`, borderRadius: 15, padding: 22, position: "relative", boxShadow: p.best ? "0 8px 30px rgba(14,116,144,.10)" : "none" }}>
            {p.best && <div style={{ position: "absolute", top: -11, left: 22, background: BRAND, color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "3px 11px", borderRadius: 999 }}>Most popular</div>}
            <div style={{ fontWeight: 800, fontSize: 17 }}>{p.name}</div>
            <div style={{ margin: "9px 0" }}>
              <span style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 600 }}>{p.price}</span>
              <span style={{ color: MUTE, fontWeight: 600 }}>/mo</span>
            </div>
            <div style={{ fontSize: 13, color: MUTE, marginBottom: 15 }}>{p.cap}</div>
            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              {p.feats.map((f) => <div key={f} style={{ fontSize: 14, display: "flex", gap: 9 }}><Check /><span>{f}</span></div>)}
            </div>
            {(() => {
              const url = STRIPE_LINKS[p.name];
              const go = () => {
                if (url) window.open(url, "_blank");
                else ping("Add your Stripe payment link for this plan to go live");
              };
              return <button onClick={go} style={{ ...(p.best ? primary : outline), width: "100%" }}>{url ? "Start free trial" : "Start free trial"}</button>;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  PRIMITIVES
// ============================================================
function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: PAPER, color: INK, fontFamily: UI }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet" />
      <style>{`
        /* hide the Made in Bolt badge */
        a[href*="bolt.new"], a[href*="bolt.host"][target="_blank"],
        [class*="bolt-badge"], [id*="bolt-badge"],
        .bolt-badge, div[style*="Made in Bolt"] { display: none !important; visibility: hidden !important; }
      `}</style>
      {children}
    </div>
  );
}
function Brand({ big }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: big ? 40 : 30, height: big ? 40 : 30, borderRadius: 9, background: `linear-gradient(135deg,${BRAND},${BRANDDK})`, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: big ? 20 : 16, boxShadow: "0 2px 8px rgba(14,116,144,.35)" }}>C</div>
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: big ? 26 : 19, letterSpacing: -0.3, color: INK, lineHeight: 1 }}>CareCover</div>
        {big && <div style={{ fontSize: 12.5, color: MUTE, marginTop: 3 }}>Cover, sorted — before it becomes a crisis.</div>}
      </div>
    </div>
  );
}
function Splash() {
  return <Shell><div style={{ display: "grid", placeItems: "center", height: "100vh" }}><Brand big /></div></Shell>;
}
function DemoRibbon() {
  return (
    <div style={{ background: AMBERSOFT, border: `1px solid #fdd9a0`, color: "#7a4708", borderRadius: 11, padding: "10px 14px", fontSize: 13.5, marginBottom: 18 }}>
      <b>Demo mode.</b> You're running on sample data saved to this browser. Add your Supabase keys to switch on real logins and live data shared across the whole agency.
    </div>
  );
}
function PageHead({ kicker, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {kicker && <Kicker text={kicker} />}
      <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, letterSpacing: -0.4, color: INK, marginTop: 2 }}>{title}</div>
      {sub && <div style={{ fontSize: 14.5, color: MUTE, marginTop: 5, maxWidth: 640 }}>{sub}</div>}
    </div>
  );
}
function Kicker({ text }) {
  return <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: BRAND }}>{text}</div>;
}
function Metric({ n, label, tone, soft }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 13, padding: "13px 15px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 30, background: soft, color: tone, borderRadius: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, padding: "0 6px" }}>{n}</div>
      <div style={{ fontSize: 13, color: MUTE, marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  );
}
function Pill({ tone, soft, text }) {
  return <span style={{ display: "inline-block", marginTop: 6, background: soft, color: tone, fontSize: 12, fontWeight: 700, padding: "2px 9px", borderRadius: 999 }}>{text}</span>;
}
function ClientLink({ v, client }) {
  const [open, setOpen] = useState(false);
  const c = client || {};
  return (
    <>
      <button onClick={() => setOpen(true)} title="Open client record"
        style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: UI, fontWeight: 700, fontSize: 15, color: BRAND, textDecoration: "underline", textUnderlineOffset: 2, textDecorationColor: "#b8dde6" }}>
        {v.client}
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <Kicker text="Client record" />
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, margin: "3px 0 2px" }}>{v.client}</div>
          <div style={{ fontSize: 14, color: MUTE, marginBottom: 16 }}>{c.ref ? c.ref + " · " : ""}{v.addr}</div>
          <div style={{ maxHeight: "62vh", overflowY: "auto", paddingRight: 4 }}>
            <FileRow label="This visit" value={`${fmtTime(v.start)} · ${v.dur} min`} />
            <FileRow label="Visit days" value={daysFull(c.days || v.days) || "—"} />
            <FileRow label="Care needs" value={(c.needs || v.skills || []).join(", ") || "None recorded"} />
            <FileRow label="Contact" value={c.contact_name ? `${c.contact_name} · ${c.contact_phone || ""}` : "—"} />
            <FileRow label="Key info / access" value={c.key_info || "—"} />
            {c.notes && (
              <div style={{ padding: "10px 0" }}>
                <div style={{ fontSize: 13, color: MUTE, marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 14, color: INK, whiteSpace: "pre-wrap" }}>{c.notes}</div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            {c.link ? <button onClick={() => window.open(c.link, "_blank")} style={primarySm}>Open external record</button> : <span style={{ fontSize: 12.5, color: FAINT }}>Full record in Clients tab</span>}
            <button onClick={() => setOpen(false)} style={outline}>Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}
function FileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "9px 0", borderBottom: `1px solid ${LINE}` }}>
      <span style={{ fontSize: 13, color: MUTE }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: INK, textAlign: "right" }}>{value}</span>
    </div>
  );
}
function DayBadge({ days }) {
  const short = daysShort(days);
  if (!short) return null;
  return (
    <span title={daysFull(days)} style={{ fontFamily: UI, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: BRANDDK, background: BRANDSOFT, padding: "2px 8px", borderRadius: 6 }}>
      {short}
    </span>
  );
}
function Avatar({ name, big }) {
  const sz = big ? 42 : 34;
  return <div style={{ width: sz, height: sz, borderRadius: "50%", background: BRANDSOFT, color: BRANDDK, display: "grid", placeItems: "center", fontWeight: 800, fontSize: big ? 17 : 14 }}>{name[0]}</div>;
}
function Check() {
  return <span style={{ display: "grid", placeItems: "center", width: 18, height: 18, borderRadius: "50%", background: GREENSOFT, color: GREEN, fontSize: 11, fontWeight: 900, flexShrink: 0 }}>✓</span>;
}
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: SUBINK, marginBottom: 5 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "11px 13px", fontSize: 14.5, fontFamily: UI, outline: "none", background: PAPER }} />
    </div>
  );
}
function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,.5)", display: "grid", placeItems: "center", zIndex: 60, padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: CARD, borderRadius: 18, padding: 24, width: "100%", maxWidth: 450, boxShadow: "0 24px 70px rgba(16,24,40,.28)" }}>{children}</div>
    </div>
  );
}
function Toast({ text }) {
  return <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", background: INK, color: "#fff", padding: "12px 20px", borderRadius: 11, fontSize: 14, fontWeight: 600, zIndex: 70, boxShadow: "0 10px 34px rgba(0,0,0,.32)" }}>{text}</div>;
}

// ---------- button + chip styles ----------
const primary = { border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: UI, background: BRAND, color: "#fff" };
const primarySm = { ...primary, padding: "9px 15px", fontSize: 14 };
const outline = { border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 15px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: UI, background: CARD, color: SUBINK };
const ghostSm = { border: `1px solid ${LINE}`, borderRadius: 9, padding: "7px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: UI, background: CARD, color: MUTE };
const danger = { border: `1px solid ${RED}`, borderRadius: 10, padding: "9px 15px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: UI, background: "#fff", color: RED };
const link = { border: "none", background: "transparent", color: BRAND, fontWeight: 700, cursor: "pointer", fontFamily: UI, fontSize: 14 };
const chip = { fontSize: 11.5, background: CANVAS, color: SUBINK, padding: "2px 8px", borderRadius: 6, fontWeight: 600 };
