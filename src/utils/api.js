// Helper API untuk LaporGan dengan fallback cerdas ke localStorage jika backend offline
const BASE_URL = 'http://127.0.0.1:8000/api';

// Inisialisasi data dummy jika localStorage masih kosong
const initLocalStorage = () => {
  if (!localStorage.getItem('laporgan_kategori')) {
    const defaultKategori = [
      { id: 1, nama_kategori: 'Jalan Rusak & Infrastruktur' },
      { id: 2, nama_kategori: 'Fasilitas Umum & Lampu Jalan' },
      { id: 3, nama_kategori: 'Kebersihan & Sampah' },
      { id: 4, nama_kategori: 'Keamanan, Ketertiban & Pekat' },
      { id: 5, nama_kategori: 'Pelayanan Publik & Administrasi' }
    ];
    localStorage.setItem('laporgan_kategori', JSON.stringify(defaultKategori));
  }

  if (!localStorage.getItem('laporgan_pengaduan')) {
    const defaultPengaduan = [
      {
        id: 1,
        tiket_lacak: 'TKT-782910',
        judul_laporan: 'Jalan Berlubang Parah di Jembatan Merah',
        nama: 'Ahmad Subarjo',
        telegram_username: '@ahmad_subarjo',
        ktp: '3404011209980002',
        kategori: 'Jalan Rusak & Infrastruktur',
        lokasi_kejadian: 'Jl. Jembatan Merah No. 12, Condongcatur',
        isi_laporan: 'Jalan berlubang cukup dalam sekitar 15-20cm di sisi kiri jalan sebelum jembatan. Sangat membahayakan bagi pengendara sepeda motor, terutama di malam hari karena minimnya penerangan.',
        bukti_foto: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600',
        status_laporan: 'Selesai',
        tanggapan: 'Terima kasih atas laporan Anda. Petugas Dinas Pekerjaan Umum telah melakukan penambalan jalan berlubang tersebut pada tanggal 5 Juli 2026. Jalur kini sudah aman dilewati.',
        surat_tindak: 'surat_tindakan_tkt782910.pdf',
        created_at: '2026-07-01T09:30:00.000Z',
        updated_at: '2026-07-05T14:20:00.000Z'
      },
      {
        id: 2,
        tiket_lacak: 'TKT-901827',
        judul_laporan: 'Lampu Penerangan Jalan Padam di Selokan Mataram',
        nama: 'Rina Wijayanti',
        telegram_username: '@rina_wjy',
        ktp: '3404024503950001',
        kategori: 'Fasilitas Umum & Lampu Jalan',
        lokasi_kejadian: 'Sepanjang Jl. Selokan Mataram dekat Universitas AMIKOM',
        isi_laporan: 'Terdapat sekitar 3 tiang lampu jalan berturut-turut yang mati total sejak seminggu lalu. Kawasan menjadi sangat gelap dan rawan tindakan kriminalitas jalanan.',
        bukti_foto: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?q=80&w=600',
        status_laporan: 'Sedang Diproses',
        tanggapan: 'Laporan telah diterima dan diteruskan ke Dinas Perhubungan/PJU. Saat ini teknisi sedang menjadwalkan penggantian lampu merkuri yang rusak. Estimasi selesai perbaikan dalam 2 hari kerja.',
        surat_tindak: '',
        created_at: '2026-07-06T20:15:00.000Z',
        updated_at: '2026-07-07T08:00:00.000Z'
      },
      {
        id: 3,
        tiket_lacak: 'TKT-118273',
        judul_laporan: 'Penumpukan Sampah Liar di Pinggir Sungai',
        nama: 'Dedi Kurniawan',
        telegram_username: '@dedikurnia',
        ktp: '3404031707900003',
        kategori: 'Kebersihan & Sampah',
        lokasi_kejadian: 'Bantaran Sungai Code, Prawirodirjan',
        isi_laporan: 'Banyak warga membuang sampah sembarangan di bantaran sungai hingga menumpuk dan menimbulkan bau tidak sedap yang menyengat serta mengundang lalat. Perlu adanya papan larangan dan tempat sampah resmi.',
        bukti_foto: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600',
        status_laporan: 'Diterima',
        tanggapan: 'Laporan Anda sudah kami terima dan akan segera disurvei oleh tim kebersihan kecamatan setempat untuk pembersihan masal serta pemasangan plang larangan membuang sampah.',
        surat_tindak: '',
        created_at: '2026-07-08T06:45:00.000Z',
        updated_at: '2026-07-08T07:15:00.000Z'
      },
      {
        id: 4,
        tiket_lacak: 'TKT-445512',
        judul_laporan: 'Pungli Parkir di Kawasan Wisata Kuliner',
        nama: 'Hendry',
        telegram_username: '@hendry_cool',
        ktp: '3174092803890004',
        kategori: 'Keamanan, Ketertiban & Pekat',
        lokasi_kejadian: 'Area Parkir kuliner malam Babarsari',
        isi_laporan: 'Juru parkir liar meminta tarif parkir motor sebesar Rp 5.000 tanpa karcis resmi. Saat ditolak mereka bertindak intimidatif. Mohon ditindaklanjuti karena merusak kenyamanan wisatawan.',
        bukti_foto: 'https://images.unsplash.com/photo-1506521788723-868114856b3d?q=80&w=600',
        status_laporan: 'Ditolak',
        tanggapan: 'Laporan ditolak setelah petugas melakukan sidak lapangan. Juru parkir tersebut ternyata memiliki izin resmi dari pengelola setempat dengan tarif yang disepakati untuk even kuliner malam khusus akhir pekan.',
        surat_tindak: '',
        created_at: '2026-07-04T12:00:00.000Z',
        updated_at: '2026-07-04T15:30:00.000Z'
      }
    ];
    localStorage.setItem('laporgan_pengaduan', JSON.stringify(defaultPengaduan));
  }

  if (!localStorage.getItem('laporgan_landing_content')) {
    const defaultLandingContent = {
      hero: {
        welcome: 'Selamat datang di',
        title: 'LAPORGAN',
        text1: 'Sering menemui jalan berlubang, fasilitas rusak, atau pelayanan publik yang lambat? Anda tidak sendirian.',
        text2: 'Laporkan keluhan, saran, atau pelanggaran yang Anda temui di lingkungan di sini'
      },
      about: {
        title: 'TENTANG',
        subtitle: 'LAYANAN',
        description: 'Laporgan hadir untuk memutus rantai birokrasi tersebut. Dengan platform digital yang aman, jaminan privasi, dan fitur pelacakan status laporan secara real-time, suara Anda kini bisa membawa perubahan. Lapor cepat, pantau mudah, dan wujudkan lingkungan yang lebih baik sekarang!',
        services: [
          {
            judul: 'Akses untuk Semua',
            deskripsi: 'Setiap warga bisa menyampaikan aduan tanpa hambatan.',
            logo: 'fa-solid fa-user'
          },
          {
            judul: 'Privasi Terjamin',
            deskripsi: 'Data dan identitas pelapor dijaga dengan baik.',
            logo: 'fa-solid fa-shield-halved'
          },
          {
            judul: 'Pantau Aduan',
            deskripsi: 'Lacak status pengaduan secara real-time dari dashboard.',
            logo: 'fa-solid fa-eye'
          }
        ]
      },
      jenis: {
        title: 'Jenis Pengaduan',
        description: 'Platform pengaduan ini menyediakan berbagai jenis kategori pengaduan yang dapat diakses oleh masyarakat. Masing-masing kategori dirancang untuk menangani isu-isu yang berbeda, sehingga pengaduan yang disampaikan dapat segera diproses dan ditangani oleh pihak yang berwenang.',
        list: [
          {
            judul: 'Layanan Publik',
            deskripsi: 'Pengaduan terkait kualitas atau ketidakpuasan terhadap layanan yang diberikan oleh instansi pemerintah, seperti pelayanan kesehatan, pendidikan, dan administrasi'
          },
          {
            judul: 'Keamanan',
            deskripsi: 'Pengaduan mengenai masalah keamanan, seperti tindakan kriminal, kehilangan barang, kebocoran data pribadi, kebisingan, atau gangguan ketertiban umum'
          },
          {
            judul: 'Fasilitas Umum',
            deskripsi: 'Pengaduan mengenai kondisi fasilitas umum, seperti jalan, jembatan, taman, halte bus, dan sarana transportasi yang tidak memadai atau rusak'
          },
          {
            judul: 'Seksual',
            deskripsi: 'Pengaduan seksual meliputi pelecehan, kekerasan, dan eksploitasi seksual yang dialami di berbagai lingkungan seperti tempat kerja, sekolah, atau rumah tangga'
          }
        ]
      },
      langkah: {
        title: 'Langkah Pengaduan',
        description: 'Membiarkan masalah tersebut bukan hanya mengganggu kenyamanan, tapi juga merugikan banyak pihak. Sayangnya, proses pelaporan yang rumit dan kekhawatiran akan bocornya privasi seringkali membuat kita memilih untuk diam.',
        list: [
          {
            nomor: '1',
            judul: 'Hubungi Bot Telegram',
            deskripsi: 'Kirim pesan ke bot Telegram @LayananAduan_Bot untuk mendapatkan akses pengaduan.'
          },
          {
            nomor: '2',
            judul: 'Isi Formulir',
            deskripsi: 'Lengkapi formulir yang disediakan dengan informasi yang diperlukan mengenai pengaduan Anda.'
          },
          {
            nomor: '3',
            judul: 'Lampirkan Bukti',
            deskripsi: 'Sertakan dokumen atau bukti pendukung yang relevan untuk memperkuat pengaduan Anda.'
          },
          {
            nomor: '4',
            judul: 'Periksa Ulang',
            deskripsi: 'Pastikan semua informasi yang Anda berikan akurat dan valid sebelum mengirimkan pengaduan.'
          },
          {
            nomor: '5',
            judul: 'Tindak Lanjut',
            deskripsi: 'Setelah pengaduan diajukan, pihak terkait akan memberikan tanggapan atau tindakan selanjutnya.'
          }
        ]
      }
    };
    localStorage.setItem('laporgan_landing_content', JSON.stringify(defaultLandingContent));
  }
};

