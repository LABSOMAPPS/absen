SIABSEN v7 — Cara menjalankan di Visual Studio Code

1. Buka folder SIABSEN-v7 di VS Code (File > Open Folder).
2. Pasang ekstensi Live Server jika belum ada.
3. Klik kanan login.html lalu pilih “Open with Live Server”. Browser akan membuka aplikasi pada alamat localhost.
4. Coba akun demo berikut:
   Guru Budi: username/NIP 198501012010011001, WhatsApp 6281234500001, password irsyad123
   Guru Siti: username/NIP 199002152012012002, WhatsApp 6281234500002, password irsyad123
   Wali Fauzi: username fauzi, WhatsApp 628111111111, password irsyad123

Catatan berkas: login.html, index.html (halaman guru), parent.html, notif.js, seed.js, manifest.json, dan sw.js disiapkan dari kode yang Anda kirim. Lampiran Anda tidak menyertakan admin.html, sedangkan login mengarah ke admin.html untuk akun admin; karena itu akun admin belum dapat digunakan. Ikon icon-192.png dan icon-512.png juga belum disertakan, tetapi ketiadaannya tidak menghalangi halaman dibuka.

Data demo tersimpan di localStorage browser. Untuk mengulang dari kondisi awal, buka DevTools > Application > Local Storage pada localhost dan hapus key yang diawali siabsen_. Ini menghapus data demo yang tersimpan.

Ini adalah prototipe demo. Jangan gunakan password atau data siswa sungguhan; autentikasi dan data disimpan hanya di browser.
