<template>
  <div class="error-page">
    <div class="main-wrapper">
      <div class="error-box">
        <div class="error-img">
          <!-- Pastikan path aset ini benar di proyek Anda -->
          <img src="/src/assets/img/authentication/error-404.png" class="img-fluid" alt="404 Not Found" />
        </div>
        <h3 class="h2 mb-3">Oops, something went wrong</h3>
        <p>
          Error 404 Page not found. Sorry the page you looking for doesn’t exist or has been moved
        </p>
        <!-- Menggunakan router.push untuk navigasi dalam SPA -->
        <button @click="goToDashboard" class="btn btn-primary">Back to Homepage</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Import Pinia Auth Store

const router = useRouter();
const authStore = useAuthStore(); // Inisialisasi store

/**
 * Mengarahkan pengguna kembali ke halaman utama yang benar.
 * Jika login: ke dashboard.
 * Jika belum login: ke halaman login.
 */
const goToDashboard = () => {
  if (authStore.isAuthenticated) {
    // Jika user sudah login, arahkan ke dashboard
    router.push({ name: 'dashboard' });
  } else {
    // Jika user belum login, arahkan ke halaman login
    router.push({ name: 'login' });
  }
};
</script>
