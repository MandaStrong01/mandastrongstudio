#!/usr/bin/env python3
"""Mandas Film & Music Studio - film joiner.

Runs on a GitHub server. Takes the scenes, narration and music a user's app
uploaded, and joins them into ONE film file with ffmpeg:
  title card -> every scene in order, each held so the picture lasts as long
  as the voice -> credits. Voice on top, music underneath, captions as a
  subtitle track you can switch on or off.
Then uploads the finished film so the app can show a download link.
"""
import json, os, re, shutil, subprocess, sys, time, urllib.request, urllib.error

API = "https://wvkqnrqcnoztajxxzyxc.supabase.co/functions/v1/film-join"
PART = 45 * 1024 * 1024
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


# ── talking to the app's server ──────────────────────────────────────
def gh_token():
    url = os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"] + "&audience=film-join"
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]})
    return json.load(urllib.request.urlopen(req, timeout=30))["value"]


def call(action, **body):
    body["action"] = action
    for attempt in range(4):
        try:
            req = urllib.request.Request(API, data=json.dumps(body).encode(), method="POST",
                                         headers={"Content-Type": "application/json", "Authorization": "Bearer " + gh_token()})
            return json.load(urllib.request.urlopen(req, timeout=120))
        except Exception as e:  # network blips: try again
            log("call failed", action, e)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("Could not reach the app server")


def download(url, path):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=300) as r, open(path, "wb") as f:
                shutil.copyfileobj(r, f, 1 << 20)
            return
        except Exception as e:
            log("download failed", path, e)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("Could not download " + os.path.basename(path))


def upload(url, path):
    size = os.path.getsize(path)
    with open(path, "rb") as f:
        req = urllib.request.Request(url, data=f, method="PUT", headers={"Content-Type": "video/mp4", "x-upsert": "true", "Content-Length": str(size)})
        try:
            urllib.request.urlopen(req, timeout=3600).read()
            return True
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="ignore")
            log("upload refused", e.code, msg[:300])
            if e.code in (400, 413) and re.search(r"size|large|exceed", msg, re.I):
                return False
            raise


# ── ffmpeg helpers ───────────────────────────────────────────────────
def run(cmd):
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if p.returncode != 0:
        raise RuntimeError("ffmpeg: " + p.stderr[-600:])
    return p


def ff(*args):
    return run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])


def dur(path):
    p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], stdout=subprocess.PIPE, text=True)
    try:
        return float(p.stdout.strip())
    except ValueError:
        return 0.0


def has_audio(path):
    p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", path], stdout=subprocess.PIPE, text=True)
    return bool(p.stdout.strip())


def has_video(path):
    p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=index", "-of", "csv=p=0", path], stdout=subprocess.PIPE, text=True)
    return bool(p.stdout.strip())


def join_parts(names, src, dst):
    with open(dst, "wb") as out:
        for n in names:
            with open(os.path.join(src, n), "rb") as f:
                shutil.copyfileobj(f, out, 1 << 20)
    return dst


def enc_v(W, H, fps):
    return ["-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-r", str(fps),
            "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "160k"]


def text_card(path, W, H, secs, lines, fps, work, big=True):
    """A dark card with gold title and light lines under it."""
    flt = []
    for k, ln in enumerate(lines[:10]):
        tf = os.path.join(work, "card_%d_%d.txt" % (abs(hash(path)) % 9999, k))
        open(tf, "w").write(ln)
        size = int(H * (0.09 if (k == 0 and big) else 0.045 if k == 0 else 0.032))
        color = "0xE6C98E" if k == 0 else "0xF3EDE2"
        y = "h*0.40" if k == 0 else "h*0.53+%d" % int((k - 1) * H * 0.05)
        font = FONT_B if k == 0 else FONT
        flt.append("drawtext=fontfile=%s:textfile=%s:fontcolor=%s:fontsize=%d:x=(w-text_w)/2:y=%s" % (font, tf, color, size, y))
    vf = ",".join(flt + ["fade=in:0:d=0.6", "fade=out:st=%.2f:d=0.6" % max(0, secs - 0.6)]) if flt else "null"
    ff("-f", "lavfi", "-i", "color=c=0x0E0F12:s=%dx%d:d=%.2f:r=%d" % (W, H, secs, fps),
       "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", "%.2f" % secs,
       "-vf", vf, *enc_v(W, H, fps), "-shortest", path)


def make_segment(src, out, L, W, H, fps, tint, watermark, keep_audio, cvol, work, i):
    """One scene, held for L seconds. Short clips play forward then backward, so a loop never jumps."""
    look = "scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,setsar=1,fps=%d" % (W, H, W, H, fps)
    post = []
    if tint and tint[3] > 0:
        post.append("drawbox=x=0:y=0:w=iw:h=ih:color=0x%02X%02X%02X@%.3f:t=fill" % (int(tint[0]), int(tint[1]), int(tint[2]), float(tint[3])))
    if watermark:
        post.append("drawtext=fontfile=%s:text='Mandas Film & Music Studio':fontcolor=white@0.55:fontsize=%d:x=w*0.03:y=h*0.94" % (FONT, int(H * 0.03)))
    fd = min(0.5, L / 4)
    post += ["fade=in:0:d=%.2f" % fd, "fade=out:st=%.2f:d=%.2f" % (L - fd, fd), "format=yuv420p"]
    d = dur(src)
    audio = keep_audio and has_audio(src)
    if audio or d >= L - 0.05:
        # long enough (or has its own sound): use it as it is, looped if needed
        a_in = ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]
        amap = ["-map", "0:a:0", "-af", "volume=%.3f" % cvol] if audio else ["-map", "1:a"]
        ff("-stream_loop", "-1", "-i", src, *a_in, "-t", "%.3f" % L,
           "-filter_complex", "[0:v]%s,%s[v]" % (look, ",".join(post)), "-map", "[v]", *amap, *enc_v(W, H, fps), out)
        return
    pp = os.path.join(work, "pp_%03d.mp4" % i)
    # forward + backward, normalised first so every scene matches
    ff("-i", src, "-an", "-filter_complex", "[0:v]%s,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" % look,
       "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", pp)
    ff("-stream_loop", "-1", "-i", pp, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", "%.3f" % L,
       "-filter_complex", "[0:v]%s[v]" % ",".join(post), "-map", "[v]", "-map", "1:a", *enc_v(W, H, fps), out)
    os.remove(pp)


