# Reelx21 V5

Flow:
VIDEO 1 -> AD -> VIDEO 2 -> AD -> VIDEO 3 -> AD -> ...

- Cloudinary video source
- autoplay when visible
- no video loop
- video end automatically scrolls to the next ad slide
- ad slide has a "Lanjut ke video" button
- then the next video autoplay
- Like, Share, Sound, local views
- Adsterra Popunder is loaded once
- Native / Banner slots are separated from video

Add videos in `js/videos.js`.

Note: ad provider scripts control their own behavior. Do not duplicate the Popunder script elsewhere.
