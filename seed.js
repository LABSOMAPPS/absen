/* SIABSEN v7 — Seed Data Terpusat */
(function(){
  const PWD = 'irsyad123';
  if (!localStorage.getItem('siabsen_guru')) localStorage.setItem('siabsen_guru', JSON.stringify([
    { nip:'admin', email:'admin@irsyadululum.id', wa:'6281234567890', nama:'Administrator Madrasah', password:PWD, role:'admin' },
    { nip:'198501012010011001', email:'budi@irsyadululum.id', wa:'6281234500001', nama:'Budi Santoso, S.Pd.', password:PWD, role:'guru' },
    { nip:'199002152012012002', email:'siti@irsyadululum.id', wa:'6281234500002', nama:'Siti Aminah, S.Pd.', password:PWD, role:'guru' }
  ]));
  if (!localStorage.getItem('siabsen_kelas')) localStorage.setItem('siabsen_kelas', JSON.stringify([
    { id:'K1', nama:'X IPA 1', guruNip:'198501012010011001', mapel:['Matematika','Fisika'] },
    { id:'K2', nama:'X IPA 2', guruNip:'198501012010011001', mapel:['Matematika','Fisika'] },
    { id:'K3', nama:'XI IPA 1', guruNip:'198501012010011001', mapel:['Matematika'] },
    { id:'K4', nama:'X IPS 1', guruNip:'199002152012012002', mapel:['Bahasa Indonesia','Sejarah'] },
    { id:'K5', nama:'XI IPS 1', guruNip:'199002152012012002', mapel:['Bahasa Indonesia'] }
  ]));
  if (!localStorage.getItem('siabsen_siswa')) {
    const seed = {
      K1:[['240101','Ahmad Fauzi'],['240102','Bella Safira'],['240103','Citra Lestari'],['240104','Dimas Pratama'],['240105','Eka Wijaya'],['240106','Farah Nadia'],['240107','Gilang Ramadhan'],['240108','Hana Pertiwi'],['240109','Ivan Kurniawan'],['240110','Jihan Amelia']],
      K2:[['240201','Kevin Adrian'],['240202','Lina Marlina'],['240203','Muhammad Rizki'],['240204','Nadia Salsabila'],['240205','Oscar Pratama'],['240206','Putri Ayu'],['240207','Rafi Hidayat']],
      K3:[['230101','Sari Indah'],['230102','Taufik Hidayat'],['230103','Umi Kalsum'],['230104','Vino Bastian'],['230105','Wulan Sari']],
      K4:[['240301','Yoga Pratama'],['240302','Zahra Aulia'],['240303','Andi Saputra']],
      K5:[['230201','Bunga Citra'],['230202','Cahyo Nugroho']]
    };
    const arr=[];
    Object.entries(seed).forEach(([kid,list])=>list.forEach(([nis,nama])=>arr.push({id:'S'+nis,nis,nama,kelasId:kid})));
    localStorage.setItem('siabsen_siswa',JSON.stringify(arr));
  }
  if (!localStorage.getItem('siabsen_ortu')) localStorage.setItem('siabsen_ortu',JSON.stringify([
    {id:'O1',username:'fauzi',nama:'Bapak Ahmad Fauzi',email:'fauzi@email.com',hp:'081111111111',wa:'628111111111',hubungan:'Ayah',password:PWD,anakNis:['240101']},
    {id:'O2',username:'sari',nama:'Ibu Sari Dewi',email:'sari@email.com',hp:'081222222222',wa:'628122222222',hubungan:'Ibu',password:PWD,anakNis:['240102','240103']},
    {id:'O3',username:'hendra',nama:'Bapak Hendra Wijaya',email:'hendra@email.com',hp:'081333333333',wa:'628133333333',hubungan:'Ayah',password:PWD,anakNis:['240104']},
    {id:'O4',username:'ratna',nama:'Ibu Ratna Sari',email:'ratna@email.com',hp:'081444444444',wa:'628144444444',hubungan:'Ibu',password:PWD,anakNis:['240110','240202']}
  ]));
  if (!localStorage.getItem('siabsen_pengumuman')) {
    const today=new Date().toISOString().slice(0,10);
    localStorage.setItem('siabsen_pengumuman',JSON.stringify([
      {id:'P1',judul:'Selamat Datang di IRSYADUL ULUM',isi:"Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di sistem informasi madrasah IRSYADUL ULUM. Portal ini digunakan untuk memantau kehadiran ananda serta menerima pengumuman resmi madrasah.",kategori:'umum',tanggal:today,author:'Administrator Madrasah'},
      {id:'P2',judul:'Pembagian Rapor Semester Ganjil',isi:'Pembagian rapor akan dilaksanakan pada hari Sabtu pukul 08.00 WIB di ruang kelas masing-masing. Mohon kehadiran orang tua/wali.',kategori:'penting',tanggal:today,author:'Administrator Madrasah'},
      {id:'P3',judul:'Class Meeting & Pentas Seni',isi:'Akan diadakan kegiatan class meeting dan pentas seni. Siswa diharapkan berpartisipasi dalam kegiatan tersebut.',kategori:'acara',tanggal:today,author:'Administrator Madrasah'}
    ]));
  }
})();
