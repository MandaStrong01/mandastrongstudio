# Deploying Movie Builder to PythonAnywhere

## Prerequisites

1. Create a free account at [PythonAnywhere](https://www.pythonanywhere.com)
2. Have your Supabase credentials ready from the `.env` file

## Step-by-Step Deployment

### 1. Create the Database Table

Before deploying, you need to create the `scenes` table in your Supabase database. Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  duration integer NOT NULL CHECK (duration > 0 AND duration <= 120),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scenes"
  ON scenes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scenes"
  ON scenes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete scenes"
  ON scenes
  FOR DELETE
  USING (true);
```

### 2. Upload Your Files

1. Log in to your PythonAnywhere account
2. Go to the **Files** tab
3. Create a new directory for your project (e.g., `movie-builder`)
4. Upload these files:
   - `flask_app.py`
   - `requirements.txt`
   - `.env` (with your Supabase credentials)
   - The entire `templates/` folder with both HTML files

Your file structure should look like:
```
/home/yourusername/movie-builder/
├── flask_app.py
├── requirements.txt
├── .env
└── templates/
    ├── index.html
    └── code.html
```

### 3. Install Dependencies

1. Go to the **Consoles** tab
2. Start a new **Bash console**
3. Navigate to your project directory:
   ```bash
   cd movie-builder
   ```
4. Install the required packages:
   ```bash
   pip3 install --user -r requirements.txt
   ```

### 4. Set Up Your Web App

1. Go to the **Web** tab
2. Click **Add a new web app**
3. Choose **Manual configuration**
4. Select **Python 3.10** (or the latest available version)
5. Click through to create the web app

### 5. Configure the WSGI File

1. In the **Web** tab, find the **Code** section
2. Click on the WSGI configuration file link (it will be something like `/var/www/yourusername_pythonanywhere_com_wsgi.py`)
3. Replace the entire contents with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/movie-builder'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set up environment variables
os.chdir(project_home)

# Import your Flask app
from flask_app import app as application
```

**Important:** Replace `yourusername` with your actual PythonAnywhere username!

### 6. Set Environment Variables

Since PythonAnywhere reads `.env` files, make sure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SECRET_KEY=your_secret_key_for_flask_sessions
```

### 7. Configure Static Files (Optional)

If you want to serve static files:
1. In the **Web** tab, scroll to **Static files**
2. Add a new static file mapping:
   - URL: `/static/`
   - Directory: `/home/yourusername/movie-builder/static/`

### 8. Reload Your Web App

1. Scroll to the top of the **Web** tab
2. Click the big green **Reload** button
3. Your app should now be live at `yourusername.pythonanywhere.com`

## Troubleshooting

### Error Logs
- Check error logs in the **Web** tab under "Log files"
- Look for the error log link to see what went wrong

### Common Issues

1. **Import errors**: Make sure all packages are installed with `pip3 install --user -r requirements.txt`

2. **Path errors**: Ensure the paths in your WSGI file match your actual directory structure

3. **Database connection errors**: Verify your Supabase credentials in the `.env` file are correct

4. **Static files not loading**: Check that Tailwind CSS CDN is accessible (it's loaded from a CDN in the HTML)

### Testing Locally First

Before deploying, you can test locally:
```bash
python3 flask_app.py
```
Visit `http://127.0.0.1:5000` to test the app.

## Updating Your App

When you make changes:
1. Upload the modified files via the Files tab
2. Click the **Reload** button in the Web tab

## Free Tier Limitations

PythonAnywhere's free tier includes:
- One web app
- Limited CPU time
- App sleeps after inactivity
- No HTTPS on custom domains (but HTTPS on pythonanywhere.com subdomain)

For production use with custom domains and better performance, consider upgrading to a paid plan.

## Support

- PythonAnywhere Help: https://help.pythonanywhere.com/
- Forums: https://www.pythonanywhere.com/forums/
