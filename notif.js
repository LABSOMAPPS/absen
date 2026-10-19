/* SIABSEN v7 — Modul Notifikasi In-App + WhatsApp */
(function(){
  const K_NOTIF = 'siabsen_notifikasi';

  window.getNotifs = () => JSON.parse(localStorage.getItem(K_NOTIF) || '[]');
  window.saveNotifs = a => localStorage.setItem(K_NOTIF, JSON.stringify(a));

  window.pushNotif = function(data) {
    const list = getNotifs();
    list.push({
      id: 'N' + Date.now().toString(36) + Math.random().toString(36).slice(2,5),
      toUser: data.toUser, toRole: data.toRole,
      judul: data.judul, pesan: data.pesan,
      kategori: data.kategori || 'info',
      waNumber: data.waNumber || '', waText: data.waText || data.pesan,
      tanggal: new Date().toISOString(),
      read: false, waSent: false
    });
    saveNotifs(list);
  };

  window.getMyNotifs = function(userKey, role) {
    return getNotifs()
      .filter(n => n.toUser === userKey && n.toRole === role)
      .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
  };

  window.markNotifRead = function(id) {
    const list = getNotifs();
    const i = list.findIndex(n => n.id === id);
    if (i >= 0) list[i].read = true;
    saveNotifs(list);
  };

  window.markAllRead = function(userKey, role) {
    const list = getNotifs();
    list.forEach(n => { if (n.toUser === userKey && n.toRole === role) n.read = true; });
    saveNotifs(list);
  };

  window.markNotifWaSent = function(id) {
    const list = getNotifs();
    const i = list.findIndex(n => n.id === id);
    if (i >= 0) list[i].waSent = true;
    saveNotifs(list);
  };

  window.normalizeWA = function(wa) {
    let s = String(wa || '').replace(/\D/g, '');
    if (s.startsWith('0')) s = '62' + s.slice(1);
    if (!s.startsWith('62')) s = '62' + s;
    return s;
  };

  window.openWA = function(wa, text) {
    const num = normalizeWA(wa);
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text || '')}`, '_blank');
    return true;
  };

  function esc(s){
    return String(s||'').replace(/[&<>"']/g, c => (
      {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escJs(s){
    return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"')
      .replace(/\n/g,'\\n').replace(/\r/g,'');
  }

  function injectBell() {
    const userInfo = document.querySelector('.user-info');
    if (!userInfo || document.getElementById('notifBellBtn')) return;

    const session = JSON.parse(localStorage.getItem('siabsen_user') || 'null');
    if (!session) return;
    const userKey = session.role === 'orang_tua' ? session.id : session.nip;

    const btn = document.createElement('button');
    btn.id = 'notifBellBtn';
    btn.className = 'btn-icon';
    btn.title = 'Notifikasi';
    btn.type = 'button';
    btn.style.position = 'relative';
    btn.innerHTML = '🔔<span id="notifBadge" style="display:none;position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:9px;font-weight:800;min-width:18px;height:18px;border-radius:9px;align-items:center;justify-content:center;padding:0 5px;border:2px solid #fff;box-shadow:0 2px 6px rgba(239,68,68,.5);line-height:1.2">0</span>';
    userInfo.insertBefore(btn, userInfo.firstChild);

    const panel = document.createElement('div');
    panel.id = 'notifPanel';
    panel.style.cssText = 'position:fixed;top:70px;right:12px;width:390px;max-width:calc(100vw - 24px);max-height:75vh;overflow-y:auto;background:#fff;border:1px solid #e2e8f0;border-radius:20px;box-shadow:0 24px 60px -12px rgba(15,23,42,.4);z-index:150;display:none;';
    document.body.appendChild(panel);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'block' : 'none';
      if (isHidden) renderPanel();
    });
    document.addEventListener('click', (e) => {
      if (panel.style.display !== 'none' && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    function renderPanel() {
      const list = getMyNotifs(userKey, session.role);
      const unread = list.filter(n => !n.read).length;
      const badge = document.getElementById('notifBadge');
      if (badge) {
        if (unread > 0) { badge.style.display = 'flex'; badge.textContent = unread > 99 ? '99+' : unread; }
        else badge.style.display = 'none';
      }

      let html = `<div style="position:sticky;top:0;background:linear-gradient(135deg,#065f46,#10b981);color:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;z-index:2">
        <div style="font-weight:800;font-size:14px">🔔 Notifikasi ${unread>0?`<span style="background:rgba(255,255,255,.25);padding:2px 8px;border-radius:20px;font-size:10px;margin-left:6px">${unread} baru</span>`:''}</div>
        <button onclick="event.stopPropagation();window._nmAll()" style="background:rgba(255,255,255,.2);color:#fff;border:none;padding:5px 10px;border-radius:8px;font-size:10.5px;font-weight:700;cursor:pointer;font-family:inherit">✓ Baca Semua</button>
      </div><div style="padding:12px">`;

      if (!list.length) {
        html += `<div style="text-align:center;padding:40px 16px;color:#94a3b8">
          <div style="font-size:54px;margin-bottom:12px;opacity:.35">📭</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">Belum Ada Notifikasi</div>
          <div style="font-size:12px">Notifikasi akan muncul di sini</div>
        </div>`;
      } else {
        html += list.slice(0, 40).map(n => {
          const d = new Date(n.tanggal);
          const t = d.toLocaleString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
          const bc = n.kategori === 'penting' ? '#ef4444' : n.kategori === 'peringatan' ? '#f59e0b' : '#06b6d4';
          const bg = n.kategori === 'penting' ? 'rgba(239,68,68,.05)' : n.kategori === 'peringatan' ? 'rgba(245,158,11,.05)' : 'transparent';
          const ic = n.kategori === 'penting' ? '⚠️' : n.kategori === 'peringatan' ? '❗' : 'ℹ️';
          return `<div style="padding:12px;border-radius:14px;margin-bottom:8px;background:${bg};border-left:4px solid ${bc};${!n.read?'box-shadow:0 2px 8px rgba(6,95,70,.08);':'opacity:.85;'}">
            <div style="display:flex;gap:10px;margin-bottom:8px">
              <div style="font-size:20px;flex-shrink:0">${ic}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:800;font-size:13px;line-height:1.3;margin-bottom:3px">${esc(n.judul)}${!n.read?'<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#ef4444;margin-left:5px;vertical-align:middle"></span>':''}</div>
                <div style="font-size:12px;color:#475569;line-height:1.55;white-space:pre-line">${esc(n.pesan)}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:8px;flex-wrap:wrap">
              <span style="font-size:10.5px;color:#94a3b8;font-weight:600">🕐 ${t}</span>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                ${n.waNumber ? `<button onclick="event.stopPropagation();window._nOpenWA('${n.id}','${escJs(n.waNumber)}','${escJs(n.waText)}')" style="background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border:none;padding:5px 10px;border-radius:8px;font-size:10.5px;font-weight:800;cursor:pointer;font-family:inherit">📲 ${n.waSent?'WA Terkirim':'Kirim WA'}</button>` : ''}
                ${!n.read ? `<button onclick="event.stopPropagation();window._nRead('${n.id}')" style="background:rgba(6,95,70,.1);color:#065f46;border:none;padding:5px 10px;border-radius:8px;font-size:10.5px;font-weight:800;cursor:pointer;font-family:inherit">✓ Baca</button>` : ''}
              </div>
            </div>
          </div>`;
        }).join('');
      }
      html += `</div>`;
      panel.innerHTML = html;
    }

    window._nRead = (id) => { markNotifRead(id); renderPanel(); };
    window._nmAll = () => { markAllRead(userKey, session.role); renderPanel(); };
    window._nOpenWA = (id, wa, text) => {
      openWA(wa, text);
      markNotifRead(id); markNotifWaSent(id);
      setTimeout(renderPanel, 300);
    };

    renderPanel();
    setInterval(() => {
      if (panel.style.display !== 'none') renderPanel();
      const list = getMyNotifs(userKey, session.role);
      const unread = list.filter(n => !n.read).length;
      const b = document.getElementById('notifBadge');
      if (b) { if (unread>0){b.style.display='flex';b.textContent=unread>99?'99+':unread;}else b.style.display='none'; }
    }, 15000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectBell);
  else injectBell();
})();

window.notifyAbsensiKeOrtu = function(record, kelasNama) {
  if (!record || !record.students) return 0;
  const ortuList = JSON.parse(localStorage.getItem('siabsen_ortu') || '[]');
  const guruName = record.guruNama || 'Guru';
  let count = 0;

  record.students.forEach(s => {
    if (s.status === 'Hadir') return;
    const ortu = ortuList.find(o => (o.anakNis || []).includes(s.nis));
    if (!ortu) return;

    const emoji = s.status === 'Alpha' ? '❌' : s.status === 'Sakit' ? '🤒' : '📝';
    const kategori = s.status === 'Alpha' ? 'penting' : 'info';
    const tanggalFmt = new Date(record.tanggal+'T00:00:00')
      .toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });

    const pesanInApp = `Ananda *${s.nama}* tercatat *${s.status}* pada mata pelajaran ${record.mapel} (${tanggalFmt}).${s.note ? '\nCatatan: ' + s.note : ''}`;

    const pesanWA = `Assalamu'alaikum Bpk/Ibu ${ortu.nama},\n\n${emoji} *Pemberitahuan Kehadiran*\nMadrasah IRSYADUL ULUM\n\nAnanda: *${s.nama}*\nKelas: ${kelasNama}\nMapel: ${record.mapel}\nTanggal: ${tanggalFmt}\nStatus: *${s.status}*${s.note ? '\nCatatan: ' + s.note : ''}\n\n${s.status === 'Alpha' ? 'Mohon konfirmasi kepada wali kelas / pihak madrasah.\n\n' : ''}Terima kasih atas perhatiannya.\n\nBarakallahu fiikum,\n_${guruName}_\nMadrasah IRSYADUL ULUM`;

    pushNotif({
      toUser: ortu.id, toRole: 'orang_tua',
      judul: `${emoji} ${s.status}: ${s.nama}`,
      pesan: pesanInApp, kategori,
      waNumber: ortu.wa, waText: pesanWA
    });
    count++;
  });
  return count;
};