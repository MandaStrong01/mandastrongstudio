#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/MandaStrong1/mandastrong_studio"
TEMPLATES="$APP_DIR/templates"
STATIC="$APP_DIR/static"

echo "MANDASTRONG STUDIO — BLACK & PURPLE DAVINCI STYLE — 21 PAGE MOVIE APP — DEPLOYING"

# 1. CLEAN REBUILD
rm -rf "$APP_DIR"
mkdir -p "$TEMPLATES" "$STATIC/css" "$STATIC/js" "$STATIC/video" "$STATIC/uploads" "$STATIC/projects" "$STATIC/community"

# 2. VIDEOS
curl -L -f --retry 5 -o "$STATIC/video/background.mp4" "https://github.com/mandastrong1/cinecraft/raw/main/static/video/background.mp4" || true
curl -L -f --retry 5 -o "$STATIC/video/avatar.mp4" "https://github.com/mandastrong1/cinecraft/raw/main/static/video/avatar.mp4" || true
curl -L -f --retry 5 -o "$STATIC/video/thatsallfolks.mp4" "https://github.com/mandastrong1/cinecraft/raw/main/static/video/thatsallfolks.mp4" || true

# 3. CSS — BLACK & PURPLE DAVINCI STYLE
cat > "$STATIC/css/style.css" <<'CSS'
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; background:#0a0a0a; color:#e0b0ff; font-family:'Helvetica Neue',Arial,sans-serif; overflow:hidden; }
.bg-video { position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1; filter:brightness(0.4); }
.header { background:rgba(10,10,20,0.95); color:#d8b4ff; text-align:center; padding:20px; font-weight:900; font-size:2.2rem; letter-spacing:2px; text-shadow:0 0 20px #a855f7; border-bottom:2px solid #a855f7; }
.btn { background:#1a0033; color:#e0b0ff; padding:14px 30px; margin:10px; border:2px solid #a855f7; border-radius:50px; cursor:pointer; font-weight:900; text-decoration:none; display:inline-block; transition:0.3s; box-shadow:0 0 15px #9333ea; }
.btn:hover { background:#a855f7; color:#000; transform:scale(1.05); }
.container { padding:40px; text-align:center; height: calc(100vh - 150px); overflow-y: auto; }
.footer { position:fixed; bottom:0; width:100%; background:rgba(10,10,20,0.9); padding:10px; text-align:center; color:#c084fc; border-top:1px solid #a855f7; font-size:0.8rem; }
CSS

# 4. APP.PY — (FIXED SYNTAX FOR DEPLOYMENT)
cat > "$APP_DIR/app.py" <<'PY'
from flask import Flask, render_template, request, redirect, flash, session, send_from_directory
import sqlite3, re, os, uuid, json

app = Flask(__name__)
app.secret_key = 'mandastrong2025_final'
DB = 'users.db'

def init_db():
    with sqlite3.connect(DB) as c:
        c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, plan TEXT)')
        try:
            c.execute('INSERT INTO users (username,password,plan) VALUES (?,?,?)', ('MandaStrong1', 'MandaStrong1@123', 'studio'))
        except: pass

init_db()

@app.route('/')
def home():
    return render_template('page1.html')

@app.route('/page/<int:n>')
def page(n):
    if 1 <= n <= 21:
        return render_template(f'page{n}.html')
    return 'Page not found', 404

@app.route('/subscribe/<plan>')
def subscribe(plan):
    session['plan'] = plan
    return redirect('/page/4')

if __name__ == '__main__':
    app.run(debug=True)
PY

# 5. GENERATE 21 PAGES
for i in {1..21}; do
    NEXT=$((i+1))
    BACK=$((i-1))
    cat > "$TEMPLATES/page$i.html" <<HTML
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <title>MandaStrong Studio - Page $i</title>
</head>
<body>
    <video autoplay muted loop class="bg-video"><source src="{{ url_for('static', filename='video/background.mp4') }}" type="video/mp4"></video>
    <div class="header">MANDASTRONG'S STUDIO</div>
    <div class="container">
        <h1>PAGE $i: THE MOVIE MAKER</h1>
        <p>An All-In-One Make A Movie App! (2.5 Hours Duration Capability)</p>
        <div style="margin-top:50px;">
            ${BACK:+"<a href='/page/$BACK' class='btn'>BACK</a>"}
            ${NEXT:+"<a href='/page/$NEXT' class='btn'>NEXT / CONTINUE</a>"}
        </div>
    </div>
    <div class="footer">MandaStrong1 2025 – Author Of Doxy The School Bully – MandaStrong1@Etsy.com</div>
</body>
</html>
HTML
done

echo "DEPLOYMENT READY: 21 PAGES GENERATED IN BLACK & PURPLE."