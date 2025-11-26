# Deploy MandaStrong Studio to PythonAnywhere

## Your Files Are Already There!

You already have the directory at `/home/MandaStrong1/mandastrong_studio/` with your videos.

## Quick Update Steps

### 1. Replace app.py

1. **Go to Files tab** in PythonAnywhere
2. **Navigate to:** `/home/MandaStrong1/mandastrong_studio/`
3. **Delete or rename** your old `app.py`
4. **Upload** the new `flask_app.py` from this project
5. **Rename it to:** `app.py`

### 2. Update Templates Folder

1. **Navigate to:** `/home/MandaStrong1/mandastrong_studio/templates/`
2. **Delete all old HTML files** (or move to backup folder)
3. **Upload these 7 new files** from `flask_templates/`:
   - page1.html
   - page2.html
   - page3.html
   - pages4-9.html
   - page10.html
   - pages11-20.html
   - page21.html

### 3. Update CSS

1. **Navigate to:** `/home/MandaStrong1/mandastrong_studio/static/css/`
2. **Delete or backup** old `style.css`
3. **Upload** new `style.css` from `flask_static/css/`

### 4. Videos Are Already There

Your videos are already at:
- `/home/MandaStrong1/mandastrong_studio/static/video/background.mp4`
- `/home/MandaStrong1/mandastrong_studio/static/video/avatar.mp4`
- `/home/MandaStrong1/mandastrong_studio/static/video/DTSBmovie.mp4`
- `/home/MandaStrong1/mandastrong_studio/static/video/ThatsAllFolks.mp4`
- `/home/MandaStrong1/mandastrong_studio/static/video/packageDTSBexpscript.mp4`

No need to re-upload them!

### 5. Verify WSGI File

Check `/var/www/mandastrong1_pythonanywhere_com_wsgi.py` contains:

```python
import sys
import os

path = '/home/MandaStrong1/mandastrong_studio'
if path not in sys.path:
    sys.path.insert(0, path)

from app import app as application
```

### 6. Reload Web App

1. **Go to Web tab**
2. **Click "Reload mandastrong1.pythonanywhere.com"**
3. **Wait for green success message**
4. **Visit:** https://mandastrong1.pythonanywhere.com

## Files to Upload

From this project folder, you need to upload:

**Main App:**
- `flask_app.py` → rename to `app.py`

**Templates (7 files from `flask_templates/`):**
- page1.html
- page2.html
- page3.html
- pages4-9.html
- page10.html
- pages11-20.html
- page21.html

**CSS (from `flask_static/css/`):**
- style.css

## Final Directory Structure

```
/home/MandaStrong1/mandastrong_studio/
├── app.py                    ← Upload flask_app.py as this
├── templates/
│   ├── page1.html           ← Upload these 7 files
│   ├── page2.html
│   ├── page3.html
│   ├── pages4-9.html
│   ├── page10.html
│   ├── pages11-20.html
│   └── page21.html
└── static/
    ├── css/
    │   └── style.css        ← Upload this file
    └── video/               ← Already has all 5 videos
        ├── background.mp4
        ├── avatar.mp4
        ├── DTSBmovie.mp4
        ├── ThatsAllFolks.mp4
        └── packageDTSBexpscript.mp4
```

## Test Your App

After reload, test these pages:

1. **Page 1** - Ocean background, avatar with play button
2. **Page 3** - Stripe plans (Basic/Pro/Studio)
3. **Page 4-9** - Neon-green toolboard boxes
4. **Page 10** - Doxy movie autoplays
5. **Page 21** - That's All Folks finale

## Troubleshooting

**Videos not playing?**
- Check file permissions: `chmod 644 static/video/*.mp4`

**CSS not loading?**
- Clear browser cache (Ctrl+Shift+R)
- Check `static/css/style.css` exists

**500 Error?**
- Check error log in Web tab
- Verify WSGI configuration

**Avatar play button not working?**
- Clear browser cache
- Check browser console for JavaScript errors

---

**You're ready to go live!** 🎬