// Panggil fungsi inisialisasi saat script dimuat
initLocalStorage();

// Helper untuk membaca file ke base64 (kembali dengan promise)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const api = {
  // ==================== KATEGORI ====================
  async getKategori() {
    try {
      const response = await fetch(`${BASE_URL}/kategori`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Backend API /kategori tidak dapat dijangkau, menggunakan localStorage fallback', e);
    }
    return JSON.parse(localStorage.getItem('laporgan_kategori') || '[]');
  },

  async addKategori(namaKategori) {
    try {
      const response = await fetch(`${BASE_URL}/kategori`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kategori: namaKategori }),
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gagal menghubungi backend untuk menambah kategori, simpan lokal.', e);
    }

    const kategori = JSON.parse(localStorage.getItem('laporgan_kategori') || '[]');
    const newKategori = {
      id: kategori.length > 0 ? Math.max(...kategori.map(k => k.id)) + 1 : 1,
      nama_kategori: namaKategori
    };
    kategori.push(newKategori);
    localStorage.setItem('laporgan_kategori', JSON.stringify(kategori));
    return newKategori;
  },

  async updateKategori(id, namaKategori) {
    try {
      const response = await fetch(`${BASE_URL}/kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kategori: namaKategori }),
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gagal menghubungi backend untuk update kategori, simpan lokal.', e);
    }

    const kategori = JSON.parse(localStorage.getItem('laporgan_kategori') || '[]');
    const index = kategori.findIndex(k => k.id === parseInt(id));
    if (index !== -1) {
      kategori[index].nama_kategori = namaKategori;
      localStorage.setItem('laporgan_kategori', JSON.stringify(kategori));
      return kategori[index];
    }
    throw new Error('Kategori tidak ditemukan');
  },

  async deleteKategori(id) {
    try {
      const response = await fetch(`${BASE_URL}/kategori/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Gagal menghubungi backend untuk hapus kategori, simpan lokal.', e);
    }

    let kategori = JSON.parse(localStorage.getItem('laporgan_kategori') || '[]');
    kategori = kategori.filter(k => k.id !== parseInt(id));
    localStorage.setItem('laporgan_kategori', JSON.stringify(kategori));
    return true;
  },

  // ==================== PENGADUAN ====================
  async getPengaduan() {
    try {
      const response = await fetch(`${BASE_URL}/pengaduan`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Backend API /pengaduan tidak dapat dijangkau, menggunakan localStorage fallback', e);
    }
    return JSON.parse(localStorage.getItem('laporgan_pengaduan') || '[]');
  },

  async createPengaduan(formDataObj) {
    let isFormData = formDataObj instanceof FormData;
    
    try {
      let bodyData = formDataObj;
      if (!isFormData) {
        bodyData = new FormData();
        Object.keys(formDataObj).forEach(key => {
          bodyData.append(key, formDataObj[key]);
        });
      }

      const response = await fetch(`${BASE_URL}/pengaduan`, {
        method: 'POST',
        body: bodyData,
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gagal mengirim pengaduan ke backend, fallback ke localStorage', e);
    }

    let judul_laporan, nama, telegram_username, ktp, kategori, lokasi_kejadian, isi_laporan, bukti_foto_file;
    
    if (isFormData) {
      judul_laporan = formDataObj.get('judul_laporan');
      nama = formDataObj.get('nama');
      telegram_username = formDataObj.get('telegram_username');
      ktp = formDataObj.get('ktp');
      kategori = formDataObj.get('kategori');
      lokasi_kejadian = formDataObj.get('lokasi_kejadian');
      isi_laporan = formDataObj.get('isi_laporan');
      bukti_foto_file = formDataObj.get('bukti_foto');
    } else {
      ({ judul_laporan, nama, telegram_username, ktp, kategori, lokasi_kejadian, isi_laporan, bukti_foto: bukti_foto_file } = formDataObj);
    }

    let fotoUrl = 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=600';
    if (bukti_foto_file && bukti_foto_file instanceof File) {
      try {
        fotoUrl = await fileToBase64(bukti_foto_file);
      } catch (err) {
        console.error('Gagal mengkonversi foto ke base64:', err);
      }
    } else if (typeof bukti_foto_file === 'string') {
      fotoUrl = bukti_foto_file;
    }

    const randomTicket = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    const pengaduanList = JSON.parse(localStorage.getItem('laporgan_pengaduan') || '[]');
    
    const newPengaduan = {
      id: pengaduanList.length > 0 ? Math.max(...pengaduanList.map(p => p.id)) + 1 : 1,
      tiket_lacak: randomTicket,
      judul_laporan,
      nama,
      telegram_username,
      ktp,
      kategori,
      lokasi_kejadian,
      isi_laporan,
      bukti_foto: fotoUrl,
      status_laporan: 'Diterima',
      tanggapan: 'Laporan Anda sudah kami terima dan akan segera diverifikasi oleh tim admin LaporGan.',
      surat_tindak: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    pengaduanList.push(newPengaduan);
    localStorage.setItem('laporgan_pengaduan', JSON.stringify(pengaduanList));
    return newPengaduan;
  },

  async checkTelegram(username) {
    try {
      const response = await fetch(`${BASE_URL}/cek-telegram/${username}`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gagal memvalidasi Telegram via API, anggap valid secara lokal.', e);
    }
    return { valid: username && username.startsWith('@') };
  },

  async lacakPengaduan(tiket, ktp) {
    try {
      const response = await fetch(`${BASE_URL}/lacak?tiket=${tiket}&ktp=${ktp}`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const data = await response.json();
        if (data) return data;
      }
    } catch (e) {
      console.warn('Gagal melacak via backend, lacak secara lokal di localStorage', e);
    }

    const pengaduanList = JSON.parse(localStorage.getItem('laporgan_pengaduan') || '[]');
    const found = pengaduanList.find(p => p.tiket_lacak === tiket && p.ktp === ktp);
    return found || null;
  },

  async updatePengaduanStatus(id, { status_laporan, tanggapan, surat_tindak_file }) {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('status_laporan', status_laporan);
      formData.append('tanggapan', tanggapan || '');
      if (surat_tindak_file && surat_tindak_file instanceof File) {
        formData.append('surat_tindak', surat_tindak_file);
      }

      const response = await fetch(`${BASE_URL}/pengaduan/${id}`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gagal update pengaduan via backend, simpan lokal.', e);
    }

    const pengaduanList = JSON.parse(localStorage.getItem('laporgan_pengaduan') || '[]');
    const index = pengaduanList.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      pengaduanList[index].status_laporan = status_laporan;
      pengaduanList[index].tanggapan = tanggapan || '';
      pengaduanList[index].updated_at = new Date().toISOString();
      
      if (surat_tindak_file) {
        if (surat_tindak_file instanceof File) {
          pengaduanList[index].surat_tindak = surat_tindak_file.name;
        } else {
          pengaduanList[index].surat_tindak = surat_tindak_file;
        }
      }

      localStorage.setItem('laporgan_pengaduan', JSON.stringify(pengaduanList));
      return pengaduanList[index];
    }
    throw new Error('Pengaduan tidak ditemukan');
  },

  async deletePengaduan(id) {
    try {
      const response = await fetch(`${BASE_URL}/pengaduan/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Gagal hapus pengaduan via backend, hapus lokal.', e);
    }

    let pengaduanList = JSON.parse(localStorage.getItem('laporgan_pengaduan') || '[]');
    pengaduanList = pengaduanList.filter(p => p.id !== parseInt(id));
    localStorage.setItem('laporgan_pengaduan', JSON.stringify(pengaduanList));
    return true;
  },

  async getLandingContent() {
    try {
      const response = await fetch(`${BASE_URL}/landing-content`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Offline
    }
    return JSON.parse(localStorage.getItem('laporgan_landing_content'));
  },

  async saveLandingContent(content) {
    try {
      const response = await fetch(`${BASE_URL}/landing-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Offline
    }
    localStorage.setItem('laporgan_landing_content', JSON.stringify(content));
    return content;
  }
};
