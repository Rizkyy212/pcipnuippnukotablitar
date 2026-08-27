/* ==========================================
    SCRIPT UTAMA - PC IPNU-IPPNU KOTA BLITAR
    (Mendukung Semua Halaman, Dashboard, & Berita Interaktif)
    ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tombol Hamburger Menu Mobile (Semua Halaman)
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // 2. Animasi Angka Statistik di Beranda (index.html)
  const statNums = document.querySelectorAll(".stat-num");
  if (statNums.length > 0) {
    statNums.forEach((numElem) => {
      const target = +numElem.getAttribute("data-target");
      const suffix = numElem.getAttribute("data-suffix") || "";
      let current = 0;
      const increment = target / 35;
      const updateCount = () => {
        current += increment;
        if (current < target) {
          numElem.innerText = Math.ceil(current) + suffix;
          setTimeout(updateCount, 40);
        } else {
          numElem.innerText = target + suffix;
        }
      };
      updateCount();
    });
  }

  // 3. Handle Form Pengajuan Layanan (Hanya berjalan di halaman layanan.html)
  const formLayanan = document.getElementById("formLayanan") || document.querySelector("form");
  if (formLayanan && window.location.pathname.includes("layanan")) {
    formLayanan.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const jenis = document.getElementById("jenisLayanan")?.value || "Permohonan SK Pengurusan";
      const pemohon = document.getElementById("namaPemohon")?.value || "Perwakilan Kader";
      const badanOtonom = document.getElementById("badanOtonom")?.value || "IPNU";
      const organisasi = document.getElementById("asalOrganisasi")?.value || "PAC Kepanjenkidul";
      
      // Format Tanggal & Jam Real-Time
      const now = new Date();
      const tanggalStr = now.toISOString().split("T")[0];
      const jamStr = now.toTimeString().split(" ")[0].substring(0, 5);
      const waktuLengkap = `${tanggalStr} (${jamStr} WIB)`;

      const fileDokumen = document.getElementById("fileUpload")?.files[0]?.name || "Dokumen_Resmi.pdf";

      let daftarPengajuan = JSON.parse(localStorage.getItem("dataLayanan")) || [];
      const prefix = badanOtonom === "IPPNU" ? "SP-IPPNU-" : "SP-IPNU-";
      const countBo = daftarPengajuan.filter(d => d.id && d.id.includes(prefix)).length + 1;
      const nomorUrut = String(countBo).padStart(3, '0');
      const idUnik = prefix + nomorUrut;

      const pengajuanBaru = {
        id: idUnik,
        jenis,
        pemohon,
        organisasi: `${badanOtonom} - ${organisasi}`,
        tanggal: waktuLengkap,
        status: "Diproses",
        dokumen: fileDokumen,
        keterangan: "Pengajuan baru masuk melalui portal online layanan terpadu."
      };

      daftarPengajuan.unshift(pengajuanBaru);
      localStorage.setItem("dataLayanan", JSON.stringify(daftarPengajuan));

      alert(`Pengajuan Berhasil Dikirim!\nNomor Resi: ${pengajuanBaru.id}\nWaktu: ${waktuLengkap}\nFile Berkas: ${fileDokumen}`);
      formLayanan.reset();
    });
  }

  // 4. Render Data di Tabel Dashboard Admin (Hanya berjalan di dashboard.html)
  const dashTableBody = document.getElementById("dashTableBody");
  if (dashTableBody) {
    muatDataDashboard();
  }

  // 5. Muat Statistik Beranda di Dashboard Admin
  if (document.getElementById("editPac")) {
    const savedStats = JSON.parse(localStorage.getItem("statsBeranda")) || { pac: 3, pkpr: 29, kader: 150, kegiatan: 12 };
    document.getElementById("editPac").value = savedStats.pac;
    document.getElementById("editPkpr").value = savedStats.pkpr;
    document.getElementById("editKader").value = savedStats.kader;
    document.getElementById("editKegiatan").value = savedStats.kegiatan;
  }
});

/* ==========================================
    FUNGSI INTERAKSI BERITA BUKA-TUTUP (SPA)
    ========================================== */

// Membuka detail berita tertentu di index.html
function showBerita(beritaId) {
  const daftarContainer = document.getElementById('daftarBeritaContainer');
  const detailContainer = document.getElementById('detailBeritaContainer');

  if (daftarContainer) daftarContainer.style.display = 'none';
  if (detailContainer) detailContainer.style.display = 'block';

  // Sembunyikan semua artikel detail terlebih dahulu
  const allViews = document.querySelectorAll('.news-detail-view');
  allViews.forEach(el => el.style.display = 'none');

  // Tampilkan berita yang dipilih
  const target = document.getElementById(beritaId);
  if (target) {
    target.style.display = 'block';
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }
}

