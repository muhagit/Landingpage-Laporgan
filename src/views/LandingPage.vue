<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';
import { supabase } from '@/lib/supabaseClient';
import BlueButton from "@/components/BlueButton.vue";
import BlackButtonOutline from "@/components/BlackButtonOutline.vue";
import FooterBlue from "@/components/FooterBlue.vue";
import defaultHeroImage from '@/assets/Images/hero1.png';

const loading = ref(true);
const landingData = ref(null);
const beritaList = ref([]);
const activeFaq = ref(null);

const heroTitle = ref('Suarakan Keluhan Anda di LaporGan')
const heroSubtitle = ref('Sering menemui jalan berlubang, lampu jalan padam, penumpukan sampah, atau pelayanan publik yang lambat? Anda tidak sendiri, dan kini Anda bisa bertindak.')

const defaultLandingContent = {
  hero: {
    welcome: 'Aspirasi & Laporan Digital Warga',
    title: 'LAPORGAN',
    text1: 'Sering menemui jalan berlubang, lampu jalan padam, penumpukan sampah, atau pelayanan publik yang lambat? Anda tidak sendiri, dan kini Anda bisa bertindak.',
    text2: 'LaporGan hadir sebagai wadah pengaduan online yang cepat, aman, dan 100% transparan. Suarakan keluhan Anda hari ini dan kawal penyelesaiannya secara langsung!'
  },
  about: {
    title: 'TENTANG LAPORGAN',
    subtitle: 'Solusi Pelaporan Modern',
    description: 'Kami percaya bahwa lingkungan yang nyaman bermula dari kepedulian warganya. LaporGan memotong rantai birokrasi yang lambat dan berbelit-belit. Mengintegrasikan teknologi web dan bot Telegram, kami menghubungkan keluhan Anda langsung ke instansi daerah penanggung jawab secara transparan dan akuntabel.',
    services: [
      {
        judul: 'Identitas Rahasia & Aman',
        deskripsi: 'Data pribadi dan identitas Anda dilindungi dengan enkripsi terbaik. Melapor dengan aman tanpa perlu merasa khawatir.',
        logo: 'fa-solid fa-shield-halved'
      },
      {
        judul: 'Pelacakan Real-time',
        deskripsi: 'Pantau kemajuan laporan Anda secara transparan langsung dari dashboard mulai dari Diterima, Diproses, hingga Selesai.',
        logo: 'fa-solid fa-eye'
      },
      {
        judul: 'Bebas Jalur Birokrasi',
        deskripsi: 'Laporan Anda diverifikasi oleh tim admin dan diteruskan langsung ke instansi teknis yang berwenang menangani.',
        logo: 'fa-solid fa-people-arrows'
      }
    ]
  },
  jenis: {
    title: 'Kategori Pengaduan Utama',
    description: 'Kami menampung berbagai aspirasi dan keluhan fasilitas publik. Pilih kategori yang tepat agar laporan Anda segera ditugaskan ke dinas terkait.',
    list: [
      {
        judul: 'Infrastruktur Jalan & Jembatan',
        deskripsi: 'Jalan berlubang, jembatan rusak, pembatas jalan yang hancur, atau trotoar yang tidak layak pakai.'
      },
      {
        judul: 'Fasilitas Penerangan & PJU',
        deskripsi: 'Lampu jalan mati (PJU), lampu lalu lintas error, tiang listrik miring, atau kabel melintang yang membahayakan.'
      },
      {
        judul: 'Kebersihan & Saluran Air',
        deskripsi: 'Penumpukan sampah liar, pembuangan limbah sembarangan, selokan tersumbat banjir, atau pohon tumbang.'
      },
      {
        judul: 'Keamanan & Ketertiban Umum',
        deskripsi: 'Pungutan liar (pungli), gangguan kebisingan malam hari, juru parkir liar intimidatif, atau pelanggaran ketertiban.'
      }
    ]
  },
  langkah: {
    title: '5 Langkah Mudah Melapor',
    description: 'Jangan biarkan masalah publik mengganggu kenyamanan. Ikuti alur pengiriman pengaduan berikut ini:',
    list: [
      {
        nomor: '1',
        judul: 'Dapatkan Token Telegram',
        deskripsi: 'Mulai dengan menyapa bot Telegram resmi kami @LayananAduan_Bot untuk memverifikasi akun Anda.'
      },
      {
        nomor: '2',
        judul: 'Isi Formulir Laporan',
        deskripsi: 'Buka form pengaduan di website ini, tulis judul laporan yang jelas serta jelaskan kronologinya.'
      },
      {
        nomor: '3',
        judul: 'Tentukan Lokasi & Foto',
        deskripsi: 'Tandai lokasi spesifik kejadian dan lampirkan bukti foto yang jelas agar tim dinas mudah melakukan survei.'
      },
      {
        nomor: '4',
        judul: 'Verifikasi Tim Admin',
        deskripsi: 'Admin LaporGan memvalidasi kelayakan laporan sebelum menugaskannya langsung ke dinas berwenang.'
      },
      {
        nomor: '5',
        judul: 'Pantau Hasil Perbaikan',
        deskripsi: 'Lacak tiket aduan Anda. Anda akan menerima notifikasi penyelesaian lengkap dengan foto hasil kerja dinas.'
      }
    ]
  },
  cta: {
    title: 'Siap Menjadi Agen Perubahan?',
    text: 'Jangan biarkan jalan rusak, tumpukan sampah, atau pemadaman lampu mengganggu kenyamanan bersama. Laporkan permasalahan di lingkungan Anda dalam hitungan detik.',
    button: 'Mulai Buat Pengaduan'
  }
};

