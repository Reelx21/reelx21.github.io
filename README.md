# Reelx21 V4 — Cloudinary Reels + Adsterra

GitHub Pages static Reelx21 player using Cloudinary video URLs.

## Included Adsterra units
- Popunder
- Native Banner
- Banner 300x250 (desktop/tablet)
- Banner 320x50 (small mobile)

Ads are loaded from `js/ads.js` and inserted by `js/app.js`.

## Video data
Edit `js/videos.js` and add Cloudinary MP4 URLs to the `VIDEOS` array.

## Important
Do not paste the Adsterra scripts a second time elsewhere in the HTML. If Adsterra changes or disables a code, update only `js/ads.js`.