// Kembali ke daftar berita utama di index.html
function goBack() {
  const daftarContainer = document.getElementById('daftarBeritaContainer');
  const detailContainer = document.getElementById('detailBeritaContainer');

  if (detailContainer) detailContainer.style.display = 'none';
  if (daftarContainer) daftarContainer.style.display = 'block';
  window.scrollTo({ top: 400, behavior: 'smooth' });
}

// Interaksi tombol Suka (Like) pada berita
function toggleLike(beritaId) {
  const countSpan = document.getElementById(`like-count-${beritaId}`);
  if (countSpan) {
    let currentLikes = parseInt(countSpan.innerText);
    countSpan.innerText = currentLikes + 1;
  }
}

// Salin tautan berita ke clipboard
function copyToClipboard() {
  navigator.clipboard.writeText(window.location.href);
  alert("Tautan berita berhasil disalin ke clipboard!");
}


/* ==========================================
    FUNGSI MANAJEMEN DASHBOARD ADMIN
    ========================================== */

function muatDataDashboard() {
  const dashTableBody = document.getElementById("dashTableBody");
  const dashStats = document.getElementById("dashStats");
  if (!dashTableBody) return;

  const data15Default = [
    { id: "SP-IPNU-001", jenis: "Permohonan SK PAC", pemohon: "Achmad Hafy Akmal", organisasi: "IPNU - PAC Sukorejo", tanggal: "2026-06-01 (09:30 WIB)", status: "Selesai", dokumen: "SK_PAC_Sukorejo_2026.pdf", keterangan: "Mandat Konferancab telah diverifikasi." },
    { id: "SP-IPNU-002", jenis: "Rekomendasi Kaderisasi LAKMUD", pemohon: "Muhammad Risko", organisasi: "IPNU - PK UNISKA", tanggal: "2026-06-03 (10:15 WIB)", status: "Diproses", dokumen: "Proposal_LAKMUD_UNISKA.pdf", keterangan: "Menunggu jadwal screening peserta." },
    { id: "SP-IPNU-003", jenis: "Permohonan SK Pimpinan Ranting", pemohon: "Ahmad Zaini", organisasi: "IPNU - PR Bendo", tanggal: "2026-06-05 (13:20 WIB)", status: "Selesai", dokumen: "Surat_Ranting_Bendo.pdf", keterangan: "SK diterbitkan dan siap diambil." },
    { id: "SP-IPNU-004", jenis: "Peminjaman Atribut & Bendera", pemohon: "Fauzi Rahmat", organisasi: "IPNU - PAC Sananwetan", tanggal: "2026-06-08 (14:00 WIB)", status: "Diproses", dokumen: "Form_Peminjaman_Atribut.pdf", keterangan: "Barang disiapkan oleh bidang perlengkapan." },
    { id: "SP-IPNU-005", jenis: "Konsultasi Pelantikan Komisariat", pemohon: "Dimas Anggara", organisasi: "IPNU - PK SMK Islam", tanggal: "2026-06-10 (08:45 WIB)", status: "Selesai", dokumen: "Susunan_Pengurus_PK.pdf", keterangan: "Draft susunan pengurus disetujui." },
    { id: "SP-IPNU-006", jenis: "Legalitas Proposal Kegiatan Harlah", pemohon: "Yoga Pratama", organisasi: "IPNU - PAC Kepanjenkidul", tanggal: "2026-06-12 (11:10 WIB)", status: "Diproses", dokumen: "Proposal_Harlah_IPNU.pdf", keterangan: "Sedang direview oleh tim sekretariat." },
    { id: "SP-IPNU-007", jenis: "Permohonan Narasumber Diklat", pemohon: "Ilham Mahendra", organisasi: "IPNU - PR Tanggung", tanggal: "2026-06-14 (15:30 WIB)", status: "Selesai", dokumen: "Undangan_Narasumber_Diklat.pdf", keterangan: "Surat tugas pemateri telah dikirim." },
    { id: "SP-IPNU-008", jenis: "Permohonan Surat Mandat", pemohon: "Rifky Alamsyah", organisasi: "IPNU - PAC Sukorejo", tanggal: "2026-06-16 (16:00 WIB)", status: "Diproses", dokumen: "Mandat_Utusan_Cabang.pdf", keterangan: "Pengecekan data delegasi acara." },

    { id: "SP-IPPNU-001", jenis: "Permohonan SK PAC", pemohon: "Sofia Annas Ashari", organisasi: "IPPNU - PAC Sukorejo", tanggal: "2026-06-01 (10:00 WIB)", status: "Selesai", dokumen: "SK_IPPNU_Sukorejo.pdf", keterangan: "Arsip fisik sudah di-stempel ketua." },
    { id: "SP-IPPNU-002", jenis: "Rekomendasi Pelatihan Jurnalistik", pemohon: "Amilil 'Ulya", organisasi: "IPPNU - PK Darul Huda", tanggal: "2026-06-04 (13:00 WIB)", status: "Diproses", dokumen: "Kerangka_Acara_Jurnalistik.pdf", keterangan: "Verifikasi koordinasi instansi." },
    { id: "SP-IPPNU-003", jenis: "Permohonan SK Pimpinan Ranting", pemohon: "Deta Reztifa Putri", organisasi: "IPPNU - PR Plosokuning", tanggal: "2026-06-06 (09:15 WIB)", status: "Selesai", dokumen: "Berkas_Ranting_Plosokuning.pdf", keterangan: "Selesai dan terverifikasi sah." },
    { id: "SP-IPPNU-004", jenis: "Peminjaman Atribut & Seragam", pemohon: "Siti Nur Haliza", organisasi: "IPPNU - PAC Sananwetan", tanggal: "2026-06-09 (14:20 WIB)", status: "Diproses", dokumen: "Surat_Pinjam_Atribut.pdf", keterangan: "Menunggu konfirmasi jadwal." },
    { id: "SP-IPPNU-005", jenis: "Legalitas Proposal Santunan Yatim", pemohon: "Nabila Zahra", organisasi: "IPPNU - PAC Kepanjenkidul", tanggal: "2026-06-11 (11:00 WIB)", status: "Selesai", dokumen: "Proposal_Baksos_Yatim.pdf", keterangan: "Surat rekomendasi resmi diterbitkan." },
    { id: "SP-IPPNU-006", jenis: "Permohonan Perpanjangan Masa Khidmat", pemohon: "Roudhotul Jannah", organisasi: "IPPNU - PK MAN Kota Blitar", tanggal: "2026-06-13 (15:40 WIB)", status: "Diproses", dokumen: "Evaluasi_Program_Kerja.pdf", keterangan: "Peninjauan laporan pertanggungjawaban." },
    { id: "SP-IPPNU-007", jenis: "Konsultasi Program Kerja Seni Budaya", pemohon: "Auliatul Fitri", organisasi: "IPPNU - PAC Sukorejo", tanggal: "2026-06-15 (16:30 WIB)", status: "Selesai", dokumen: "Konsep_Seni_Budaya.pdf", keterangan: "Selesai diberikan masukan arah program." }
  ];

  let dataLayanan = JSON.parse(localStorage.getItem("dataLayanan"));
  if (!dataLayanan || dataLayanan.length < 15) {
    dataLayanan = data15Default;
    localStorage.setItem("dataLayanan", JSON.stringify(dataLayanan));
  }

  // Render Statistik Ringkasan di Dashboard
  if (dashStats) {
    dashStats.innerHTML = `
      <div class="stat-box" style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--line);">
        <div style="font-size:13px; color:var(--muted); font-weight:700;">TOTAL PENGAJUAN</div>
        <div style="font-size:26px; font-weight:800; color:var(--green-900); margin-top:4px;">${dataLayanan.length}</div>
      </div>
      <div class="stat-box" style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--line);">
        <div style="font-size:13px; color:var(--muted); font-weight:700;">STATUS DIPROSES</div>
        <div style="font-size:26px; font-weight:800; color:#D97706; margin-top:4px;">${dataLayanan.filter(d => d.status === 'Diproses').length}</div>
      </div>
      <div class="stat-box" style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--line);">
        <div style="font-size:13px; color:var(--muted); font-weight:700;">STATUS SELESAI</div>
        <div style="font-size:26px; font-weight:800; color:#16A34A; margin-top:4px;">${dataLayanan.filter(d => d.status === 'Selesai').length}</div>
      </div>
    `;
  }

  // Render Baris Tabel Dashboard
  dashTableBody.innerHTML = "";
  dataLayanan.forEach((item, index) => {
    const badgeColor = item.status === "Selesai" ? "#DCFCE7; color:#16A34A;" : "#FEF3C7; color:#D97706;";
    const row = `
      <tr>
        <td style="font-weight:700; color:var(--green-900);">${item.id || 'SP-IPNU-000'}</td>
        <td>
          <div style="font-weight:700;">${item.jenis || 'Layanan Organisasi'}</div>
          <div style="font-size:11px; color:var(--muted);">Berkas: ${item.dokumen || 'Dokumen_Resmi.pdf'}</div>
        </td>
        <td>${item.pemohon || 'Kader'}</td>
        <td>${item.organisasi || 'PAC/PR'}</td>
        <td style="font-size:12.5px; font-weight:500;">${item.tanggal || '-'}</td>
        <td><span style="padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:700; background:${badgeColor}">${item.status || 'Diproses'}</span></td>
        <td>
          <button onclick="cekDokumen(${index})" style="background:#2563EB; color:#fff; border:none; padding:5px 9px; border-radius:6px; font-size:11px; cursor:pointer; margin-right:3px;" title="Cek Detail Dokumen">Cek Berkas</button>
          <button onclick="ubahStatus(${index})" style="background:var(--green-700); color:#fff; border:none; padding:5px 9px; border-radius:6px; font-size:11px; cursor:pointer; margin-right:3px;">Status</button>
          <button onclick="hapusData(${index})" style="background:#FEE2E2; color:#DC2626; border:none; padding:5px 9px; border-radius:6px; font-size:11px; cursor:pointer;">Hapus</button>
        </td>
      </tr>
    `;
    dashTableBody.innerHTML += row;
  });
}

