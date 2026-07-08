<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logoutAdmin = () => {
  localStorage.removeItem('laporgan_admin_token');
  router.push('/login');
};

// Check mobile size on mount to auto-collapse sidebar
onMounted(() => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      isSidebarOpen.value = false;
    } else {
      isSidebarOpen.value = true;
    }
  });
});
</script>

<template>
  <div class="admin-layout d-flex">
    <!-- Sidebar -->
    <aside :class="['sidebar shadow-lg', { 'sidebar-collapsed': !isSidebarOpen }]">
      <div class="sidebar-header d-flex align-items-center justify-content-between px-4 py-3">
        <router-link to="/admin/dashboard" class="d-flex align-items-center gap-2 text-decoration-none text-light">
          <i class="fas fa-shield-alt logo-icon"></i>
          <span class="fw-bold fst-italic logo-text fs-4">LaporGan Admin</span>
        </router-link>
        <button class="btn btn-link text-light d-md-none border-0" @click="toggleSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="sidebar-menu px-3 py-4">
        <ul class="nav flex-column gap-2">
          <li class="nav-item">
            <router-link 
              to="/admin/dashboard" 
              class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3"
              active-class="active"
            >
              <i class="fas fa-chart-line fs-5"></i>
              <span class="menu-text">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/admin/pengaduan" 
              class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3"
              active-class="active"
            >
              <i class="fas fa-file-alt fs-5"></i>
              <span class="menu-text">Daftar Pengaduan</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/admin/kategori" 
              class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3"
              active-class="active"
            >
              <i class="fas fa-tags fs-5"></i>
              <span class="menu-text">Kelola Kategori</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/admin/editor" 
              class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3"
              active-class="active"
            >
              <i class="fas fa-desktop fs-5"></i>
              <span class="menu-text">Kelola Tampilan</span>
            </router-link>
          </li>
          <li class="nav-separator my-3"></li>
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-light-50 hover-light"
            >
              <i class="fas fa-home fs-5"></i>
              <span class="menu-text">Kembali ke Beranda</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-footer px-4 py-3 border-top border-secondary border-opacity-25 mt-auto">
        <div class="admin-profile d-flex align-items-center gap-3 mb-3">
          <div class="admin-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
            A
          </div>
          <div class="admin-info">
            <h6 class="text-white mb-0 fs-6">Administrator</h6>
            <small class="text-white-50">admin@laporgan.go.id</small>
          </div>
        </div>
        <button class="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2" @click="logoutAdmin">
          <i class="fas fa-sign-out-alt"></i>
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Panel -->
    <div class="main-panel flex-grow-1 min-vh-100 d-flex flex-column">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 sticky-top">
        <div class="container-fluid p-0">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-light border-0 shadow-sm" @click="toggleSidebar">
              <i class="fas fa-bars"></i>
            </button>
            <h5 class="mb-0 fw-semibold text-dark d-none d-sm-inline-block">
              {{ route.name === 'AdminDashboard' ? 'Dashboard Utama' : route.name === 'AdminPengaduan' ? 'Manajemen Pengaduan' : route.name === 'AdminKategori' ? 'Manajemen Kategori' : route.name === 'AdminEditor' ? 'Manajemen Konten Tampilan' : 'Admin Panel' }}
            </h5>
          </div>

          <div class="ms-auto d-flex align-items-center gap-3">
            <span class="badge bg-light text-dark border py-2 px-3 d-none d-md-inline-block">
              <i class="far fa-calendar-alt me-2 text-primary"></i>
              {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </span>
            <div class="dropdown">
              <button class="btn btn-light border-0 dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <div class="admin-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-xs" style="width:30px; height:30px; font-size: 13px;">
                  A
                </div>
                <span class="d-none d-sm-inline-block">Admin LaporGan</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                <li><a class="dropdown-menu-item dropdown-item" href="#" @click.prevent="logoutAdmin"><i class="fas fa-sign-out-alt me-2 text-danger"></i>Keluar</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <!-- Router Content -->
      <main class="content-wrapper flex-grow-1 p-4 bg-light bg-opacity-50">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

/* Sidebar Styling */
.sidebar {
  width: 280px;
  background-color: var(--nav-color);
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1050;
  flex-shrink: 0;
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  color: var(--blue-color);
  filter: drop-shadow(0 0 8px rgba(75, 112, 245, 0.6));
}

.sidebar .nav-link {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.sidebar .nav-link:hover, 
.sidebar .nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .nav-link.active {
  background-color: var(--blue-color) !important;
  box-shadow: 0 4px 12px rgba(75, 112, 245, 0.3);
}

.nav-separator {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
}

.admin-avatar {
  width: 42px;
  height: 42px;
}

/* Collapsed State */
.sidebar-collapsed {
  margin-left: -280px;
}

@media (min-width: 768px) {
  .sidebar-collapsed {
    margin-left: 0;
    width: 80px;
  }
  
  .sidebar-collapsed .logo-text,
  .sidebar-collapsed .menu-text,
  .sidebar-collapsed .admin-profile,
  .sidebar-collapsed .sidebar-footer span {
    display: none !important;
  }
  
  .sidebar-collapsed .sidebar-header {
    justify-content: center !important;
    padding: 1.5rem 0 !important;
  }
  
  .sidebar-collapsed .sidebar-menu {
    padding: 1.5rem 0.5rem !important;
  }
  
  .sidebar-collapsed .nav-link {
    justify-content: center;
    padding: 0.8rem 0 !important;
  }
  
  .sidebar-collapsed .sidebar-footer {
    padding: 1rem 0.5rem !important;
  }
}

/* Main Panel Styling */
.main-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f8f9fa;
  max-width: 100%;
}

.navbar {
  background-color: white !important;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04);
}

.content-wrapper {
  background-color: #f3f5f8;
}

.hover-light:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
