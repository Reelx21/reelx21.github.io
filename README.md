# Reelx21 V2

Pemutar Reels berbasis GitHub Pages dengan video yang di-host di Cloudinary.

## Menambah video
Edit `VIDEOS` di `index.html`, lalu tambahkan objek:

```js
{
  id: "id-unik",
  src: "URL-VIDEO-CLOUDINARY",
  username: "@Reelx21",
  caption: "Caption video",
  poster: "URL-POSTER-CLOUDINARY"
}
```

## Catatan
- Video tidak disimpan di GitHub; hanya URL Cloudinary yang dipanggil.
- View dan like pada versi ini disimpan di browser pengunjung (localStorage), bukan database global.
- Kode Adsterra belum dimasukkan. Masukkan kode resmi dari dashboard Adsterra setelah siap.