def srt_time(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return "%02d:%02d:%06.3f" % (h, m, s)


def write_srt(path, text, start, total):
    sents = [s.strip() for s in re.findall(r"[^.!?]+[.!?]*", re.sub(r"\s+", " ", text or "")) if s.strip()]
    chars = sum(len(s) for s in sents) or 1
    t = start
    with open(path, "w") as f:
        for k, s in enumerate(sents):
            d = total * len(s) / chars
            f.write("%d\n%s --> %s\n%s\n\n" % (k + 1, srt_time(t).replace(".", ","), srt_time(t + d).replace(".", ","), s))
            t += d


# ── one film ─────────────────────────────────────────────────────────
def build(plan, ind, work, progress):
    W, H, fps = int(plan.get("W", 1920)), int(plan.get("H", 1080)), int(plan.get("fps", 30))
    scenes = [s for s in plan.get("scenes", []) if os.path.exists(os.path.join(ind, s["file"])) and has_video(os.path.join(ind, s["file"]))]
    if not scenes:
        raise RuntimeError("No scenes arrived")

    # voice: your recording, then the engine's ending if there is one
    voice = None
    vparts = []
    for key in ("narr", "tail"):
        names = plan.get(key) or []
        if names:
            p = join_parts(names, ind, os.path.join(work, key + ".bin"))
            if dur(p) > 0.5:
                vparts.append(p)
    if vparts:
        progress("Preparing the narration")
        voice = os.path.join(work, "voice.wav")
        ins = []
        for p in vparts:
            ins += ["-i", p]
        chain = "".join("[%d:a]aresample=48000,aformat=channel_layouts=stereo[a%d];" % (k, k) for k in range(len(vparts)))
        chain += "".join("[a%d]" % k for k in range(len(vparts))) + "concat=n=%d:v=0:a=1[c]" % len(vparts)
        if plan.get("compact", True):
            # long dead air (more than 2.5 seconds) is shortened to 1 second
            chain += ";[c]silenceremove=stop_periods=-1:stop_duration=2.5:stop_threshold=-45dB:stop_silence=1[c2]"
        else:
            chain += ";[c]anull[c2]"
        chain += ";[c2]loudnorm=I=-16:TP=-1.5:LRA=11[o]"
        ff(*ins, "-filter_complex", chain, "-map", "[o]", "-ar", "48000", "-ac", "2", voice)
    vdur = dur(voice) if voice else 0
    total = vdur if vdur > 1 else float(plan.get("minutes", 5)) * 60
    L = max(3.0, total / len(scenes))
    log("voice %.1fs, %d scenes of %.2fs" % (vdur, len(scenes), L))

    segs = []
    title = (plan.get("title") or "").strip()
    tsecs = 3.0 if title else 0.0
    if title:
        p = os.path.join(work, "seg_title.mp4"); text_card(p, W, H, tsecs, [title, plan.get("kind", "")], fps, work); segs.append(p)
    for i, s in enumerate(scenes):
        progress("Joining scene %d of %d" % (i + 1, len(scenes)))
        p = os.path.join(work, "seg_%03d.mp4" % i)
        make_segment(os.path.join(ind, s["file"]), p, L, W, H, fps, plan.get("tint"), plan.get("watermark"), s.get("audio"), float(plan.get("cVol", 0.5)), work, i)
        segs.append(p)
    cr = plan.get("credits") or {}
    if cr.get("on"):
        lines = [cr.get("title") or title or "The End"] + list(cr.get("lines") or [])[:8] + ["Made with Mandas Film & Music Studio"]
        p = os.path.join(work, "seg_credits.mp4"); text_card(p, W, H, max(6.0, len(lines) * 1.5 + 2), lines, fps, work, big=False); segs.append(p)

    progress("Putting the scenes together")
    lst = os.path.join(work, "list.txt")
    open(lst, "w").write("".join("file '%s'\n" % p for p in segs))
    body = os.path.join(work, "body.mp4")
    ff("-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", body)
    bdur = dur(body)

    progress("Mixing voice and music")
    ins = ["-i", body]
    chain = "[0:a]anull[c]"
    mix = ["[c]"]
    k = 1
    if voice:
        ins += ["-i", voice]
        ms = int(tsecs * 1000)
        chain += ";[%d:a]adelay=%d|%d,volume=%.3f[v]" % (k, ms, ms, float(plan.get("vVol", 1))); mix.append("[v]"); k += 1
    music = None
    mnames = (plan.get("music") or {}).get("files") or []
    if mnames:
        music = join_parts(mnames, ind, os.path.join(work, "music.bin"))
    elif (plan.get("music") or {}).get("url"):
        music = os.path.join(work, "music.dl")
        try:
            download(plan["music"]["url"], music)
        except Exception:
            music = None
    if music and dur(music) > 1:
        ins += ["-stream_loop", "-1", "-i", music]
        mv = float(plan.get("mVol", 0.3)) * (0.45 if (plan.get("duck", True) and voice) else 1)
        chain += ";[%d:a]aresample=48000,volume=%.3f,afade=t=out:st=%.2f:d=3[m]" % (k, mv, max(0, bdur - 3)); mix.append("[m]"); k += 1
    chain += ";" + "".join(mix) + "amix=inputs=%d:duration=first:normalize=0,alimiter=limit=0.95[a]" % len(mix)
    subs = []
    if plan.get("subs") and plan.get("subsText") and voice:
        srt = os.path.join(work, "subs.srt"); write_srt(srt, plan["subsText"], tsecs, vdur)
        ins += ["-i", srt]; subs = ["-map", "%d:s" % k, "-c:s", "mov_text", "-metadata:s:s:0", "language=eng"]
    out = os.path.join(work, "film.mp4")
    ff(*ins, "-filter_complex", chain, "-map", "0:v", "-map", "[a]", *subs, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
       "-t", "%.3f" % bdur, "-movflags", "+faststart", out)
    log("film %.1f min, %.1f MB" % (dur(out) / 60, os.path.getsize(out) / 1e6))
    return out


def process(job):
    jid = job["id"]
    work = os.path.abspath("work_" + jid[:8]); ind = os.path.join(work, "in")
    shutil.rmtree(work, ignore_errors=True); os.makedirs(ind)
    progress = lambda t: (log(t), call("runner_progress", jobId=jid, text=t))
    try:
        progress("Collecting your scenes")
        for n, u in job["inputs"].items():
            download(u, os.path.join(ind, n))
        film = build(job.get("plan") or {}, ind, work, progress)
        progress("Saving your film")
        if upload(call("runner_upload", jobId=jid, name="film.mp4")["url"], film):
            outs = ["film.mp4"]
        else:
            # the storage limit is set below the film's size: send it in pieces
            outs = []
            with open(film, "rb") as f:
                k = 0
                while True:
                    chunk = f.read(PART)
                    if not chunk:
                        break
                    pn = "film.part%03d" % k
                    pp = os.path.join(work, pn); open(pp, "wb").write(chunk)
                    if not upload(call("runner_upload", jobId=jid, name=pn)["url"], pp):
                        raise RuntimeError("Storage refused the film")
                    os.remove(pp); outs.append(pn); k += 1
        call("runner_finish", jobId=jid, outputs=outs)
        log("done", jid)
    except Exception as e:
        log("failed", jid, e)
        call("runner_finish", jobId=jid, error=str(e)[:480])
    finally:
        shutil.rmtree(work, ignore_errors=True)


def main():
    start = time.time()
    idle = 0
    # keep going while there is work; wait a little for jobs submitted just now
    while time.time() - start < 5 * 3600:
        job = call("runner_claim").get("job")
        if job:
            idle = 0
            process(job)
            continue
        idle += 1
        if idle > 3:
            break
        time.sleep(40)
    log("no more films to join")


if __name__ == "__main__":
    if len(sys.argv) == 4 and sys.argv[1] == "--local":
        # local test: python film_join.py --local plan.json inputdir
        plan = json.load(open(sys.argv[2]))
        w = os.path.abspath("work_local"); shutil.rmtree(w, ignore_errors=True); os.makedirs(w)
        print(build(plan, sys.argv[3], w, log))
    else:
        main()