// Fungsi Pratinjau Dokumen PDF
function cekDokumen(index) {
  let dataLayanan = JSON.parse(localStorage.getItem("dataLayanan")) || [];
  const item = dataLayanan[index];
  
  if (item) {
    const namaFile = item.dokumen || 'Dokumen_Resmi.pdf';
    const konfirmasi = confirm(
      `📄 DETAIL BERKAS PENGAJUAN\n\n` +
      `• Nomor Resi: ${item.id}\n` +
      `• Jenis Layanan: ${item.jenis}\n` +
      `• Pemohon: ${item.pemohon}\n` +
      `• Organisasi: ${item.organisasi}\n` +
      `• Waktu: ${item.tanggal}\n` +
      `• Nama File PDF: ${namaFile}\n` +
      `• Catatan: ${item.keterangan || '-'}\n\n` +
      `[OK] untuk Membuka Pratinjau PDF\n` +
      `[Cancel] untuk Tutup`
    );

    if (konfirmasi) {
      const pdfWindow = window.open("", "_blank");
      if (pdfWindow) {
        pdfWindow.document.write(`
          <!DOCTYPE html>
          <html lang="id">
          <head>
            <meta charset="UTF-8">
            <title>Pratinjau PDF - ${namaFile}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f6f8; color: #333; }
              .pdf-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              h2 { color: #0B3B27; border-bottom: 2px solid #146C43; padding-bottom: 10px; }
              .info-box { background: #e8f5e9; padding: 15px; border-left: 5px solid #146C43; margin: 20px 0; border-radius: 4px; }
              .btn { display: inline-block; background: #146C43; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; cursor: pointer; border: none; }
              .btn:hover { background: #0B3B27; }
            </style>
          </head>
          <body>
            <div class="pdf-container">
              <h2>Pratinjau Dokumen Resmi (PDF)</h2>
              <div class="info-box">
                <p><strong>Nomor Resi:</strong> ${item.id}</p>
                <p><strong>Perihal:</strong> ${item.jenis}</p>
                <p><strong>Nama Pemohon:</strong> ${item.pemohon} (${item.organisasi})</p>
                <p><strong>Waktu Masuk:</strong> ${item.tanggal}</p>
              </div>
              <p><strong>Nama File Berkas:</strong> <code>${namaFile}</code></p>
              <p>Status dokumen ini sah tercatat dalam sistem administrasi terpadu PC IPNU-IPPNU Kota Blitar.</p>
              <hr style="border:0; border-top:1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">Simulasi Pratinjau Viewer Dokumen Organisasi.</p>
              <button class="btn" onclick="window.print()">Cetak / Simpan PDF</button>
            </div>
          </body>
          </html>
        `);
      } else {
        alert("Gagal membuka jendela baru. Periksa pengaturan pop-up browser Anda.");
      }
    }
  }
}

