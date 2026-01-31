# MandaStrong Studio Pro - Installation Guide

## Progressive Web App (PWA) Installation

Your app is now a fully installable Progressive Web App that works on all devices!

### Desktop Installation (Chrome, Edge, Brave)

1. Visit your deployed site
2. Look for the install icon in the address bar (usually on the right)
3. Click "Install" or "Add to Desktop"
4. The app will launch as a standalone application

### iOS Installation (Safari)

1. Open the site in Safari
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"
5. The app icon appears on your home screen

### Android Installation (Chrome)

1. Open the site in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen" or "Install App"
4. Confirm installation
5. The app appears in your app drawer

## Features

- **Offline Support**: Service worker caches assets for offline use
- **600+ AI Tools**: Fully functional AI tool interfaces for:
  - Writing & Story Generation
  - Voice Synthesis
  - Image Generation
  - Video Production
  - Animation & Motion Graphics
- **Video Upload**: Resumable uploads up to 50GB per file
- **Professional Editor Suite**: Timeline editing, audio mixing, color grading
- **Export Options**: Multiple resolutions (720p, HD, 4K, 8K) and formats
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Touch-Optimized**: Smooth touch interactions on all devices

## Device Support

- ✅ Windows (Chrome, Edge, Firefox)
- ✅ macOS (Safari, Chrome, Edge)
- ✅ iOS 11.3+ (Safari, Chrome)
- ✅ Android 5.0+ (Chrome, Firefox, Edge)
- ✅ iPad & Tablets
- ✅ Linux (Chrome, Firefox)

## Deployment

### Static Hosting (Recommended)

1. Deploy the `dist` folder to any static host:
   - Vercel: `vercel --prod`
   - Netlify: Drag & drop `dist` folder
   - GitHub Pages: Push to `gh-pages` branch
   - AWS S3 + CloudFront
   - Firebase Hosting

2. Ensure these files are served correctly:
   - `manifest.json` (Content-Type: application/json)
   - `sw.js` (Content-Type: application/javascript)
   - All `.svg` icons

### Required Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Post-Deployment

1. Test PWA installation on multiple devices
2. Verify service worker registration in DevTools
3. Test offline functionality
4. Confirm AI tools are saving to database
5. Test video upload with various file sizes

## Troubleshooting

### PWA Not Installing

- Ensure site is served over HTTPS
- Check manifest.json is accessible at `/manifest.json`
- Verify service worker registers successfully
- Clear browser cache and try again

### Service Worker Issues

- Check DevTools > Application > Service Workers
- Unregister old service workers
- Clear all site data and refresh

### Upload Issues

- Verify Supabase storage bucket exists
- Check RLS policies allow uploads
- Ensure file size limits are configured

## Support

For issues or questions, contact the MandaStrong team.

© 2025 MandaStrong Studio Pro - All Rights Reserved
