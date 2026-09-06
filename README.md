# Reelx21 V3 — Cloudinary Reels

Versi ini menggunakan Cloudinary sebagai tempat penyimpanan video dan GitHub Pages sebagai frontend.

## Struktur

- `index.html` — halaman utama
- `css/style.css` — tampilan Reel
- `js/videos.js` — daftar URL video Cloudinary
- `js/app.js` — player, autoplay, like, share, view lokal
- `index-v1-backup.html` — backup index versi sebelumnya

## Menambah video

Buka `js/videos.js`, lalu tambahkan objek:

```js
{
  id: "video-002",
  title: "Judul video",
  src: "https://res.cloudinary.com/USERNAME/video/upload/VIDEO.mp4",
  description: "Deskripsi",
  poster: ""
}
```

Untuk Cloudinary, `poster` boleh dikosongkan. Sistem akan mencoba membuat poster JPG otomatis dari frame pertama video.

## Catatan

View dan Like pada versi ini disimpan di browser (`localStorage`), sehingga belum menjadi statistik global.

Untuk statistik global, login pengguna, database, upload otomatis, dan dashboard admin, diperlukan backend/database pada tahap berikutnya.
