<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const activeTab = ref('hero');
const content = ref({
  hero: { welcome: '', title: '', text1: '', text2: '' },
  about: { title: '', subtitle: '', description: '', services: [] },
  jenis: { title: '', description: '', list: [] },
  langkah: { title: '', description: '', list: [] },
  testimonials: [],
  faq_list: [],
  cta: { title: '', text: '', button: '' }
});

const beritaList = ref([]);
const saving = ref(false);

// Alert feedback states
const showSuccess = ref(false);
const showError = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Modals states
const showBeritaModal = ref(false);
const isEditingBerita = ref(false);
const beritaForm = ref({
  id: null,
  judul: '',
  ringkasan: '',
  konten: '',
  kategori: 'Pembangunan',
  gambar: '',
  penulis: 'Admin LaporGan'
});



const showFaqModal = ref(false);
const isEditingFaq = ref(false);
const faqForm = ref({
  index: null,
  q: '',
  a: ''
});

const fetchContent = async () => {
  loading.value = true;
  try {
    const data = await api.getLandingContent();
    if (data) {
      // Ensure testimonials and faq_list exist
      if (!data.testimonials) data.testimonials = [];
      if (!data.faq_list) data.faq_list = [];
      if (!data.cta) data.cta = { title: '', text: '', button: '' };
      content.value = data;
    }
    
    // Fetch news
    beritaList.value = await api.getBerita();
  } catch (error) {
    console.error('Error loading landing page content:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchContent();
});

const triggerSuccess = (msg) => {
  successMessage.value = msg;
  showSuccess.value = true;
  setTimeout(() => showSuccess.value = false, 3000);
};

const triggerError = (msg) => {
  errorMessage.value = msg;
  showError.value = true;
  setTimeout(() => showError.value = false, 3000);
};

const handleSave = async () => {
  saving.value = true;
  try {
    const saved = await api.saveLandingContent(content.value);
    if (saved) {
      triggerSuccess('Perubahan tampilan landing page berhasil disimpan!');
    }
  } catch (error) {
    console.error(error);
    triggerError('Gagal menyimpan perubahan. Coba lagi.');
  } finally {
    saving.value = false;
  }
};

// ==================== BERITA CRUD ====================
const openAddBeritaModal = () => {
  beritaForm.value = {
    id: null,
    judul: '',
    ringkasan: '',
    konten: '',
    kategori: 'Pembangunan',
    gambar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600',
    penulis: 'Admin LaporGan'
  };
  isEditingBerita.value = false;
  showBeritaModal.value = true;
};

const openEditBeritaModal = (berita) => {
  beritaForm.value = { ...berita };
  isEditingBerita.value = true;
  showBeritaModal.value = true;
};

const handleBeritaImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    beritaForm.value.gambar = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveBerita = async () => {
  try {
    if (isEditingBerita.value) {
      await api.updateBerita(beritaForm.value.id, beritaForm.value);
      triggerSuccess('Berita berhasil diperbarui!');
    } else {
      await api.createBerita(beritaForm.value);
      triggerSuccess('Berita baru berhasil ditambahkan!');
    }
    beritaList.value = await api.getBerita();
    showBeritaModal.value = false;
  } catch (error) {
    console.error(error);
    triggerError('Gagal menyimpan berita.');
  }
};

const deleteBerita = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
    try {
      await api.deleteBerita(id);
      triggerSuccess('Berita berhasil dihapus!');
      beritaList.value = await api.getBerita();
    } catch (error) {
      console.error(error);
      triggerError('Gagal menghapus berita.');
    }
  }
};

// ==================== FAQ CRUD ====================
const openAddFaqModal = () => {
  faqForm.value = {
    index: null,
    q: '',
    a: ''
  };
  isEditingFaq.value = false;
  showFaqModal.value = true;
};

const openEditFaqModal = (faq, idx) => {
  faqForm.value = {
    index: idx,
    q: faq.q,
    a: faq.a
  };
  isEditingFaq.value = true;
  showFaqModal.value = true;
};

const saveFaq = async () => {
  const { index, q, a } = faqForm.value;

  if (isEditingFaq.value && index !== null) {
    content.value.faq_list[index] = { q, a };
  } else {
    content.value.faq_list.push({ q, a });
  }

  showFaqModal.value = false;
  await handleSave();
};

const deleteFaq = async (idx) => {
  if (confirm('Hapus FAQ ini dari tampilan?')) {
    content.value.faq_list.splice(idx, 1);
    await handleSave();
  }
};
</script>

