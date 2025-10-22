import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // Import Pinia Store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 0. Rute Root (New) ---
    // Jika user mengakses /, akan diarahkan ke LoginPage.vue, tetapi guard akan menanganinya
    {
      path: '/',
      name: 'root',
      component: () => import('@/modules/Auth/views/LoginPage.vue'),
      meta: { requiresGuest: true },
    },

    // --- 1. Rute Otentikasi (Diblokir jika sudah login) ---
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/Auth/views/LoginPage.vue'),
      meta: { requiresGuest: true },
    },
    // Jika Anda memiliki halaman register, tambahkan di sini dengan meta: { requiresGuest: true }
    // ---------------------------------------------------------------------

    // --- 2. Rute Aplikasi Utama (Memerlukan Login) ---
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/modules/Dashboard/views/DashboardPage.vue'), // Asumsi lokasi modul Dashboard
    //   meta: { requiresAuth: true }, // Rute yang memerlukan login
    // },
    // Tambahkan rute aplikasi lain seperti /settings, /inventory, dll.

    // --- 3. Rute Catch-all (Opsional, untuk halaman 404) ---
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/modules/Errors/NotFoundPage.vue'), // Ganti dengan path ke halaman 404 Anda
    },
  ],
})

// --- 4. Global Before Guard ---
router.beforeEach((to, from, next) => {
  // Pinia Store harus diakses di dalam guard
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Cek apakah rute saat ini memerlukan otentikasi atau status guest
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  // Kasus A: Jika rute memerlukan status "belum login" (requiresGuest: true)
  // Contoh: user sudah login, tapi mencoba ke / atau /login
  if (requiresGuest && isAuthenticated) {
    // Redirect ke dashboard
    next({ name: 'dashboard' })
    return
  }

  // Kasus B: Jika rute memerlukan login (requiresAuth: true)
  // Contoh: user belum login, tapi mencoba ke /dashboard
  if (requiresAuth && !isAuthenticated) {
    // Redirect ke halaman login
    next({ name: 'login' })
    return
  }

  // Kasus C: Lanjutkan navigasi (tidak ada pembatasan yang dilanggar)
  next()
})

export default router