const stats = ref([
  { value: '1,450+', label: 'Aduan Masuk', icon: 'fas fa-clipboard-list', color: '#4B70F5' },
  { value: '92%', label: 'Rasio Penyelesaian', icon: 'fas fa-check-double', color: '#198754' },
  { value: '< 24 Jam', label: 'Respon Awal', icon: 'fas fa-bolt', color: '#ffc107' },
  { value: '5', label: 'Kecamatan Terlayani', icon: 'fas fa-map-marked-alt', color: '#0dcaf0' }
]);

const faqs = ref([
  {
    q: 'Apakah layanan LaporGan ini dipungut biaya?',
    a: 'Sama sekali tidak. Platform LaporGan disediakan sepenuhnya gratis untuk mempermudah warga dalam berpartisipasi menjaga fasilitas publik.'
  },
  {
    q: 'Apakah data diri dan identitas saya aman?',
    a: 'Keamanan data Anda adalah prioritas utama kami. Nama asli dan nomor identitas Anda disembunyikan sepenuhnya dari publik, dan hanya digunakan oleh admin untuk verifikasi internal jika diperlukan.'
  },
  {
    q: 'Bagaimana cara melacak status penanganan laporan saya?',
    a: 'Setiap laporan yang berhasil dikirim akan mendapatkan nomor tiket pelacakan unik. Anda dapat memasukkan nomor tiket dan NIK KTP Anda di halaman "Lacak Pengaduan" untuk memantau statusnya.'
  },
  {
    q: 'Berapa lama laporan saya akan ditindaklanjuti?',
    a: 'Proses verifikasi admin memerlukan waktu maksimal 24 jam. Durasi pengerjaan di lapangan oleh dinas terkait bervariasi bergantung pada skala kerusakan dan prioritas anggaran, rata-rata diselesaikan dalam 2 hingga 7 hari kerja.'
  }
]);

