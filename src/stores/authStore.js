import { defineStore } from 'pinia'
import router from '@/router'
import { useToast } from '@/composables/useToast'
import { login as loginService, logout as logoutService } from '@/modules/Auth/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authToken: null,
    user: null,
    isLoading: false,
    // --- STATE BARU UNTUK MENGINGAT EMAIL ---
    rememberedEmail: null,
    // ----------------------------------------
  }),

  getters: {
    isAuthenticated: (state) => !!state.authToken,
    // Menggunakan 'nama' sesuai respons API
    username: (state) => (state.user ? state.user.nama : 'Guest'),
  },

  actions: {
    // 1. Menyimpan data otentikasi
    setAuth(token, userData) {
      this.authToken = token
      this.user = userData
    },

    // 2. Action Login
    async loginUser(credentials) {
      const toast = useToast()
      this.isLoading = true

      try {
        const responseData = await loginService(credentials)

        // Menggunakan 'access_token' sesuai respons API
        const token = responseData.access_token
        const userData = responseData.user

        if (!token || !userData) {
          throw new Error(
            'Respons API tidak valid: access_token atau data pengguna tidak ditemukan.',
          )
        }

        this.setAuth(token, userData)

        toast.success('Login Berhasil! Selamat datang.')
        router.push('/dashboard')
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login gagal. Cek kredensial.'
        toast.error(errorMessage)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 3. Action Logout
    async logout() {
      try {
        await logoutService()
      } catch (error) {
        console.warn('Logout server-side failed, but client data cleared.')
      }

      this.authToken = null
      this.user = null

      const toast = useToast()
      toast.info('Anda telah logout.')

      router.push('/login')
    },
  },

  persist: {
    storage: sessionStorage,
    // --- PASTIKAN 'rememberedEmail' di-persist ---
    paths: ['authToken', 'user', 'rememberedEmail'],
  },
})
