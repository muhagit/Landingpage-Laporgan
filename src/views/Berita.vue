<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const beritaList = ref([]);
const activeCategory = ref('Semua');
const selectedBerita = ref(null);

const categories = ['Semua', 'Pembangunan', 'Pengumuman', 'Kegiatan'];

const fetchBerita = async () => {
  loading.value = true;
  try {
    beritaList.value = await api.getBerita();
  } catch (error) {
    console.error('Error loading news:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBerita();
});

const filteredBerita = computed(() => {
  if (activeCategory.value === 'Semua') {
    return beritaList.value;
  }
  return beritaList.value.filter(
    (b) => b.kategori.toLowerCase() === activeCategory.value.toLowerCase()
  );
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getCategoryBadgeClass = (category) => {
  switch (category.toLowerCase()) {
    case 'pembangunan':
      return 'bg-primary text-white';
    case 'pengumuman':
      return 'bg-warning text-dark';
    case 'kegiatan':
      return 'bg-success text-white';
    default:
      return 'bg-secondary text-white';
  }
};
</script>

<template>
  <section id="berita" class="berita-section py-5 bg-light bg-opacity-50">
    <div class="container py-4">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h6 class="text-primary fw-bold text-uppercase tracking-wider mb-2">Pusat Informasi</h6>
          <h2 class="section-title fw-bold text-dark mb-3">Berita & Pengumuman Terbaru</h2>
          <div class="divider mx-auto mb-4"></div>
          <p class="text-secondary lead">
            Ikuti terus perkembangan pembangunan fasilitas publik, pengumuman resmi, dan berbagai kegiatan kemasyarakatan di lingkungan kita.
          </p>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="row mb-5" data-aos="fade-up">
        <div class="col-12 d-flex flex-wrap justify-content-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="['btn filter-btn rounded-pill px-4 py-2 border-0 shadow-sm transition-all', activeCategory === cat ? 'btn-primary active-filter' : 'btn-white text-secondary']"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Memuat berita...</span>
        </div>
      </div>

      <!-- News Grid -->
      <div v-else class="row g-4 justify-content-center">
        <div
          v-for="berita in filteredBerita"
          :key="berita.id"
          class="col-xl-4 col-md-6"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <div class="card h-100 news-card border-0 shadow-sm rounded-4 overflow-hidden" @click="selectedBerita = berita">
            <div class="img-wrapper position-relative">
              <img :src="berita.gambar" :alt="berita.judul" class="card-img-top news-img" />
              <span :class="['position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 shadow-sm fs-7', getCategoryBadgeClass(berita.kategori)]">
                {{ berita.kategori }}
              </span>
            </div>
            <div class="card-body p-4 d-flex flex-column">
              <div class="meta-info d-flex align-items-center gap-3 text-muted fs-7 mb-3">
                <span class="d-flex align-items-center gap-1">
                  <i class="far fa-calendar-alt"></i> {{ formatDate(berita.tanggal) }}
                </span>
                <span class="d-flex align-items-center gap-1">
                  <i class="far fa-user"></i> {{ berita.penulis || 'Admin' }}
                </span>
              </div>
              <h5 class="card-title fw-bold text-dark mb-3 line-clamp-2">{{ berita.judul }}</h5>
              <p class="card-text text-secondary mb-4 line-clamp-3 fs-6">{{ berita.ringkasan }}</p>
              
              <div class="mt-auto pt-2 border-top border-light d-flex align-items-center justify-content-between">
                <span class="text-primary fw-semibold read-more-link cursor-pointer">
                  Baca Selengkapnya <i class="fas fa-chevron-right ms-1 transition-all arrow-icon"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredBerita.length === 0" class="col-12 text-center py-5 text-muted">
          <i class="far fa-newspaper fs-1 d-block mb-3"></i>
          <p class="fs-5">Belum ada berita atau artikel dalam kategori ini.</p>
        </div>
      </div>
    </div>

    <!-- News Detail Modal -->
    <div v-if="selectedBerita" class="modal-overlay d-flex align-items-center justify-content-center" @click.self="selectedBerita = null">
      <div class="modal-content-custom bg-white rounded-4 shadow-lg border-0 overflow-hidden" data-aos="zoom-in" data-aos-duration="300">
        <div class="modal-header-img position-relative">
          <img :src="selectedBerita.gambar" :alt="selectedBerita.judul" class="w-100 modal-hero-img" />
          <button @click="selectedBerita = null" class="btn-close-custom bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
          <span :class="['position-absolute bottom-0 start-0 m-4 badge rounded-pill px-3 py-2 shadowfs-6', getCategoryBadgeClass(selectedBerita.kategori)]">
            {{ selectedBerita.kategori }}
          </span>
        </div>
        
        <div class="modal-body-custom p-4 p-md-5 overflow-y-auto">
          <div class="meta-info d-flex align-items-center gap-3 text-muted fs-7 mb-3">
            <span class="d-flex align-items-center gap-1">
              <i class="far fa-calendar-alt text-primary"></i> {{ formatDate(selectedBerita.tanggal) }}
            </span>
            <span class="d-flex align-items-center gap-1">
              <i class="far fa-user text-primary"></i> Oleh: <strong>{{ selectedBerita.penulis || 'Admin' }}</strong>
            </span>
          </div>
          
          <h3 class="fw-bold text-dark mb-4">{{ selectedBerita.judul }}</h3>
          
          <div class="news-body text-secondary fs-6">
            <p v-for="(paragraph, index) in selectedBerita.konten.split('\n\n')" :key="index" class="mb-3 leading-relaxed">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <div class="modal-footer-custom bg-light p-3 border-top d-flex justify-content-end">
          <button @click="selectedBerita = null" class="btn btn-outline-secondary rounded-pill px-4">Tutup</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.berita-section {
  background-color: #f8f9fa;
  min-height: 400px;
}

.divider {
  width: 80px;
  height: 4px;
  background-color: var(--blue-color);
  border-radius: 2px;
}

/* Category filter styling */
.filter-btn {
  background-color: white;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  background-color: var(--blue-color) !important;
  color: white !important;
  transform: translateY(-2px);
}

.active-filter {
  background-color: var(--blue-color) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(75, 112, 245, 0.3) !important;
}

/* Card Styling */
.news-card {
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
}

.img-wrapper {
  height: 220px;
  overflow: hidden;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-img {
  transform: scale(1.08);
}

.read-more-link:hover .arrow-icon {
  transform: translateX(4px);
}

/* Line Clamp helper */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fs-7 {
  font-size: 0.8rem;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  padding: 1.5rem;
}

.modal-content-custom {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-hero-img {
  height: 350px;
  object-fit: cover;
}

.btn-close-custom {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border: none;
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.2s ease;
  z-index: 10;
}

.btn-close-custom:hover {
  opacity: 1;
  transform: scale(1.1);
}

.modal-body-custom {
  overflow-y: auto;
}

.leading-relaxed {
  line-height: 1.7;
}

@media (max-width: 768px) {
  .modal-hero-img {
    height: 220px;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
}
</style>