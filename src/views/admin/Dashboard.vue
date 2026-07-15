<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const pengaduanList = ref([]);
const errorMessage = ref('');

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await api.getPengaduan();
    // Sort descending by created_at (newest first)
    pengaduanList.value = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    errorMessage.value = 'Gagal memuat data laporan.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// Calculate statistics
const stats = computed(() => {
  const list = pengaduanList.value;
  return {
    total: list.length,
    menunggu: list.filter(p => p.status_laporan === 'Menunggu' || p.status_laporan === 'Menunggu Proses').length,
    diproses: list.filter(p => p.status_laporan === 'Diproses').length,
    selesai: list.filter(p => p.status_laporan === 'Selesai').length
  };
});

const recentReports = computed(() => {
  return pengaduanList.value.slice(0, 5);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
};

const getStatusBadgeClass = (status) => {
  if (!status) return 'bg-secondary';
  const s = status.toLowerCase();
  if (s.includes('menunggu')) return 'bg-warning text-dark';
  if (s.includes('proses')) return 'bg-info text-dark';
  if (s.includes('selesai')) return 'bg-success';
  if (s.includes('tolak')) return 'bg-danger';
  return 'bg-secondary';
};
</script>

<template>
  <div class="dashboard-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold text-dark mb-1">Dashboard Admin</h4>
        <p class="text-muted fs-7 mb-0">Ringkasan statistik dan laporan masuk terbaru.</p>
      </div>
      <button @click="fetchData" class="btn btn-outline-primary btn-sm rounded-3 shadow-sm px-3 fw-bold" :disabled="loading">
        <i :class="['fas fa-sync-alt me-2', { 'fa-spin': loading }]"></i> Refresh Data
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-3">Memuat data dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="alert alert-danger rounded-4 shadow-sm" role="alert">
      <i class="fas fa-exclamation-circle me-2"></i> {{ errorMessage }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="row g-4 mb-5">
        <div class="col-xl-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="text-muted fw-semibold mb-1">Total Laporan</h6>
                  <h3 class="fw-bold text-dark mb-0">{{ stats.total }}</h3>
                </div>
                <div class="stat-icon bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i class="fas fa-file-alt fs-5"></i>
                </div>
              </div>
              <p class="text-muted fs-8 mb-0">Seluruh laporan warga</p>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 bg-primary" style="height: 4px;"></div>
          </div>
        </div>

        <div class="col-xl-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="text-muted fw-semibold mb-1">Menunggu</h6>
                  <h3 class="fw-bold text-dark mb-0">{{ stats.menunggu }}</h3>
                </div>
                <div class="stat-icon bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i class="fas fa-clock fs-5"></i>
                </div>
              </div>
              <p class="text-muted fs-8 mb-0">Belum diproses</p>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 bg-warning" style="height: 4px;"></div>
          </div>
        </div>

        <div class="col-xl-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="text-muted fw-semibold mb-1">Diproses</h6>
                  <h3 class="fw-bold text-dark mb-0">{{ stats.diproses }}</h3>
                </div>
                <div class="stat-icon bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i class="fas fa-spinner fs-5"></i>
                </div>
              </div>
              <p class="text-muted fs-8 mb-0">Sedang ditindaklanjuti</p>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 bg-info" style="height: 4px;"></div>
          </div>
        </div>

        <div class="col-xl-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="text-muted fw-semibold mb-1">Selesai</h6>
                  <h3 class="fw-bold text-dark mb-0">{{ stats.selesai }}</h3>
                </div>
                <div class="stat-icon bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <i class="fas fa-check-circle fs-5"></i>
                </div>
              </div>
              <p class="text-muted fs-8 mb-0">Laporan tuntas</p>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 bg-success" style="height: 4px;"></div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <h6 class="fw-bold text-dark mb-0"><i class="fas fa-list-ul me-2 text-primary"></i> 5 Laporan Terbaru Masuk</h6>
          <router-link to="/admin/pengaduan" class="btn btn-sm btn-link text-decoration-none fw-semibold">
            Lihat Semua <i class="fas fa-arrow-right ms-1"></i>
          </router-link>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light text-muted fs-8 text-uppercase tracking-wider">
                <tr>
                  <th class="ps-4 py-3 border-0">Tiket</th>
                  <th class="py-3 border-0">Pelapor</th>
                  <th class="py-3 border-0">Kategori</th>
                  <th class="py-3 border-0">Status</th>
                  <th class="pe-4 py-3 border-0 text-end">Waktu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in recentReports" :key="report.id" style="cursor: pointer;" @click="$router.push('/admin/pengaduan')">
                  <td class="ps-4 py-3">
                    <span class="badge bg-light text-dark border font-monospace fw-bold">{{ report.tiket_lacak }}</span>
                  </td>
                  <td class="py-3">
                    <div class="fw-semibold text-dark">{{ report.nama }}</div>
                    <div class="text-muted fs-8 text-truncate" style="max-width: 250px;">{{ report.judul_laporan }}</div>
                  </td>
                  <td class="py-3">
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border-0 px-2 py-1">{{ report.kategori }}</span>
                  </td>
                  <td class="py-3">
                    <span :class="['badge rounded-pill px-3 py-1.5 fw-medium', getStatusBadgeClass(report.status_laporan)]">
                      {{ report.status_laporan }}
                    </span>
                  </td>
                  <td class="pe-4 py-3 text-end text-muted fs-8">
                    {{ formatDate(report.created_at) }}
                  </td>
                </tr>
                <tr v-if="recentReports.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted">
                    <div class="mb-3"><i class="fas fa-folder-open fs-1 text-slate-300"></i></div>
                    Belum ada laporan warga yang masuk.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
</style>
