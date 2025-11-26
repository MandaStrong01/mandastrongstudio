# MandaStrong Studio - PythonAnywhere Deployment Guide

## Directory Structure on PythonAnywhere

Your files should be organized like this:

```
/home/MandaStrong1/mandastrong_studio/
├── app.py                          # Main Flask application
├── templates/                      # HTML templates
│   ├── page1.html
│   ├── page2.html
│   ├── page3.html
│   ├── pages4-9.html
│   ├── page10.html
│   ├── pages11-20.html
│   └── page21.html
├── static/
│   ├── css/
│   │   └── style.css              # Global cinematic theme
│   └── video/
│       ├── background.mp4         # Ocean looping background
│       ├── avatar.mp4             # Talking avatar video
│       ├── packageDTSBexpscript.mp4
│       ├── DTSBmovie.mp4          # Doxy: The School Bully film
│       └── ThatsAllFolks.mp4      # Finale
```

## Step 1: Upload Files to PythonAnywhere

1. **Upload the Flask app**:
   - Copy `flask_app.py` to `/home/MandaStrong1/mandastrong_studio/app.py`

2. **Upload templates**:
   - Copy all files from `flask_templates/` to `/home/MandaStrong1/mandastrong_studio/templates/`

3. **Upload CSS**:
   - Copy `flask_static/css/style.css` to `/home/MandaStrong1/mandastrong_studio/static/css/style.css`

4. **Video files are already in place** at:
   - `/home/MandaStrong1/mandastrong_studio/static/video/`

## Step 2: Update app.py for PythonAnywhere

Your `app.py` should look like this:

```python
from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return redirect(url_for('page', n=1))

@app.route('/page/<int:n>')
def page(n):
    if n < 1 or n > 21:
        return redirect(url_for('page', n=1))

    if n == 1:
        return render_template('page1.html')
    elif n == 2:
        return render_template('page2.html')
    elif n == 3:
        return render_template('page3.html')
    elif 4 <= n <= 9:
        return render_template('pages4-9.html', page_num=n)
    elif n == 10:
        return render_template('page10.html')
    elif 11 <= n <= 20:
        return render_template('pages11-20.html', page_num=n)
    elif n == 21:
        return render_template('page21.html')

    return redirect(url_for('page', n=1))

@app.route('/login')
def login():
    return "Login page - Coming soon!"

@app.route('/register')
def register():
    return "Register page - Coming soon!"

if __name__ == '__main__':
    app.run(debug=False)
```

## Step 3: Configure WSGI File

Your `/var/www/mandastrong1_pythonanywhere_com_wsgi.py` should be:

```python
import sys
import os

path = '/home/MandaStrong1/mandastrong_studio'
if path not in sys.path:
    sys.path.insert(0, path)

from app import app as application
```

## Step 4: Reload Your Web App

1. Go to the **Web** tab in PythonAnywhere
2. Click the **Reload** button for `mandastrong1.pythonanywhere.com`

## Step 5: Test Your App

Visit: `https://mandastrong1.pythonanywhere.com`

You should see:
- **Page 1**: Ocean background with "MANDASTRONG'S STUDIO" title, avatar video with play button
- **Navigation**: All 21 pages accessible via Back/Next buttons
- **Page 10**: Doxy movie plays automatically
- **Page 21**: That's All Folks finale

## Design Features Implemented

### Page 1 (Cinematic Intro)
- Ocean looping video background (muted)
- Times New Roman font, bold, large title
- Avatar video (140×180px) in bottom-right corner with white border and glow
- Play button overlay (white triangle)
- Navigation: Next / Login / Register

### Page 2 (Welcome)
- Ocean background continues
- Motivational tagline
- Back and Next buttons

### Page 3 (Plans)
- Black background
- Three Stripe plan boxes: Basic ($10), Pro ($20), Studio ($30)
- Hover effects on plan boxes

### Pages 4-9 (Toolboards)
- Black background
- Neon-green bordered boxes
- "Continue your story" placeholder text

### Page 10 (Doxy Movie)
- Black background
- Full-width video player (80%)
- Autoplays DTSBmovie.mp4

### Pages 11-20 (Builders)
- Black background
- Scene building prompts
- Navigation between pages

### Page 21 (Finale)
- Black background
- ThatsAllFolks.mp4 video player
- "Thank you" message
- Back and Home buttons

## Troubleshooting

### Videos not playing:
- Verify files are in `/home/MandaStrong1/mandastrong_studio/static/video/`
- Check file permissions: `chmod 644 static/video/*.mp4`

### CSS not loading:
- Verify `static/css/style.css` exists
- Check Flask is finding the static folder

### 404 errors:
- Verify all HTML files are in `templates/` folder
- Check WSGI configuration points to correct directory

### Avatar play button not working:
- JavaScript requires the video file to load
- Check browser console for errors

## Next Steps

To add authentication and Stripe integration:
1. Install Flask-Login for user management
2. Set up Supabase or SQLite database for user accounts
3. Replace Stripe test URLs with your actual Stripe checkout links
4. Add session management for logged-in users

---

**Your app is now live at**: https://mandastrong1.pythonanywhere.com
