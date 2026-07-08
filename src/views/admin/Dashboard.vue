<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const pengaduanList = ref([]);
const kategoriList = ref([]);

const fetchData = async () => {
  loading.value = true;
  try {
    pengaduanList.value = await api.getPengaduan();
    kategoriList.value = await api.getKategori();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// Metrik
const stats = computed(() => {
  const total = pengaduanList.value.length;
  const diterima = pengaduanList.value.filter(p => p.status_laporan.toLowerCase() === 'diterima' || p.status_laporan.toLowerCase() === 'menunggu').length;
  const diproses = pengaduanList.value.filter(p => p.status_laporan.toLowerCase().includes('proses')).length;
  const selesai = pengaduanList.value.filter(p => p.status_laporan.toLowerCase().includes('selesai')).length;
  const ditolak = pengaduanList.value.filter(p => p.status_laporan.toLowerCase().includes('tolak')).length;

  return { total, diterima, diproses, selesai, ditolak };
});

// Distribusi Kategori
const categoryDistribution = computed(() => {
  const dist = {};
  pengaduanList.value.forEach(p => {
    dist[p.kategori] = (dist[p.kategori] || 0) + 1;
  });

  const total = pengaduanList.value.length || 1;
  return Object.keys(dist).map(cat => ({
    name: cat,
    count: dist[cat],
    percentage: Math.round((dist[cat] / total) * 100)
  })).sort((a, b) => b.count - a.count);
});

// 4 Laporan Terbaru
const recentReports = computed(() => {
  return [...pengaduanList.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);
});

// Helper class & icon
const getStatusBadgeClass = (status) => {
  status = status.toLowerCase();
  if (status.includes('diterima')) return 'bg-info text-dark';
  if (status.includes('proses')) return 'bg-warning text-dark';
  if (status.includes('selesai')) return 'bg-success text-white';
  if (status.includes('ditolak')) return 'bg-danger text-white';
  return 'bg-secondary text-white';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const categoryColors = [
  '#4B70F5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'
];
</script>

<template>
  <div class="dashboard-container">
    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <!-- Row Metrik -->
      <div class="row g-4 mb-4">
        <!-- Total Laporan -->
        <div class="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
          <div class="card card-metric border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted fw-medium text-uppercase fs-7 d-block mb-1">Total Pengaduan</span>
                <h2 class="fw-bold mb-0 text-dark">{{ stats.total }}</h2>
              </div>
              <div class="metric-icon-wrapper bg-primary-light text-primary rounded-4">
                <i class="fas fa-file-alt fs-3"></i>
              </div>
            </div>
            <div class="card-indicator bg-primary"></div>
          </div>
        </div>

        <!-- Diterima / Menunggu -->
        <div class="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
          <div class="card card-metric border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted fw-medium text-uppercase fs-7 d-block mb-1">Diterima / Menunggu</span>
                <h2 class="fw-bold mb-0 text-dark">{{ stats.diterima }}</h2>
              </div>
              <div class="metric-icon-wrapper bg-info-light text-info rounded-4">
                <i class="fas fa-inbox fs-3"></i>
              </div>
            </div>
            <div class="card-indicator bg-info"></div>
          </div>
        </div>

        <!-- Sedang Diproses -->
        <div class="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
          <div class="card card-metric border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted fw-medium text-uppercase fs-7 d-block mb-1">Sedang Diproses</span>
                <h2 class="fw-bold mb-0 text-dark">{{ stats.diproses }}</h2>
              </div>
              <div class="metric-icon-wrapper bg-warning-light text-warning rounded-4">
                <i class="fas fa-spinner fa-pulse fs-3"></i>
              </div>
            </div>
            <div class="card-indicator bg-warning"></div>
          </div>
        </div>

        <!-- Selesai -->
        <div class="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
          <div class="card card-metric border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted fw-medium text-uppercase fs-7 d-block mb-1">Selesai Ditangani</span>
                <h2 class="fw-bold mb-0 text-dark">{{ stats.selesai }}</h2>
              </div>
              <div class="metric-icon-wrapper bg-success-light text-success rounded-4">
                <i class="fas fa-check-double fs-3"></i>
              </div>
            </div>
            <div class="card-indicator bg-success"></div>
          </div>
        </div>
      </div>

      <!-- Detail Row -->
      <div class="row g-4">
        <!-- Laporan Terbaru -->
        <div class="col-xl-8 col-lg-7" data-aos="fade-right" data-aos-delay="100">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
              <h5 class="mb-0 fw-bold text-dark">Aktivitas Pengaduan Terbaru</h5>
              <router-link to="/admin/pengaduan" class="btn btn-sm btn-outline-primary rounded-pill px-3 fs-7">
                Lihat Semua
              </router-link>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light text-muted fs-7 text-uppercase">
                    <tr>
                      <th class="px-4 py-3 border-0">Pelapor</th>
                      <th class="py-3 border-0">Laporan</th>
                      <th class="py-3 border-0">Kategori</th>
                      <th class="py-3 border-0">Status</th>
                      <th class="py-3 border-0 text-end px-4">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in recentReports" :key="report.id" class="cursor-pointer">
                      <td class="px-4 py-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="avatar-sm bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold">
                            {{ report.nama.charAt(0) }}
                          </div>
                          <div>
                            <span class="fw-semibold text-dark d-block fs-6">{{ report.nama }}</span>
                            <small class="text-muted fs-7">{{ report.tiket_lacak }}</small>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 max-w-200">
                        <span class="fw-medium text-dark d-block text-truncate fs-6">{{ report.judul_laporan }}</span>
                        <small class="text-muted d-block text-truncate text-wrap-limit">{{ report.lokasi_kejadian }}</small>
                      </td>
                      <td class="py-3">
                        <span class="badge bg-light text-dark border py-1.5 px-2.5 fs-7 rounded-pill">
                          {{ report.kategori }}
                        </span>
                      </td>
                      <td class="py-3">
                        <span :class="['badge py-1.5 px-3 rounded-pill fs-7', getStatusBadgeClass(report.status_laporan)]">
                          {{ report.status_laporan }}
                        </span>
                      </td>
                      <td class="py-3 text-end px-4 text-muted fs-7">
                        {{ formatDate(report.created_at) }}
                      </td>
                    </tr>
                    <tr v-if="recentReports.length === 0">
                      <td colspan="5" class="text-center py-5 text-muted">
                        <i class="fas fa-folder-open fs-2 d-block mb-2"></i>
                        Belum ada laporan pengaduan masuk.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribusi Kategori (Visual SVG/HTML) -->
        <div class="col-xl-4 col-lg-5" data-aos="fade-left" data-aos-delay="200">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-0 py-3 px-4">
              <h5 class="mb-0 fw-bold text-dark">Distribusi Kategori</h5>
            </div>
            <div class="card-body px-4 pb-4 pt-1">
              <!-- Visual Grafik Presentasi Sederhana dan Indah -->
              <div class="category-bars d-flex flex-column gap-4">
                <div v-for="(cat, idx) in categoryDistribution" :key="cat.name" class="category-item">
                  <div class="d-flex align-items-center justify-content-between mb-1">
                    <span class="fw-semibold text-dark fs-6 text-truncate max-w-200" :title="cat.name">
                      {{ cat.name }}
                    </span>
                    <div class="d-flex align-items-center gap-2">
                      <span class="badge bg-light text-dark border fs-7">{{ cat.count }} Aduan</span>
                      <span class="fw-bold text-primary fs-7">{{ cat.percentage }}%</span>
                    </div>
                  </div>
                  <div class="progress rounded-pill bg-light" style="height: 10px;">
                    <div 
                      class="progress-bar rounded-pill" 
                      :style="{ 
                        width: cat.percentage + '%',
                        backgroundColor: categoryColors[idx % categoryColors.length]
                      }"
                      role="progressbar"
                      :aria-valuenow="cat.percentage"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                <div v-if="categoryDistribution.length === 0" class="text-center py-5 text-muted">
                  <i class="fas fa-chart-pie fs-2 d-block mb-2"></i>
                  Data statistik kategori tidak tersedia.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding-bottom: 2rem;
}

/* Card Metric */
.card-metric {
  transition: all 0.3s ease;
  background: white;
}

.card-metric:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
}

.metric-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-light { background-color: rgba(75, 112, 245, 0.12); }
.bg-info-light { background-color: rgba(0, 180, 216, 0.12); }
.bg-warning-light { background-color: rgba(245, 158, 11, 0.12); }
.bg-success-light { background-color: rgba(16, 185, 129, 0.12); }

.card-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
}

/* Table styling */
.avatar-sm {
  width: 38px;
  height: 38px;
  font-size: 14px;
}

.max-w-200 {
  max-width: 200px;
}

.text-wrap-limit {
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Category Bars */
.category-bars {
  margin-top: 1rem;
}

.category-item {
  position: relative;
}

.fs-7 {
  font-size: 0.8rem;
}
</style>
