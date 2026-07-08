<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import loginButton from "@/components/WhiteButtonOutline.vue";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
const lastScrollPosition = ref(0);
const isNavbarVisible = ref(true);
const navbar = ref(null);
const navbarContainer = ref(null);
// Untuk toggle hamburger menu
const isNavOpen = ref(false);

const route = useRoute();
const showNavbar = computed(() => {
  const path = route.path || '';
  return !path.startsWith('/admin') && path !== '/login' && path !== '/daftar';
});
const handleClickOutside = (event) => {
  if (isNavOpen.value && navbarContainer.value && !navbarContainer.value.contains(event.target)) {
    closeNavbar();
  }
};
const toggleNavbar = () => {
  isNavOpen.value = !isNavOpen.value;
};

const closeNavbar = () => {
  isNavOpen.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    const currentScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollPosition < 0) return;
    if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60) return;

    isNavbarVisible.value = currentScrollPosition < lastScrollPosition.value;
    lastScrollPosition.value = currentScrollPosition;

    navbar.value = document.getElementById("navbar");
    if (navbar.value) {
      navbar.value.style.transform = isNavbarVisible.value
        ? "translateY(0)"
        : "translateY(-100%)";
      navbar.value.style.transition = "transform 0.8s";
    }
  });
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <nav v-if="showNavbar" ref="navbarContainer" class="navbar navbar-expand-lg navbar-dark shadow-lg fixed-top" id="navbar">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="#">
        <router-link
          to="/"
          class="text-decoration-none text-light fw-bold fst-italic d-flex align-items-center gap-2"
          style="line-height: 1.2"
        >
          <img src="@/assets/logo.png" alt="Logo" style="height: 35px; width: auto; object-fit: contain;" />
          <span>LaporGan</span>
        </router-link>
      </a>

      <!-- Toggle button manual -->
      <button
        class="navbar-toggler border-0 hoverable"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleNavbar"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- Manual collapse using class binding -->
      <div :class="['collapse navbar-collapse', { show: isNavOpen }]">
        <ul class="navbar-nav ms-auto gap-3">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" @click="closeNavbar">Beranda</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/formpengaduan" class="nav-link" active-class="active" @click="closeNavbar">Buat Pengaduan</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/lacakpengaduan" class="nav-link" active-class="active" @click="closeNavbar">Lacak Pengaduan</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/pusatbantuan" class="nav-link" active-class="active" @click="closeNavbar">Pusat Bantuan</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div :class="{ 'content-offset': showNavbar && route.path !== '/' }">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.navbar {
  background-color: var(--nav-color) !important;
}

.navbar .nav-link {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease, font-weight 0.3s ease;
}

.navbar .nav-link.active {
  color: white !important;
}

.navbar .nav-link:hover {
  color: white;
}

.navbar-toggler:hover {
  border: none;
}

.navbar-toggler::after {
  border: none;
}

.content-offset {
  margin-top: 76px;
}
</style>