<template>
  <div class="landing-page-editor py-4">
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
          <ul class="nav nav-tabs nav-fill border-0 flex-wrap" id="cmsTabs" role="tablist">
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'hero' }]"
                @click="activeTab = 'hero'"
              >
                <i class="fas fa-home me-2"></i> Hero
              </button>
            </li>
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'about' }]"
                @click="activeTab = 'about'"
              >
                <i class="fas fa-info-circle me-2"></i> Tentang
              </button>
            </li>
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'jenis' }]"
                @click="activeTab = 'jenis'"
              >
                <i class="fas fa-tags me-2"></i> Kategori
              </button>
            </li>
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'langkah' }]"
                @click="activeTab = 'langkah'"
              >
                <i class="fas fa-route me-2"></i> Alur
              </button>
            </li>
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'berita' }]"
                @click="activeTab = 'berita'"
              >
                <i class="fas fa-newspaper me-2"></i> Berita
              </button>
            </li>

            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'faq' }]"
                @click="activeTab = 'faq'"
              >
                <i class="fas fa-question-circle me-2"></i> FAQ
              </button>
            </li>
            <li class="nav-item">
              <button 
                type="button"
                :class="['nav-link py-3.5 border-0 rounded-0 fw-bold fs-7', { active: activeTab === 'cta' }]"
                @click="activeTab = 'cta'"
              >
                <i class="fas fa-bullhorn me-2"></i> CTA Bawah
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

            <!-- TAB 5: BERITA -->
            <div v-if="activeTab === 'berita'">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold text-dark mb-0"><i class="fas fa-newspaper me-2 text-primary"></i> Kelola Berita & Informasi</h5>
                <button type="button" @click="openAddBeritaModal" class="btn btn-primary btn-sm px-3 rounded-3 fw-bold">
                  <i class="fas fa-plus me-1"></i> Tambah Berita
                </button>
              </div>

              <div class="table-responsive rounded-3 border">
                <table class="table table-hover table-striped mb-0 align-middle">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-3" style="width: 80px;">Gambar</th>
                      <th>Judul Berita</th>
                      <th>Kategori</th>
                      <th>Penulis</th>
                      <th>Tanggal</th>
                      <th class="text-end pe-3" style="width: 150px;">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="news in beritaList" :key="news.id">
                      <td class="ps-3">
                        <img :src="news.gambar" alt="Thumbnail" class="rounded object-fit-cover" style="width: 55px; height: 45px; border: 1px solid #ddd;" />
                      </td>
                      <td>
                        <span class="fw-bold text-dark d-block text-truncate" style="max-width: 250px;">{{ news.judul }}</span>
                        <small class="text-muted text-truncate d-block" style="max-width: 250px;">{{ news.ringkasan }}</small>
                      </td>
                      <td>
                        <span class="badge bg-blue-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">{{ news.kategori }}</span>
                      </td>
                      <td>{{ news.penulis }}</td>
                      <td>{{ new Date(news.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) }}</td>
                      <td class="text-end pe-3">
                        <button type="button" @click="openEditBeritaModal(news)" class="btn btn-outline-secondary btn-sm me-1 px-2.5 rounded-2">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" @click="deleteBerita(news.id)" class="btn btn-outline-danger btn-sm px-2.5 rounded-2">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="beritaList.length === 0">
                      <td colspan="6" class="text-center py-4 text-muted">Belum ada berita. Silakan tambahkan berita baru.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 7: FAQ -->
            <div v-if="activeTab === 'faq'">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold text-dark mb-0"><i class="fas fa-question-circle me-2 text-primary"></i> Kelola Pertanyaan Umum (FAQ)</h5>
                <button type="button" @click="openAddFaqModal" class="btn btn-primary btn-sm px-3 rounded-3 fw-bold">
                  <i class="fas fa-plus me-1"></i> Tambah FAQ
                </button>
              </div>

              <div class="faq-accordion d-flex flex-column gap-3">
                <div v-for="(faq, idx) in content.faq_list" :key="idx" class="card border p-3 rounded-4 bg-light-subtle shadow-sm">
                  <div class="d-flex align-items-start justify-content-between gap-3">
                    <div class="flex-grow-1">
                      <h6 class="fw-bold text-dark mb-1 fs-6"><span class="text-primary">Q:</span> {{ faq.q }}</h6>
                      <p class="text-secondary fs-7 mb-0 mt-2"><span class="text-success fw-bold">A:</span> {{ faq.a }}</p>
                    </div>
                    <div class="d-flex flex-column gap-1">
                      <button type="button" @click="openEditFaqModal(faq, idx)" class="btn btn-sm btn-outline-secondary px-2.5 py-1.5 rounded-2">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button type="button" @click="deleteFaq(idx)" class="btn btn-sm btn-outline-danger px-2.5 py-1.5 rounded-2">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="!content.faq_list || content.faq_list.length === 0" class="text-center py-5 text-muted bg-light rounded-4">
                  Belum ada FAQ. Klik tombol tambah untuk membuat FAQ pertama Anda.
                </div>
              </div>
            </div>

            <!-- TAB 8: CTA BAWAH -->
            <div v-if="activeTab === 'cta'">
              <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-bullhorn me-2 text-primary"></i> Edit Bagian Ajakan Bertindak (CTA Bawah)</h5>
              <div class="row g-3">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Judul Banner CTA</label>
                    <input type="text" class="form-control" v-model="content.cta.title" placeholder="contoh: Siap Menjadi Agen Perubahan?" required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Sub-judul / Deskripsi Banner</label>
                    <textarea class="form-control" rows="4" v-model="content.cta.text" placeholder="Masukkan teks penjelasan ajakan bertindak..." required></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-dark fs-7">Teks Tombol Aksi</label>
                    <input type="text" class="form-control" v-model="content.cta.button" placeholder="contoh: Mulai Buat Pengaduan" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button Bar (only for static copywriting pages, other tabs save via handlers) -->
            <div v-if="activeTab !== 'berita' && activeTab !== 'faq'" class="border-top mt-5 pt-3 d-flex justify-content-end">
              <button type="submit" :disabled="saving" class="btn btn-primary px-5 py-2.5 rounded-3 fw-bold shadow">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-1"></i> Simpan Perubahan Tampilan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <!-- Modal Form Berita -->
    <div v-if="showBeritaModal" class="custom-modal-overlay" @click.self="showBeritaModal = false">
      <div class="custom-modal-card">
        <div class="custom-modal-header bg-light">
          <h5 class="fw-bold mb-0 text-dark">{{ isEditingBerita ? 'Ubah Berita' : 'Tambah Berita Baru' }}</h5>
          <button type="button" @click="showBeritaModal = false" class="btn-close border-0 bg-transparent fs-5"><i class="fas fa-times"></i></button>
        </div>
        <div class="custom-modal-body p-4">
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Judul Berita</label>
            <input type="text" class="form-control" v-model="beritaForm.judul" required />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Kategori</label>
            <select class="form-select" v-model="beritaForm.kategori">
              <option value="Pembangunan">Pembangunan</option>
              <option value="Pengumuman">Pengumuman</option>
              <option value="Kegiatan">Kegiatan</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Penulis</label>
            <input type="text" class="form-control" v-model="beritaForm.penulis" required />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Ringkasan Singkat</label>
            <textarea class="form-control" rows="2" v-model="beritaForm.ringkasan" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Konten Detail</label>
            <textarea class="form-control" rows="5" v-model="beritaForm.konten" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Gambar Berita (File Upload atau Image URL)</label>
            <div class="input-group mb-2">
              <input type="file" class="form-control" @change="handleBeritaImageUpload" accept="image/*" />
            </div>
            <input type="text" class="form-control" v-model="beritaForm.gambar" placeholder="Atau paste URL Gambar langsung di sini..." />
            <div v-if="beritaForm.gambar" class="mt-3 text-center">
              <img :src="beritaForm.gambar" alt="Preview" class="rounded border" style="max-height: 120px; max-width: 100%; object-fit: contain;" />
            </div>
          </div>
        </div>
        <div class="custom-modal-footer bg-light p-3">
          <button type="button" @click="showBeritaModal = false" class="btn btn-light rounded-3 fw-bold">Batal</button>
          <button type="button" @click="saveBerita" class="btn btn-primary rounded-3 fw-bold px-4">Simpan Berita</button>
        </div>
      </div>
    </div>


    <!-- Modal Form FAQ -->
    <div v-if="showFaqModal" class="custom-modal-overlay" @click.self="showFaqModal = false">
      <div class="custom-modal-card modal-medium">
        <div class="custom-modal-header bg-light">
          <h5 class="fw-bold mb-0 text-dark">{{ isEditingFaq ? 'Ubah Pertanyaan (FAQ)' : 'Tambah FAQ Baru' }}</h5>
          <button type="button" @click="showFaqModal = false" class="btn-close border-0 bg-transparent fs-5"><i class="fas fa-times"></i></button>
        </div>
        <div class="custom-modal-body p-4">
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Pertanyaan (Question)</label>
            <input type="text" class="form-control" v-model="faqForm.q" placeholder="Masukkan pertanyaan..." required />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark fs-7">Jawaban (Answer)</label>
            <textarea class="form-control" rows="4" v-model="faqForm.a" placeholder="Masukkan jawaban detail..." required></textarea>
          </div>
        </div>
        <div class="custom-modal-footer bg-light p-3">
          <button type="button" @click="showFaqModal = false" class="btn btn-light rounded-3 fw-bold">Batal</button>
          <button type="button" @click="saveFaq" class="btn btn-primary rounded-3 fw-bold px-4">Simpan FAQ</button>
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
  font-size: 0.82rem;
}

.fs-8 {
  font-size: 0.72rem;
}

.avatar-sm {
  flex-shrink: 0;
}

/* Custom modal layout */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.custom-modal-card {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-medium {
  max-width: 500px;
}

.custom-modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.custom-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
