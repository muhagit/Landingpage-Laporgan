<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';

const loading = ref(true);
const kategoriList = ref([]);
const newKategoriName = ref('');
const editingKategori = ref(null);
const editingKategoriName = ref('');

// Alert states
const showSuccess = ref(false);
const showError = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchKategori = async () => {
  loading.value = true;
  try {
    kategoriList.value = await api.getKategori();
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKategori();
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

const handleAddKategori = async () => {
  if (!newKategoriName.value.trim()) {
    triggerError('Nama kategori tidak boleh kosong!');
    return;
  }

  try {
    const res = await api.addKategori(newKategoriName.value.trim());
    kategoriList.value.push(res);
    newKategoriName.value = '';
    triggerSuccess('Kategori baru berhasil ditambahkan!');
  } catch (error) {
    console.error(error);
    triggerError('Gagal menambahkan kategori.');
  }
};

const startEdit = (kat) => {
  editingKategori.value = kat.id;
  editingKategoriName.value = kat.nama_kategori;
};

const cancelEdit = () => {
  editingKategori.value = null;
  editingKategoriName.value = '';
};

const handleUpdateKategori = async (id) => {
  if (!editingKategoriName.value.trim()) {
    triggerError('Nama kategori tidak boleh kosong!');
    return;
  }

  try {
    const updated = await api.updateKategori(id, editingKategoriName.value.trim());
    const idx = kategoriList.value.findIndex(k => k.id === id);
    if (idx !== -1) {
      kategoriList.value[idx] = updated;
    }
    cancelEdit();
    triggerSuccess('Kategori berhasil diperbarui!');
  } catch (error) {
    console.error(error);
    triggerError('Gagal memperbarui kategori.');
  }
};

const handleDeleteKategori = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? Kategori yang terhapus tidak akan tersedia lagi untuk pengaduan baru.')) return;

  try {
    await api.deleteKategori(id);
    kategoriList.value = kategoriList.value.filter(k => k.id !== id);
    triggerSuccess('Kategori berhasil dihapus!');
  } catch (error) {
    console.error(error);
    triggerError('Gagal menghapus kategori.');
  }
};
</script>

<template>
  <div class="kategori-list-container">
    <!-- Alert Feedback -->
    <div v-if="showSuccess" class="alert alert-success position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-check-circle me-2"></i> {{ successMessage }}
    </div>
    <div v-if="showError" class="alert alert-danger position-fixed bottom-0 end-0 m-3 shadow-lg z-3" role="alert">
      <i class="fas fa-times-circle me-2"></i> {{ errorMessage }}
    </div>

    <div class="row g-4">
      <!-- Input Card -->
      <div class="col-lg-4" data-aos="fade-right">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3 text-dark">Tambah Kategori Baru</h5>
            <p class="text-muted fs-7 mb-4">
              Kategori yang ditambahkan akan muncul sebagai pilihan di menu dropdown pengisian laporan pengaduan masyarakat.
            </p>
            <form @submit.prevent="handleAddKategori">
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark fs-7 text-uppercase">Nama Kategori</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Misal: Penerangan Jalan, Pungli, dll" 
                  v-model="newKategoriName"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100 py-2.5 rounded-3 fw-medium">
                <i class="fas fa-plus me-1"></i> Tambah Kategori
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="col-lg-8" data-aos="fade-left">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-header bg-white border-0 py-3 px-4">
            <h5 class="mb-0 fw-bold text-dark">Daftar Kategori Laporan</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted fs-7 text-uppercase">
                  <tr>
                    <th class="px-4 py-3 border-0" style="width: 80px;">ID</th>
                    <th class="py-3 border-0">Nama Kategori</th>
                    <th class="py-3 border-0 text-end px-4" style="width: 200px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kat in kategoriList" :key="kat.id">
                    <td class="px-4 py-3 text-muted fw-bold">#{{ kat.id }}</td>
                    <td class="py-3">
                      <!-- Mode Edit -->
                      <div v-if="editingKategori === kat.id" class="input-group input-group-sm max-w-400">
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="editingKategoriName" 
                          @keyup.enter="handleUpdateKategori(kat.id)"
                        />
                        <button class="btn btn-success" @click="handleUpdateKategori(kat.id)">
                          <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-secondary" @click="cancelEdit">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <!-- Mode Tampil -->
                      <span v-else class="fw-semibold text-dark fs-6">{{ kat.nama_kategori }}</span>
                    </td>
                    <td class="py-3 text-end px-4">
                      <div v-if="editingKategori !== kat.id" class="d-flex align-items-center justify-content-end gap-2">
                        <button 
                          class="btn btn-sm btn-outline-primary rounded-pill px-3 fs-7" 
                          @click="startEdit(kat)"
                        >
                          <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center" 
                          style="width: 32px; height: 32px;"
                          @click="handleDeleteKategori(kat.id)"
                        >
                          <i class="fas fa-trash-alt fs-7"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="kategoriList.length === 0 && !loading">
                    <td colspan="3" class="text-center py-5 text-muted">
                      <i class="fas fa-folder-open fs-2 d-block mb-2"></i>
                      Belum ada kategori yang ditambahkan.
                    </td>
                  </tr>
                  <tr v-if="loading">
                    <td colspan="3" class="text-center py-5 text-muted">
                      <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Memuat data kategori...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kategori-list-container {
  padding-bottom: 2rem;
}

.max-w-400 {
  max-width: 400px;
}

.fs-7 {
  font-size: 0.8rem;
}
</style>
