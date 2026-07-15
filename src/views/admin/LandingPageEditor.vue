<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const activeTab = ref('hero');
const content = ref({
  hero: { welcome: '', title: '', text1: '', text2: '' },
  about: { title: '', subtitle: '', description: '', services: [] },
  jenis: { title: '', description: '', list: [] },
  langkah: { title: '', description: '', list: [] }
});

// Alert feedback states
const showSuccess = ref(false);
const showError = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchContent = async () => {
  loading.value = true;
  try {
    const data = await api.getLandingContent();
    if (data) {
      content.value = data;
    }
  } catch (error) {
    console.error('Error loading landing page content:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchContent();
});

const handleSave = async () => {
  try {
    const saved = await api.saveLandingContent(content.value);
    if (saved) {
      successMessage.value = 'Perubahan tampilan landing page berhasil disimpan!';
      showSuccess.value = true;
      setTimeout(() => showSuccess.value = false, 3000);
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Gagal menyimpan perubahan. Coba lagi.';
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  }
};
</script>

<template>
  <div class="landing-page-editor">
    <!-- Alert Feedback -->
    <div v-if="showSuccess" class="alert alert-success position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-check-circle me-2"></i> {{ successMessage }}
    </div>
    <div v-if="showError" class="alert alert-danger position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-times-circle me-2"></i> {{ errorMessage }}
    </div>

    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden" data-aos="fade-up">
        <!-- Editor Tabs Header -->
        <div class="card-header bg-white border-bottom p-0">
          <ul class="nav nav-tabs nav-fill border-0" id="cmsTabs" role="tablist">
            <li class="nav-item">
              <button 
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-6', { active: activeTab === 'hero' }]"
                @click="activeTab = 'hero'"
              >
                <i class="fas fa-home me-2"></i> Hero & Beranda
              </button>
            </li>
            <li class="nav-item">
              <button 
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-6', { active: activeTab === 'about' }]"
                @click="activeTab = 'about'"
              >
                <i class="fas fa-info-circle me-2"></i> Tentang Layanan
              </button>
            </li>
            <li class="nav-item">
              <button 
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-6', { active: activeTab === 'jenis' }]"
                @click="activeTab = 'jenis'"
              >
                <i class="fas fa-tags me-2"></i> Jenis Pengaduan
              </button>
            </li>
            <li class="nav-item">
              <button 
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-6', { active: activeTab === 'langkah' }]"
                @click="activeTab = 'langkah'"
              >
                <i class="fas fa-route me-2"></i> Langkah Pengaduan
              </button>
            </li>
          </ul>
        </div>

        <!-- Editor Forms Body -->
        <div class="card-body p-4">
          <form @submit.prevent="handleSave">
            
            <!-- TAB 1: HERO -->
            <div v-if="activeTab === 'hero'">
              <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-edit me-2 text-primary"></i> Edit Hero Section</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Teks Selamat Datang (Kecil)</label>
                    <input type="text" class="form-control" v-model="content.hero.welcome" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Utama / Brand</label>
                    <input type="text" class="form-control" v-model="content.hero.title" required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Paragraf Keterangan 1</label>
                    <textarea class="form-control" rows="3" v-model="content.hero.text1" required></textarea>
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Paragraf Keterangan 2</label>
                    <textarea class="form-control" rows="3" v-model="content.hero.text2" required></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: ABOUT -->
            <div v-if="activeTab === 'about'">
              <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-edit me-2 text-primary"></i> Edit Tentang Layanan</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Section (Baris 2)</label>
                    <input type="text" class="form-control" v-model="content.about.title" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Section (Baris 1)</label>
                    <input type="text" class="form-control" v-model="content.about.subtitle" required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Deskripsi Tentang Layanan</label>
                    <textarea class="form-control" rows="4" v-model="content.about.description" required></textarea>
                  </div>
                </div>
              </div>

              <!-- Cards Sub-editor -->
              <h6 class="fw-bold border-bottom pb-2 mb-3 text-secondary">
                <i class="fas fa-columns me-2"></i> Kartu Nilai / Kelebihan Layanan
              </h6>
              <div class="row g-4">
                <div 
                  v-for="(svc, idx) in content.about.services" 
                  :key="idx" 
                  class="col-md-4"
                >
                  <div class="card bg-light border-0 p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width:36px; height:36px;">
                        <i :class="svc.logo || 'fas fa-check'"></i>
                      </div>
                      <span class="fw-bold text-dark">Kartu #{{ idx + 1 }}</span>
                    </div>
                    <div class="mb-2">
                      <label class="form-label fs-8 text-muted fw-semibold">Judul Kartu</label>
                      <input type="text" class="form-control form-control-sm" v-model="svc.judul" required />
                    </div>
                    <div>
                      <label class="form-label fs-8 text-muted fw-semibold">Deskripsi</label>
                      <textarea class="form-control form-control-sm" rows="3" v-model="svc.deskripsi" required></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: JENIS PENGADUAN -->
            <div v-if="activeTab === 'jenis'">
              <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-edit me-2 text-primary"></i> Edit Kategori / Jenis Pengaduan</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Utama Halaman</label>
                    <input type="text" class="form-control" v-model="content.jenis.title" required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Teks Deskripsi Pembuka</label>
                    <textarea class="form-control" rows="3" v-model="content.jenis.description" required></textarea>
                  </div>
                </div>
              </div>

              <!-- List Cards Jenis -->
              <h6 class="fw-bold border-bottom pb-2 mb-3 text-secondary">
                <i class="fas fa-th-large me-2"></i> Detail Informasi Kategori Pengaduan
              </h6>
              <div class="row g-3">
                <div 
                  v-for="(item, idx) in content.jenis.list" 
                  :key="idx" 
                  class="col-md-6"
                >
                  <div class="card bg-light border-0 p-3 rounded-3">
                    <div class="fw-bold text-dark mb-2">Item Kategori #{{ idx + 1 }}</div>
                    <div class="mb-2">
                      <label class="form-label fs-8 text-muted fw-semibold">Nama Kategori</label>
                      <input type="text" class="form-control form-control-sm" v-model="item.judul" required />
                    </div>
                    <div>
                      <label class="form-label fs-8 text-muted fw-semibold">Keterangan / Deskripsi</label>
                      <textarea class="form-control form-control-sm" rows="3" v-model="item.deskripsi" required></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 4: LANGKAH PENGADUAN -->
            <div v-if="activeTab === 'langkah'">
              <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-edit me-2 text-primary"></i> Edit Alur & Langkah Pengaduan</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Section Utama</label>
                    <input type="text" class="form-control" v-model="content.langkah.title" required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Teks Penutup / Tambahan</label>
                    <textarea class="form-control" rows="3" v-model="content.langkah.description" required></textarea>
                  </div>
                </div>
              </div>

              <!-- Cards Langkah -->
              <h6 class="fw-bold border-bottom pb-2 mb-3 text-secondary">
                <i class="fas fa-list-ol me-2"></i> Poin-Poin Langkah Pengaduan (1 - 5)
              </h6>
              <div class="row g-3">
                <div 
                  v-for="(step, idx) in content.langkah.list" 
                  :key="idx" 
                  class="col-md-4"
                >
                  <div class="card bg-light border-0 p-3 rounded-3 h-100 d-flex flex-column">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:30px; height:30px; font-size:12px;">
                        {{ step.nomor }}
                      </div>
                      <span class="fw-bold text-dark">Langkah {{ step.nomor }}</span>
                    </div>
                    <div class="mb-2">
                      <label class="form-label fs-8 text-muted fw-semibold">Judul Alur</label>
                      <input type="text" class="form-control form-control-sm" v-model="step.judul" required />
                    </div>
                    <div class="mt-auto">
                      <label class="form-label fs-8 text-muted fw-semibold">Keterangan Singkat</label>
                      <textarea class="form-control form-control-sm" rows="3" v-model="step.deskripsi" required></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button Bar -->
            <div class="border-top mt-5 pt-3 d-flex justify-content-end">
              <button type="submit" class="btn btn-primary px-5 py-2.5 rounded-3 fw-bold">
                <i class="fas fa-save me-1"></i> Simpan Perubahan Tampilan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page-editor {
  padding-bottom: 3rem;
}

/* Tabs custom styles */
.nav-tabs .nav-link {
  color: #5a6a85;
  border-bottom: 2px solid transparent !important;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link:hover {
  color: var(--blue-color);
  background-color: rgba(75, 112, 245, 0.03);
}

.nav-tabs .nav-link.active {
  color: var(--blue-color) !important;
  border-bottom: 2px solid var(--blue-color) !important;
  background-color: transparent !important;
}

.fs-7 {
  font-size: 0.8rem;
}

.fs-8 {
  font-size: 0.72rem;
}

.avatar-sm {
  flex-shrink: 0;
}
</style>
