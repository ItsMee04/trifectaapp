import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 0. Root ke login ---
    {
      path: '/',
      name: 'root',
      component: () => import('@/modules/Auth/views/LoginPage.vue'),
      meta: { requiresGuest: true },
    },

    // --- 1. Auth routes ---
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/Auth/views/LoginPage.vue'),
      meta: { requiresGuest: true },
    },

    // --- 2. Protected routes (harus login) ---
    {
      path: '/app',
      component: () => import('@/layouts/MainLayouts.vue'), // Layout utama setelah login
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/modules/Dashboard/views/DashboardPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/jabatan',
          name: 'jabatan',
          component: () => import('@/modules/Jabatan/views/JabatanPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/pegawai',
          name: 'pegawai',
          component: () => import('@/modules/Pegawai/views/PegawaiPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@/modules/Role/views/RolePage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/modules/User/views/UserPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/kondisi',
          name: 'kondisi',
          component: () => import('@/modules/Kondisi/views/KondisiPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/diskon',
          name: 'diskon',
          component: () => import('@/modules/Diskon/views/DiskonPage.vue'),
          meta: { requiresAuth: true },
        },
        // Tambah rute lain di sini
      ],
    },

    // --- 3. Not Found ---
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/modules/Errors/NotFoundPage.vue'),
    },
  ],
})

/* ---------------------------------------------------
   🧠 Global Navigation Guard
--------------------------------------------------- */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  // Jika user SUDAH login tapi ke halaman login → redirect ke dashboard
  if (requiresGuest && isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  // Jika user BELUM login tapi ke halaman yang butuh login → redirect ke login
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
    return
  }

  // Lanjut navigasi
  next()
})

export default router
