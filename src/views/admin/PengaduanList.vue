<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const pengaduanList = ref([]);
const kategoriList = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedKategori = ref('');

// State modal detail
const selectedReport = ref(null);
const editStatus = ref('');
const editTanggapan = ref('');
const editSuratFile = ref(null);
const showModal = ref(false);

// Alert Notification States
const showError = ref(false);
const showSuccess = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchData = async () => {
  loading.value = true;
  try {
    pengaduanList.value = await api.getPengaduan();
    kategoriList.value = await api.getKategori();
  } catch (error) {
    console.error('Error fetching complaints data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// Filter & Search Logic
const filteredPengaduan = computed(() => {
  return pengaduanList.value.filter(p => {
    const matchesSearch = 
      p.judul_laporan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.tiket_lacak.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.ktp.includes(searchQuery.value);

    const matchesStatus = !selectedStatus.value || p.status_laporan.toLowerCase() === selectedStatus.value.toLowerCase();
    const matchesKategori = !selectedKategori.value || p.kategori.toLowerCase() === selectedKategori.value.toLowerCase();

    return matchesSearch && matchesStatus && matchesKategori;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// Modal Operations
const openDetailModal = (report) => {
  selectedReport.value = report;
  editStatus.value = report.status_laporan;
  editTanggapan.value = report.tanggapan || '';
  editSuratFile.value = null;
  showModal.value = true;
};

const closeDetailModal = () => {
  selectedReport.value = null;
  showModal.value = false;
};

const handleSuratUpload = (event) => {
  editSuratFile.value = event.target.files[0];
};

const saveResponse = async () => {
  if (!selectedReport.value) return;

  try {
    const updated = await api.updatePengaduanStatus(selectedReport.value.id, {
      status_laporan: editStatus.value,
      tanggapan: editTanggapan.value,
      surat_tindak_file: editSuratFile.value
    });

    // Update state local
    const index = pengaduanList.value.findIndex(p => p.id === selectedReport.value.id);
    if (index !== -1) {
      pengaduanList.value[index] = updated;
    }

    successMessage.value = 'Laporan berhasil diperbarui!';
    showSuccess.value = true;
    setTimeout(() => showSuccess.value = false, 3000);
    closeDetailModal();
  } catch (error) {
    console.error('Error saving response:', error);
    errorMessage.value = 'Gagal menyimpan perubahan. Silakan coba lagi.';
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  }
};

const deleteReport = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus laporan pengaduan ini secara permanen?')) return;

  try {
    await api.deletePengaduan(id);
    pengaduanList.value = pengaduanList.value.filter(p => p.id !== id);
    
    successMessage.value = 'Laporan berhasil dihapus!';
    showSuccess.value = true;
    setTimeout(() => showSuccess.value = false, 3000);
    closeDetailModal();
  } catch (error) {
    console.error('Error deleting report:', error);
    errorMessage.value = 'Gagal menghapus laporan.';
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  }
};

// Helpers
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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:image')) return path;
  return `http://127.0.0.1:8000/storage/${path}`;
};
</script>

<template>
  <div class="pengaduan-list-container">
    <!-- Alert Feedback -->
    <div v-if="showSuccess" class="alert alert-success position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-check-circle me-2"></i> {{ successMessage }}
    </div>
    <div v-if="showError" class="alert alert-danger position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-times-circle me-2"></i> {{ errorMessage }}
    </div>

    <!-- Filter Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4" data-aos="fade-down">
      <div class="card-body p-4">
        <h5 class="fw-bold mb-3 text-dark">Filter Pencarian</h5>
        <div class="row g-3">
          <!-- Cari -->
          <div class="col-lg-4 col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 text-muted">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Cari Tiket, KTP, Nama, atau Judul..." 
                v-model="searchQuery"
              />
            </div>
          </div>
          
          <!-- Status -->
          <div class="col-lg-3 col-md-3 col-sm-6">
            <select class="form-select" v-model="selectedStatus">
              <option value="">Semua Status</option>
              <option value="Diterima">Diterima</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <!-- Kategori -->
          <div class="col-lg-3 col-md-3 col-sm-6">
            <select class="form-select" v-model="selectedKategori">
              <option value="">Semua Kategori</option>
              <option 
                v-for="kat in kategoriList" 
                :key="kat.id" 
                :value="kat.nama_kategori"
              >
                {{ kat.nama_kategori }}
              </option>
            </select>
          </div>

          <!-- Reset Button -->
          <div class="col-lg-2 col-md-12 text-md-end">
            <button 
              class="btn btn-outline-secondary w-100" 
              @click="searchQuery = ''; selectedStatus = ''; selectedKategori = '';"
            >
              <i class="fas fa-redo me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card border-0 shadow-sm rounded-4" data-aos="fade-up">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-muted fs-7 text-uppercase">
              <tr>
                <th class="px-4 py-3 border-0">No. Tiket</th>
                <th class="py-3 border-0">Pelapor</th>
                <th class="py-3 border-0">Judul Pengaduan</th>
                <th class="py-3 border-0">Kategori</th>
                <th class="py-3 border-0">Status</th>
                <th class="py-3 border-0">Tanggal Masuk</th>
                <th class="py-3 border-0 text-center px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in filteredPengaduan" :key="report.id">
                <td class="px-4 py-3 fw-bold text-primary">{{ report.tiket_lacak }}</td>
                <td class="py-3">
                  <span class="fw-semibold text-dark d-block fs-6">{{ report.nama }}</span>
                  <small class="text-muted d-block" style="font-size: 11px;">KTP: {{ report.ktp }}</small>
                </td>
                <td class="py-3 text-wrap-limit">{{ report.judul_laporan }}</td>
                <td class="py-3">
                  <span class="badge bg-light text-dark border py-1.5 px-2.5 rounded-pill fs-7">
                    {{ report.kategori }}
                  </span>
                </td>
                <td class="py-3">
                  <span :class="['badge py-1.5 px-3 rounded-pill fs-7', getStatusBadgeClass(report.status_laporan)]">
                    {{ report.status_laporan }}
                  </span>
                </td>
                <td class="py-3 text-muted fs-7">{{ formatDate(report.created_at) }}</td>
                <td class="py-3 text-center px-4">
                  <div class="d-flex align-items-center justify-content-center gap-2">
                    <button class="btn btn-sm btn-primary rounded-pill px-3 fs-7" @click="openDetailModal(report)">
                      <i class="fas fa-eye me-1"></i> Detail
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" @click="deleteReport(report.id)">
                      <i class="fas fa-trash-alt fs-7"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPengaduan.length === 0 && !loading">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="fas fa-search-minus fs-2 d-block mb-2"></i>
                  Tidak ada laporan pengaduan yang cocok dengan filter pencarian.
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-5 text-muted">
                  <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                  Memuat data pengaduan...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Detail & Tanggapan (Bootstrap-like Custom Modal Overlay) -->
    <div v-if="showModal && selectedReport" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom bg-white rounded-4 shadow-lg overflow-hidden border-0" data-aos="zoom-in">
        <!-- Modal Header -->
        <div class="modal-header-custom px-4 py-3 bg-primary text-white d-flex align-items-center justify-content-between">
          <h5 class="mb-0 fw-bold">
            <i class="fas fa-info-circle me-2"></i> Detail Pengaduan - {{ selectedReport.tiket_lacak }}
          </h5>
          <button class="btn btn-link text-white p-0 border-0 fs-4 text-decoration-none" @click="closeDetailModal">
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body-custom p-4">
          <div class="row g-4">
            <!-- Left Info Panel -->
            <div class="col-lg-7 border-end border-light">
              <div class="mb-3">
                <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Judul Laporan</span>
                <h5 class="fw-bold text-dark mb-0">{{ selectedReport.judul_laporan }}</h5>
              </div>

              <div class="row mb-3">
                <div class="col-6">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Nama Pelapor</span>
                  <span class="text-dark fw-medium">{{ selectedReport.nama }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">NIK / KTP</span>
                  <span class="text-dark">{{ selectedReport.ktp }}</span>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-6">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Kategori</span>
                  <span class="badge bg-light text-dark border px-2.5 py-1 rounded-pill fs-7">{{ selectedReport.kategori }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Kontak Telegram</span>
                  <span class="text-primary fw-medium">
                    <i class="fab fa-telegram me-1"></i> {{ selectedReport.telegram_username }}
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Lokasi Kejadian</span>
                <span class="text-dark"><i class="fas fa-map-marker-alt text-danger me-1"></i> {{ selectedReport.lokasi_kejadian }}</span>
              </div>

              <div class="mb-3">
                <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Rincian Laporan</span>
                <div class="bg-light p-3 rounded-3 border-0 text-dark fs-6" style="max-height: 180px; overflow-y: auto; line-height: 1.5;">
                  {{ selectedReport.isi_laporan }}
                </div>
              </div>

              <div class="row">
                <div class="col-6">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Tanggal Masuk</span>
                  <span class="text-dark fs-7">{{ formatDate(selectedReport.created_at) }}</span>
                </div>
                <div class="col-6" v-if="selectedReport.surat_tindak">
                  <span class="text-muted d-block fs-7 text-uppercase fw-semibold mb-1">Dokumen Tindakan</span>
                  <span class="text-success fs-7">
                    <i class="fas fa-file-pdf me-1"></i> {{ selectedReport.surat_tindak }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right Action & Photo Panel -->
            <div class="col-lg-5">
              <!-- Bukti Foto -->
              <div class="mb-4 text-center">
                <span class="text-muted d-block text-start fs-7 text-uppercase fw-semibold mb-2">Foto Bukti Lapangan</span>
                <div class="image-preview-wrapper bg-dark rounded-3 overflow-hidden position-relative" style="height: 180px;">
                  <img 
                    :src="getImageUrl(selectedReport.bukti_foto)" 
                    alt="Bukti Foto" 
                    class="img-fluid w-100 h-100 object-fit-cover"
                  />
                  <div class="position-absolute bottom-0 end-0 m-2">
                    <a :href="getImageUrl(selectedReport.bukti_foto)" target="_blank" class="btn btn-sm btn-primary py-1 px-2.5 rounded shadow">
                      <i class="fas fa-expand"></i>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Tanggapan & Status Form -->
              <form @submit.prevent="saveResponse">
                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark fs-7 text-uppercase">Ubah Status Laporan</label>
                  <select class="form-select border-primary-subtle" v-model="editStatus">
                    <option value="Diterima">Diterima / Menunggu</option>
                    <option value="Sedang Diproses">Sedang Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark fs-7 text-uppercase">Tanggapan Petugas</label>
                  <textarea 
                    class="form-control border-primary-subtle" 
                    rows="3" 
                    placeholder="Tuliskan respon resmi petugas..." 
                    v-model="editTanggapan"
                    required
                  ></textarea>
                </div>

                <!-- Input File Surat Tindakan (Hanya muncul jika Selesai / Diproses) -->
                <div class="mb-4" v-if="editStatus === 'Selesai' || editStatus === 'Sedang Diproses'">
                  <label class="form-label fw-semibold text-dark fs-7 text-uppercase">Unggah Surat Tindakan (Opsional)</label>
                  <input type="file" class="form-control" @change="handleSuratUpload" accept=".pdf,.doc,.docx,.png,.jpg" />
                  <div class="form-text fs-8 text-muted">Format yang diizinkan: PDF, DOC, Gambar.</div>
                </div>

                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-outline-secondary w-50" @click="closeDetailModal">Batal</button>
                  <button type="submit" class="btn btn-primary w-50">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pengaduan-list-container {
  padding-bottom: 2rem;
}

.text-wrap-limit {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal styling overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.modal-content-custom {
  max-width: 950px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-body-custom {
  overflow-y: auto;
}

.image-preview-wrapper img {
  object-fit: cover;
}

.fs-7 {
  font-size: 0.8rem;
}

.fs-8 {
  font-size: 0.72rem;
}
</style>