const testimonials = ref([
  {
    name: 'Budi Santoso',
    location: 'Condongcatur',
    avatar: 'B',
    comment: 'Jalan berlubang parah di depan komplek kami sering membuat pengendara jatuh di malam hari. Setelah saya lapor di LaporGan dengan foto, dalam waktu 3 hari jalan sudah diaspal mulus oleh dinas PU. Sangat praktis!',
    rating: 5
  },
  {
    name: 'Rina Wijayanti',
    location: 'Babarsari',
    avatar: 'R',
    comment: 'Lampu jalan dekat halte mati berminggu-minggu membuat area menjadi rawan. Saya laporkan lewat web ini, status langsung diupdate ke "Diproses". Lusa harinya teknisi datang mengganti bohlam baru. Responsnya luar biasa!',
    rating: 5
  },
  {
    name: 'Dedi Kurniawan',
    location: 'Prawirodirjan',
    avatar: 'D',
    comment: 'Tumpukan sampah liar di pinggir sungai yang menyumbat air akhirnya diangkut secara massal oleh dinas kebersihan kecamatan setelah viral di laporan platform ini. Sekarang dipasang plang larangan buang sampah.',
    rating: 4
  }
]);

const loadData = async () => {
  loading.value = true;
  try {
    const content = await api.getLandingContent();
    if (content) {
      landingData.value = content;
      if (content.hero?.title) heroTitle.value = content.hero.title;
      if (content.hero?.text1) heroSubtitle.value = content.hero.text1;
      if (content.stats && content.stats.length > 0) stats.value = content.stats;
      if (content.testimonials && content.testimonials.length > 0) testimonials.value = content.testimonials;
      if (content.faq_list && content.faq_list.length > 0) faqs.value = content.faq_list;
    } else {
      landingData.value = defaultLandingContent;
    }
    
    // Fetch news for preview
    const news = await api.getBerita();
    beritaList.value = news.slice(0, 3); // Ambil 3 berita terbaru
  } catch (error) {
    console.error('Error loading landing page data:', error);
    landingData.value = defaultLandingContent;
  } finally {
    loading.value = false;
  }
};

