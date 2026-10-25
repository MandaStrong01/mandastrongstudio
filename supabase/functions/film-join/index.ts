// Film joiner: the app uploads its finished scenes + narration here, a GitHub
// server joins them into ONE film file with ffmpeg, and the app gets a download link.
// App calls are signed in with the user's login. The joiner proves who it is with a
// GitHub sign-in token that only this repository's workflow can get, so no shared
// password is stored anywhere.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.9.6";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const J = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const BUCKET = "films";
const REPO = "mandastrong01/mandastrongstudio";
const GH = createRemoteJWKSet(new URL("https://token.actions.githubusercontent.com/.well-known/jwks"));
const safe = (n: string) => String(n || "").replace(/[^\w.\-]/g, "_").slice(0, 120);

async function appUser(req: Request) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!t) return null;
  const { data } = await db.auth.getUser(t);
  return data?.user || null;
}
async function isJoiner(req: Request) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  try {
    const { payload } = await jwtVerify(t, GH, { issuer: "https://token.actions.githubusercontent.com", audience: "film-join" });
    return String(payload.repository || "").toLowerCase() === REPO;
  } catch (_) { return false; }
}
const upUrl = async (path: string) => { const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true }); if (error) throw error; return data.signedUrl; };
const downUrl = async (path: string, secs: number, download?: string) => { const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, secs, download ? { download } : undefined); if (error) throw error; return data.signedUrl; };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const b = await req.json().catch(() => ({}));
    const a = String(b.action || "");

    // ── the GitHub joiner ──
    if (a.startsWith("runner_")) {
      if (!(await isJoiner(req))) return J({ error: "not allowed" }, 401);
      if (a === "runner_claim") {
        // a job stuck "running" for 6 hours is put back in the queue
        await db.from("film_jobs").update({ status: "queued", progress: "Starting again" }).eq("status", "running").lt("updated_at", new Date(Date.now() - 6 * 3600e3).toISOString());
        const { data: q } = await db.from("film_jobs").select("*").eq("status", "queued").order("created_at").limit(1);
        const job = q && q[0];
        if (!job) return J({ job: null });
        const { data: took } = await db.from("film_jobs").update({ status: "running", progress: "The film server has started", updated_at: new Date().toISOString() }).eq("id", job.id).eq("status", "queued").select();
        if (!took || !took.length) return J({ job: null });
        const base = job.user_id + "/" + job.id + "/in/";
        const { data: files } = await db.storage.from(BUCKET).list(base, { limit: 1000 });
        const inputs: Record<string, string> = {};
        for (const f of files || []) inputs[f.name] = await downUrl(base + f.name, 6 * 3600);
        return J({ job: { id: job.id, plan: job.plan, inputs } });
      }
      const { data: job } = await db.from("film_jobs").select("*").eq("id", b.jobId).single();
      if (!job) return J({ error: "no such job" }, 404);
      const out = job.user_id + "/" + job.id + "/out/";
      if (a === "runner_progress") { await db.from("film_jobs").update({ progress: String(b.text || "").slice(0, 200), updated_at: new Date().toISOString() }).eq("id", job.id); return J({ ok: true }); }
      if (a === "runner_upload") return J({ url: await upUrl(out + safe(b.name)) });
      if (a === "runner_finish") {
        if (b.error) await db.from("film_jobs").update({ status: "failed", error: String(b.error).slice(0, 500), updated_at: new Date().toISOString() }).eq("id", job.id);
        else await db.from("film_jobs").update({ status: "done", outputs: (b.outputs || []).map(safe), progress: "Your film is ready", updated_at: new Date().toISOString() }).eq("id", job.id);
        return J({ ok: true });
      }
      return J({ error: "unknown action" }, 400);
    }

    // ── the app ──
    const user = await appUser(req);
    if (!user) return J({ error: "Log in first." }, 401);
    if (a === "start") {
      const { data, error } = await db.from("film_jobs").insert({ user_id: user.id, status: "uploading", progress: "Sending your scenes" }).select().single();
      if (error) throw error;
      return J({ jobId: data.id });
    }
    const { data: job } = await db.from("film_jobs").select("*").eq("id", b.jobId).eq("user_id", user.id).single();
    if (!job) return J({ error: "That film job wasn't found." }, 404);
    if (a === "upload_urls") {
      const urls: Record<string, string> = {};
      for (const n of (b.names || []).slice(0, 400)) urls[n] = await upUrl(user.id + "/" + job.id + "/in/" + safe(n));
      return J({ urls });
    }
    if (a === "submit") {
      await db.from("film_jobs").update({ status: "queued", plan: b.plan || {}, progress: "Waiting for the film server (usually 5 to 15 minutes)", updated_at: new Date().toISOString() }).eq("id", job.id);
      return J({ ok: true });
    }
    if (a === "status") {
      const r: Record<string, unknown> = { status: job.status, progress: job.progress, error: job.error };
      if (job.status === "done") {
        const outs: string[] = job.outputs || [];
        const name = safe((job.plan && job.plan.fileName) || "My_Film.mp4");
        r.parts = outs.length;
        r.urls = await Promise.all(outs.map((o: string) => downUrl(user.id + "/" + job.id + "/out/" + o, 7 * 24 * 3600, outs.length === 1 ? name : undefined)));
        r.fileName = name;
      }
      return J(r);
    }
    return J({ error: "unknown action" }, 400);
  } catch (e) { return J({ error: String((e as Error)?.message || e) }, 500); }
});
