<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const loading = ref(true)
const saving = ref(false)

const heroTitle = ref('')
const heroSubtitle = ref('')

const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fetchData = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('copywriting')
      .select('*')

    if (error) throw error

    if (data && data.length > 0) {
      const titleRow = data.find(item => item.section === 'hero_title')
      const subtitleRow = data.find(item => item.section === 'hero_subtitle')

      if (titleRow) heroTitle.value = titleRow.content
      if (subtitleRow) heroSubtitle.value = subtitleRow.content
    }
  } catch (error) {
    console.error('Error fetching copywriting data:', error)
    errorMessage.value = 'Gagal memuat data copywriting dari database.'
    showError.value = true
    setTimeout(() => { showError.value = false }, 3500)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  showSuccess.value = false
  showError.value = false

  try {
    const { error } = await supabase
      .from('copywriting')
      .upsert([
        { section: 'hero_title', content: heroTitle.value },
        { section: 'hero_subtitle', content: heroSubtitle.value }
      ], { onConflict: 'section' })

    if (error) throw error

    successMessage.value = 'Copywriting berhasil disimpan!'
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 3000)
  } catch (error) {
    console.error('Error saving copywriting data:', error)
    errorMessage.value = 'Gagal menyimpan data copywriting ke database.'
    showError.value = true
    setTimeout(() => { showError.value = false }, 3500)
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    localStorage.removeItem('laporgan_admin_token')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    localStorage.removeItem('laporgan_admin_token')
    router.push('/login')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-6 px-4">
    <!-- Alert Success -->
    <Transition name="fade">
      <div v-if="showSuccess" class="fixed bottom-5 right-5 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 transition-all duration-300">
        <i class="fas fa-check-circle text-lg"></i>
        <span>{{ successMessage }}</span>
      </div>
    </Transition>

    <!-- Alert Error -->
    <Transition name="fade">
      <div v-if="showError" class="fixed bottom-5 right-5 bg-red-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 transition-all duration-300">
        <i class="fas fa-exclamation-circle text-lg"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </Transition>

    <div v-if="loading" class="flex flex-col justify-center items-center py-20 gap-3">
      <div class="spinner-border spinner-border-lg border-4 animate-spin rounded-full w-12 h-12 border-t-transparent border-blue-600"></div>
      <span class="text-slate-500 font-medium">Memuat data dari database...</span>
    </div>

    <div v-else class="space-y-6">
      <!-- Welcome Header Card -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-aos="fade-up">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Manajemen Copywriting</h1>
          <p class="text-slate-500 text-sm mt-1">Kelola copywriting teks beranda utama LaporGan di sini.</p>
        </div>
        <div>
          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold rounded-xl border border-red-200 transition duration-200 text-sm flex items-center gap-2"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout Sesi</span>
          </button>
        </div>
      </div>

      <!-- Editor Card -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
          <i class="fas fa-edit text-blue-600 fs-5"></i>
          <h2 class="font-bold text-slate-700 text-lg">Sesuaikan Banner Hero Utama</h2>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSave" class="space-y-6">
            <!-- Hero Title Input -->
            <div class="space-y-2">
              <label class="block text-slate-700 font-semibold text-sm">
                Judul Hero Utama (<span class="text-blue-600 font-mono">hero_title</span>)
              </label>
              <input 
                type="text"
                v-model="heroTitle"
                required
                class="w-full px-4 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 rounded-xl transition duration-200 text-sm focus:outline-none"
                placeholder="Masukkan judul utama (misal: Suarakan Keluhan Anda di LaporGan)"
              />
              <p class="text-xs text-slate-400">Judul utama yang muncul dengan huruf paling besar di bagian atas halaman pendaratan.</p>
            </div>

            <!-- Hero Subtitle Textarea -->
            <div class="space-y-2">
              <label class="block text-slate-700 font-semibold text-sm">
                Sub-judul Hero (<span class="text-blue-600 font-mono">hero_subtitle</span>)
              </label>
              <textarea 
                v-model="heroSubtitle"
                required
                rows="4"
                class="w-full px-4 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 rounded-xl transition duration-200 text-sm focus:outline-none"
                placeholder="Masukkan deskripsi detail pendukung hero..."
              ></textarea>
              <p class="text-xs text-slate-400">Paragraf penjelasan di bawah judul utama untuk melengkapi kalimat copywriting Anda.</p>
            </div>

            <!-- Form Actions -->
            <div class="border-t border-slate-100 pt-5 flex justify-end gap-3">
              <button 
                type="button" 
                @click="fetchData"
                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition duration-200 text-sm"
              >
                Reset Perubahan
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition duration-200 text-sm flex items-center gap-2"
              >
                <span v-if="saving" class="spinner-border spinner-border-sm border-2 animate-spin rounded-full w-4 h-4 border-t-transparent border-white"></span>
                <span>{{ saving ? 'Menyimpan...' : 'Simpan Copywriting' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
