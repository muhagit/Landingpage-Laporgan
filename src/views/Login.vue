<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan Password wajib diisi!'
    showError.value = true
    setTimeout(() => { showError.value = false }, 3000)
    return
  }

  loading.value = true
  showError.value = false
  showSuccess.value = false

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMessage.value = error.message || 'Email atau Password salah!'
      showError.value = true
      setTimeout(() => { showError.value = false }, 3500)
    } else {
      showSuccess.value = true
      localStorage.setItem('laporgan_admin_token', data.session.access_token)
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    }
  } catch (err) {
    console.error('Login error:', err)
    errorMessage.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    showError.value = true
    setTimeout(() => { showError.value = false }, 3500)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- background glowing decorative elements -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full filter blur-[150px] opacity-25"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full filter blur-[150px] opacity-25"></div>

    <!-- Alert notifications -->
    <Transition name="fade">
      <div v-if="showError" class="fixed bottom-5 right-5 bg-red-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 transition-all duration-300">
        <i class="fas fa-exclamation-circle text-lg"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showSuccess" class="fixed bottom-5 right-5 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 transition-all duration-300">
        <i class="fas fa-check-circle text-lg"></i>
        <span>Login berhasil! Mengarahkan ke dashboard...</span>
      </div>
    </Transition>

    <div class="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 relative z-10" data-aos="fade-up">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-4 text-decoration-none">
          <img src="@/assets/logo.png" alt="LaporGan Logo" class="h-10 w-auto object-contain" />
          <span class="text-2xl font-black text-white tracking-tight">LaporGan</span>
        </router-link>
        <h2 class="text-xl font-bold text-slate-100">Portal Admin</h2>
        <p class="text-slate-400 text-sm mt-1">Silakan masuk menggunakan kredensial admin Anda</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-slate-300 text-sm font-semibold mb-2">Email</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <i class="fas fa-envelope"></i>
            </span>
            <input 
              type="email" 
              class="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 rounded-xl transition duration-200 text-sm focus:outline-none"
              placeholder="admin@laporgan.com" 
              v-model="email" 
              required 
            />
          </div>
        </div>

        <div>
          <label class="block text-slate-300 text-sm font-semibold mb-2">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <i class="fas fa-lock"></i>
            </span>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 rounded-xl transition duration-200 text-sm focus:outline-none"
              placeholder="••••••••" 
              v-model="password" 
              required 
            />
            <button 
              type="button"
              @click="togglePassword" 
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300 transition focus:outline-none"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition duration-200 text-sm flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm border-2 animate-spin rounded-full w-4 h-4 border-t-transparent border-white"></span>
          <span>{{ loading ? 'Sedang Masuk...' : 'Masuk' }}</span>
        </button>
      </form>

      <div class="text-center mt-6 text-xs text-slate-500 border-t border-slate-700/50 pt-4">
        &copy; 2026 LaporGan. Hak Cipta Dilindungi.
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