// Fungsi Ubah Status Pengajuan di Dashboard
function ubahStatus(index) {
  let dataLayanan = JSON.parse(localStorage.getItem("dataLayanan")) || [];
  if (dataLayanan[index]) {
    dataLayanan[index].status = dataLayanan[index].status === "Diproses" ? "Selesai" : "Diproses";
    localStorage.setItem("dataLayanan", JSON.stringify(dataLayanan));
    muatDataDashboard();
  }
}

// Fungsi Hapus Data Pengajuan di Dashboard
function hapusData(index) {
  if (confirm("Yakin ingin menghapus data pengajuan ini?")) {
    let dataLayanan = JSON.parse(localStorage.getItem("dataLayanan")) || [];
    dataLayanan.splice(index, 1);
    localStorage.setItem("dataLayanan", JSON.stringify(dataLayanan));
    muatDataDashboard();
  }
}

// Fungsi Simpan Statistik Beranda
function saveStats() {
  const pac = document.getElementById("editPac")?.value || 3;
  const pkpr = document.getElementById("editPkpr")?.value || 29;
  const kader = document.getElementById("editKader")?.value || 150;
  const kegiatan = document.getElementById("editKegiatan")?.value || 12;

  const newStats = { pac, pkpr, kader, kegiatan };
  localStorage.setItem("statsBeranda", JSON.stringify(newStats));
  alert("Statistik Beranda berhasil diperbarui!");
}