const toggleFaq = (index) => {
  if (activeFaq.value === index) {
    activeFaq.value = null;
  } else {
    activeFaq.value = index;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="landing-page-wrapper">
    <!-- Loader -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading LaporGan...</span>
      </div>
    </div>

    <div v-else>
      <!-- Hero Section -->
      <section class="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        <!-- Brand Logo & Name in Top Left (Aligned with container) -->
        <div class="position-absolute top-0 start-0 w-100 z-3" style="padding-top: 2.5rem;">
          <div class="container">
            <router-link to="/" class="text-decoration-none d-flex align-items-center gap-2 d-inline-flex">
              <img src="@/assets/logo.png" alt="LaporGan Logo" style="height: 38px; width: 44px; object-fit: fill;" />
              <span class="fw-black text-dark fs-4 tracking-tight" style="font-family: 'Poppins', sans-serif; line-height: 1;">LaporGan</span>
            </router-link>
          </div>
        </div>

        <div class="glow-blob bg-blue opacity-10 position-absolute start-0 top-0 translate-middle rounded-circle" style="width: 600px; height: 600px; filter: blur(120px);"></div>
        <div class="glow-blob bg-purple opacity-10 position-absolute end-0 bottom-0 translate-middle rounded-circle" style="width: 500px; height: 500px; filter: blur(120px); background: #7b2cbf;"></div>
        
        <div class="container py-5 z-2">
          <div class="row align-items-center justify-content-between g-5">
            <div class="col-lg-7 text-center text-lg-start" data-aos="fade-right" data-aos-duration="1000">
              <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold mb-3 tracking-wide text-uppercase" style="font-size: 0.85rem;">
                <i class="fas fa-bullhorn me-1"></i> {{ landingData.hero.welcome }}
              </span>
              <h1 class="display-3 fw-black text-dark mb-3 hero-title" style="line-height: 1.1;">
                {{ heroTitle }}
              </h1>
              <p class="lead text-secondary mb-4 fs-5" style="line-height: 1.6;">
                {{ heroSubtitle }}
              </p>
              <p class="text-secondary mb-5 fs-6 opacity-75">
                {{ landingData.hero.text2 }}
              </p>
              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <router-link to="/formpengaduan" class="text-decoration-none">
                  <BlueButton text="Buat Laporan Sekarang" class="btn-glow-primary px-4 py-3" icon="fa fa-arrow-right" />
                </router-link>
                <a href="#tentang" class="text-decoration-none">
                  <BlackButtonOutline text="Pelajari Selengkapnya" class="px-4 py-3" icon="fas fa-arrow-down" />
                </a>
              </div>

              <!-- Mini Floating Info -->
              <div class="d-flex align-items-center justify-content-center justify-content-lg-start gap-4 mt-5 pt-3 opacity-90 border-top border-light border-2">
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-shield-alt text-success fs-4"></i>
                  <span class="fs-7 fw-medium text-secondary">Identitas Warga Aman</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-check-circle text-primary fs-4"></i>
                  <span class="fs-7 fw-medium text-secondary">100% Bebas Biaya</span>
                </div>
              </div>
            </div>

            <!-- Hero Visual Graphics -->
            <div class="col-lg-5 position-relative text-center d-none d-lg-block" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
              <div class="hero-image-container position-relative mx-auto">
                <!-- Main Mockup -->
                <div class="mockup-card shadow-2xl p-4 bg-white rounded-5 border border-light position-relative z-2">
                  <div class="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light">
                    <div class="bg-danger rounded-circle" style="width: 10px; height: 10px;"></div>
                    <div class="bg-warning rounded-circle" style="width: 10px; height: 10px;"></div>
                    <div class="bg-success rounded-circle" style="width: 10px; height: 10px;"></div>
                    <span class="fs-8 text-muted ms-auto fw-bold">laporgan.web.id/lacakpengaduan</span>
                  </div>
                  <!-- Simulated Ticket Tracker UI -->
                  <div class="ticket-preview text-start bg-light p-3 rounded-4 border border-light-subtle">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="badge bg-primary bg-opacity-10 text-primary fw-bold fs-8">TKT-901827</span>
                      <span class="badge bg-warning text-dark fw-bold fs-9 rounded-pill px-2.5 py-1">Sedang Diproses</span>
                    </div>
                    <h6 class="fw-bold text-dark mb-1 fs-7">Lampu Jalan Padam total dekat Kampus</h6>
                    <p class="fs-9 text-muted mb-2 text-truncate">Kawasan gelap gulita sejak seminggu lalu. Rawan tindak kriminalitas...</p>
                    <div class="d-flex align-items-center gap-2 pt-2 border-top border-light-subtle">
                      <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; font-size: 10px;">
                        <i class="fas fa-tools"></i>
                      </div>
                      <span class="fs-9 text-muted">Teknisi sedang menjadwalkan pergantian lampu</span>
                    </div>
                  </div>
                  <img :src="landingData?.hero?.image || defaultHeroImage" alt="Illustration" class="img-fluid mt-3 rounded-4" style="max-height: 250px; width: 100%; object-fit: cover;" />
                </div>

                <!-- Floating Badges -->
                <div class="floating-badge text-start shadow-lg p-3 bg-white bg-opacity-90 rounded-4 border border-light position-absolute top-10 start-0 translate-middle-x z-3" style="max-width: 180px; backdrop-filter: blur(10px);">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 20px; height: 20px; font-size: 10px;">
                      <i class="fas fa-check"></i>
                    </div>
                    <span class="fw-bold text-dark fs-8">Laporan Selesai</span>
                  </div>
                  <span class="fs-9 text-secondary">Penambalan jalan berlubang di Condongcatur sukses dilakukan.</span>
                </div>

                <div class="floating-badge text-start shadow-lg p-3 bg-white bg-opacity-90 rounded-4 border border-light position-absolute bottom-10 end-0 translate-middle-y z-3" style="max-width: 180px; backdrop-filter: blur(10px);">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <div class="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 20px; height: 20px; font-size: 10px;">
                      <i class="fas fa-paper-plane"></i>
                    </div>
                    <span class="fw-bold text-dark fs-8">Laporan Masuk</span>
                  </div>
                  <span class="fs-9 text-secondary">Penumpukan sampah liar di Prawirodirjan terkirim.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section py-5 bg-blue text-white position-relative overflow-hidden">
        <div class="container position-relative z-2">
          <div class="row g-4 align-items-center">
            <div class="col-lg-3 text-center text-lg-start" data-aos="fade-up">
              <h3 class="fw-bold mb-2">LaporGan Dalam Angka</h3>
              <p class="opacity-75 fs-7 mb-0">Dedikasi kami bersama masyarakat dan instansi pemerintah daerah mewujudkan kota tanggap keluhan.</p>
            </div>
            <div class="col-lg-9">
              <div class="row g-4">
                <div v-for="(stat, idx) in stats" :key="idx" class="col-6 col-md-3" data-aos="fade-up" :data-aos-delay="100 * idx">
                  <div class="stat-card p-4 rounded-4 text-center bg-white bg-opacity-10 border border-white border-opacity-10 h-100 hover-lift-up">
                    <div class="icon-box mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" :style="{ backgroundColor: 'rgba(255,255,255,0.15)', width: '50px', height: '50px' }">
                      <i :class="stat.icon" class="fs-4" :style="{ color: '#ffffff' }"></i>
                    </div>
                    <h2 class="display-6 fw-extrabold mb-1" style="letter-spacing: -1px;">{{ stat.value }}</h2>
                    <span class="fs-7 fw-medium text-white text-opacity-80">{{ stat.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="about-section py-6 bg-grey" id="tentang">
        <div class="container min-vh-90 d-flex flex-column justify-content-center">
          <div class="row justify-content-center mb-5 text-center">
            <div class="col-lg-8" data-aos="fade-up">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">{{ landingData.about.subtitle }}</h6>
              <h2 class="display-5 fw-bold text-dark mb-4">{{ landingData.about.title }}</h2>
              <div class="custom-divider mx-auto mb-4" style="width: 80px; height: 4px; background-color: var(--blue-color); border-radius: 2px;"></div>
              <p class="lead text-secondary text-center px-lg-4 fs-6" style="line-height: 1.7;">
                {{ landingData.about.description }}
              </p>
            </div>
          </div>

          <div class="row g-4 justify-content-center mt-2">
            <div v-for="(service, idx) in landingData.about.services" :key="idx" class="col-lg-4 col-md-6" data-aos="zoom-in" :data-aos-delay="idx * 150">
              <div class="feature-card card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift-up transition-all bg-white">
                <div class="card-body p-2 text-start">
                  <div class="feature-icon mb-4 d-inline-flex align-items-center justify-content-center rounded-4 text-white bg-primary bg-opacity-10" style="width: 60px; height: 60px;">
                    <i :class="service.logo" class="fs-3 text-primary"></i>
                  </div>
                  <h4 class="card-title fw-bold text-dark mb-3">{{ service.judul }}</h4>
                  <p class="card-text text-secondary fs-7" style="line-height: 1.6;">{{ service.deskripsi }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section py-6 bg-white position-relative">
        <div class="container py-4">
          <div class="row align-items-center g-5">
            <div class="col-lg-4" data-aos="fade-right">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Batas Pengaduan</h6>
              <h2 class="display-6 fw-bold text-dark mb-4">{{ landingData.jenis.title }}</h2>
              <p class="text-secondary mb-4 fs-7" style="line-height: 1.6;">
                {{ landingData.jenis.description }}
              </p>
              <div class="p-3 bg-light rounded-4 border border-light-subtle d-flex align-items-center gap-3">
                <i class="fas fa-info-circle text-primary fs-3"></i>
                <span class="fs-8 text-secondary">Aduan Anda akan otomatis difilter dan diarahkan ke dinas yang paling berwenang secara cepat.</span>
              </div>
            </div>

            <div class="col-lg-8" data-aos="fade-left">
              <div class="row g-4">
                <div v-for="(item, idx) in landingData.jenis.list" :key="idx" class="col-md-6">
                  <div class="category-card p-4 rounded-4 border border-light-subtle bg-light hover-shadow h-100 transition-all text-start">
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <div class="avatar-num bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; font-size: 14px;">
                        {{ idx + 1 }}
                      </div>
                      <h5 class="fw-bold text-dark mb-0">{{ item.judul }}</h5>
                    </div>
                    <p class="text-secondary fs-7 mb-0" style="line-height: 1.6;">{{ item.deskripsi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="steps-section py-6 bg-grey" id="langkahpengaduan">
        <div class="container py-4">
          <div class="row justify-content-center mb-5 text-center">
            <div class="col-lg-8" data-aos="fade-up">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Proses Pelaporan</h6>
              <h2 class="display-5 fw-bold text-dark mb-3">{{ landingData.langkah.title }}</h2>
              <div class="custom-divider mx-auto mb-4" style="width: 80px; height: 4px; background-color: var(--blue-color); border-radius: 2px;"></div>
              <p class="lead text-secondary px-lg-4 fs-6 text-center">
                {{ landingData.langkah.description }}
              </p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="timeline-row row g-4 justify-content-center position-relative mt-5">
            <div class="timeline-line d-none d-lg-block position-absolute bg-primary bg-opacity-25" style="height: 4px; width: 75%; top: 50px; z-index: 1;"></div>
            
            <div v-for="(step, idx) in landingData.langkah.list" :key="idx" class="col-lg-2.4 col-md-6 col-sm-12 position-relative z-2" data-aos="fade-up" :data-aos-delay="idx * 150">
              <div class="step-card text-center p-3 h-100 d-flex flex-column align-items-center">
                <div class="step-number-container mb-4 position-relative d-flex align-items-center justify-content-center">
                  <div class="step-number bg-white text-primary border border-primary border-4 rounded-circle d-flex align-items-center justify-content-center fw-black shadow" style="width: 65px; height: 65px; font-size: 1.5rem; z-index: 2;">
                    {{ step.nomor }}
                  </div>
                  <div class="step-glow bg-primary opacity-20 position-absolute rounded-circle" style="width: 80px; height: 80px; filter: blur(5px); z-index: 1;"></div>
                </div>
                <h5 class="fw-bold text-dark mb-2 fs-6">{{ step.judul }}</h5>
                <p class="text-secondary fs-8 px-2" style="line-height: 1.5;">{{ step.deskripsi }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section v-if="beritaList.length > 0" class="news-section py-6 bg-white">
        <div class="container py-4">
          <div class="row justify-content-center mb-5 text-center">
            <div class="col-lg-8" data-aos="fade-up">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Pembaruan Wilayah</h6>
              <h2 class="display-6 fw-bold text-dark mb-3">Berita & Informasi Terbaru</h2>
              <div class="custom-divider mx-auto mb-3" style="width: 80px; height: 4px; background-color: var(--blue-color); border-radius: 2px;"></div>
            </div>
          </div>

          <div class="row g-4 justify-content-center" data-aos="fade-up" data-aos-delay="200">
            <div v-for="news in beritaList" :key="news.id" class="col-lg-4 col-md-6">
              <div class="card h-100 news-card border-0 shadow-sm rounded-4 overflow-hidden hover-shadow">
                <div class="position-relative" style="height: 200px; overflow: hidden;">
                  <img :src="news.gambar" :alt="news.judul" class="w-100 h-100 object-fit-cover transition-all" />
                  <span class="badge bg-primary text-white position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm fs-9">
                    {{ news.kategori }}
                  </span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                  <div class="d-flex align-items-center gap-2 text-muted fs-8 mb-2">
                    <i class="far fa-calendar"></i>
                    <span>{{ new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                  </div>
                  <h5 class="fw-bold text-dark mb-2 text-clamp-2 fs-6">{{ news.judul }}</h5>
                  <p class="text-secondary fs-8 text-clamp-3 mb-4">{{ news.ringkasan }}</p>
                  
                  <router-link to="/pusatbantuan" class="mt-auto text-decoration-none">
                    <span class="text-primary fw-bold fs-8 d-flex align-items-center gap-1 hover-arrow">
                      Selengkapnya <i class="fas fa-chevron-right fs-9"></i>
                    </span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonial Section -->
      <section class="testimonial-section py-6 bg-grey position-relative">
        <div class="container py-4">
          <div class="row justify-content-center mb-5 text-center">
            <div class="col-lg-8" data-aos="fade-up">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Dampak Nyata</h6>
              <h2 class="display-6 fw-bold text-dark mb-3">Suara Warga Yang Telah Terbantu</h2>
              <div class="custom-divider mx-auto mb-4" style="width: 80px; height: 4px; background-color: var(--blue-color); border-radius: 2px;"></div>
            </div>
          </div>

          <div class="row g-4 justify-content-center">
            <div v-for="(testi, idx) in testimonials" :key="idx" class="col-lg-4 col-md-6" data-aos="fade-up" :data-aos-delay="idx * 150">
              <div class="testimonial-card card h-100 border-0 shadow-sm rounded-4 p-4 text-start bg-white position-relative overflow-hidden">
                <i class="fas fa-quote-right position-absolute end-0 bottom-0 text-light opacity-30 m-4" style="font-size: 5rem; pointer-events: none;"></i>
                <div class="card-body p-2 d-flex flex-column h-100 position-relative z-2">
                  <div class="rating-stars mb-3 text-warning">
                    <i v-for="star in testi.rating" :key="star" class="fas fa-star"></i>
                    <i v-for="star in (5 - testi.rating)" :key="star" class="far fa-star text-muted"></i>
                  </div>
                  <p class="text-secondary fs-7 mb-4 flex-grow-1" style="line-height: 1.6; font-style: italic;">
                    "{{ testi.comment }}"
                  </p>
                  <div class="d-flex align-items-center gap-3 pt-3 border-top border-light">
                    <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 42px; height: 42px;">
                      {{ testi.avatar }}
                    </div>
                    <div>
                      <h6 class="fw-bold text-dark mb-0">{{ testi.name }}</h6>
                      <span class="fs-8 text-secondary">Warga {{ testi.location }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section py-6 bg-white">
        <div class="container py-4">
          <div class="row justify-content-center mb-5 text-center">
            <div class="col-lg-8" data-aos="fade-up">
              <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Informasi Tambahan</h6>
              <h2 class="display-6 fw-bold text-dark mb-3">Pertanyaan Umum (FAQ)</h2>
              <div class="custom-divider mx-auto mb-4" style="width: 80px; height: 4px; background-color: var(--blue-color); border-radius: 2px;"></div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-8" data-aos="fade-up" data-aos-delay="200">
              <div class="faq-accordion d-flex flex-column gap-3">
                <div v-for="(faq, idx) in faqs" :key="idx" class="faq-item rounded-4 border border-light-subtle overflow-hidden bg-light transition-all">
                  <button @click="toggleFaq(idx)" class="w-100 text-start py-3 px-4 border-0 bg-transparent d-flex justify-content-between align-items-center transition-all">
                    <span class="fw-bold text-dark fs-7 pe-3">{{ faq.q }}</span>
                    <i :class="['fas', activeFaq === idx ? 'fa-minus-circle text-primary' : 'fa-plus-circle text-secondary']" class="fs-5 transition-all"></i>
                  </button>
                  
                  <div :class="['faq-answer px-4 overflow-hidden transition-all', activeFaq === idx ? 'py-3 border-top border-light-subtle' : '']" :style="{ maxHeight: activeFaq === idx ? '200px' : '0px' }">
                    <p class="text-secondary fs-7 mb-0" style="line-height: 1.6;">{{ faq.a }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="cta-section py-6 bg-light bg-opacity-25 text-center position-relative overflow-hidden">
        <div class="container">
          <div class="row justify-content-center position-relative z-2">
            <div class="col-lg-8" data-aos="zoom-in" data-aos-duration="800">
              <div class="cta-card p-5 rounded-5 shadow-lg border border-light bg-white bg-opacity-95" style="backdrop-filter: blur(10px);">
                <div class="cta-icon mx-auto mb-4 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg" style="width: 70px; height: 70px;">
                  <i class="fas fa-bullhorn fs-3"></i>
                </div>
                <h2 class="display-6 fw-black text-dark mb-3">{{ landingData?.cta?.title || 'Siap Menjadi Agen Perubahan?' }}</h2>
                <p class="lead text-secondary px-lg-5 fs-7 mb-5" style="line-height: 1.6;">
                  {{ landingData?.cta?.text || 'Jangan biarkan jalan rusak, tumpukan sampah, atau pemadaman lampu mengganggu kenyamanan bersama. Laporkan permasalahan di lingkungan Anda dalam hitungan detik.' }}
                </p>
                <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <router-link to="/formpengaduan" class="text-decoration-none">
                    <BlueButton :text="landingData?.cta?.button || 'Mulai Buat Pengaduan'" class="px-5 py-3 shadow-md btn-glow-primary" icon="fa fa-arrow-right" />
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer component -->
      <FooterBlue />
    </div>
  </div>
</template>

<style scoped>
/* Scoped custom variables and utilities */
.text-gradient {
  background: linear-gradient(135deg, var(--blue-color) 0%, var(--nav-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

.hero-section {
  background: linear-gradient(180deg, rgba(75, 112, 245, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.fw-black {
  font-weight: 900;
}

.fw-extrabold {
  font-weight: 800;
}

.py-6 {
  padding-top: 5.5rem;
  padding-bottom: 5.5rem;
}

.fs-7 {
  font-size: 0.92rem;
}

.fs-8 {
  font-size: 0.82rem;
}

.fs-9 {
  font-size: 0.75rem;
}

.hover-lift-up {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift-up:hover {
  transform: translateY(-8px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.08) !important;
}

.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 0.8rem 2.5rem rgba(0, 0, 0, 0.06) !important;
}

/* Hero visuals */
.hero-image-container {
  width: 100%;
  max-width: 420px;
}

.mockup-card {
  transition: transform 0.4s ease;
}

.mockup-card:hover {
  transform: scale(1.02);
}

@keyframes float {
  0% { transform: translate(0px, 0px); }
  50% { transform: translate(-5px, -15px); }
  100% { transform: translate(0px, 0px); }
}

.floating-badge {
  animation: float 4s ease-in-out infinite;
}

.floating-badge:nth-child(2) {
  animation-delay: 2s;
}

/* Timeline Layout adjustment for 5 items */
.col-lg-2\.4 {
  width: 20%;
}

@media (max-width: 991px) {
  .col-lg-2\.4 {
    width: 50%;
  }
  .timeline-line {
    display: none !important;
  }
}

@media (max-width: 575px) {
  .col-lg-2\.4 {
    width: 100%;
  }
}

.step-number {
  z-index: 2;
  transition: all 0.3s ease;
}

.step-card:hover .step-number {
  transform: scale(1.1);
  background-color: var(--blue-color) !important;
  color: white !important;
  box-shadow: 0 0 20px rgba(75, 112, 245, 0.5) !important;
}

/* Category card */
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  background-color: white !important;
  border-color: var(--blue-color) !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

/* News hover arrow */
.hover-arrow i {
  transition: transform 0.2s ease;
}

.hover-arrow:hover i {
  transform: translateX(4px);
}

/* Clamp helpers */
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FAQ item transitions */
.faq-item {
  transition: all 0.3s ease;
}

.faq-item:hover {
  background-color: white !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.04);
}

.faq-answer {
  transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), padding 0.3s ease, border-top 0.3s ease;
}

/* Buttons glow */
.btn-glow-primary {
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(75, 112, 245, 0.3);
}

.btn-glow-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(75, 112, 245, 0.45);
}
</style>
