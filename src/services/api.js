import axios from 'axios'
import { useAuthStore } from '@/stores/authStore' // Import Store Pinia

// 1. INISIALISASI AXIOS CLIENT
const apiClient = axios.create({
  // Menggunakan Environment Variable dari file .env
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// 2. Interceptor Permintaan (Request Interceptor) - KODE ANDA
apiClient.interceptors.request.use(
  (config) => {
    // Panggil Store dan ambil token
    const authStore = useAuthStore()
    const token = authStore.authToken // <-- Ambil dari Pinia Store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 3. Interceptor Respons (Response Interceptor) - PERBAIKAN LOGIKA 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()
    const responseStatus = error.response ? error.response.status : null

    // Asumsi: Endpoint login (relatif terhadap baseURL) adalah '/login'
    // Kita cek path URL yang gagal. Kita hanya perlu melihat 'config.url'.
    const isLoginRequest = error.config.url.includes('/login')

    if (responseStatus === 401) {
      console.error('Unauthorized (401) detected.')

      // KASUS PENGECUALIAN: Jika 401 datang dari request login (kredensial salah)
      if (isLoginRequest) {
        // Biarkan error 401 ini diteruskan ke `authStore.loginUser()`
        // agar ia bisa menampilkan toast error, JANGAN logout.
        return Promise.reject(error)
      }

      // KASUS NORMAL: Jika 401 datang dari request lain (token expired/invalid)
      if (!isLoginRequest && authStore.isAuthenticated) {
        // Panggil action logout dari Store
        authStore.logout() // Memanggil action logout di Pinia
        console.error('Session expired. Token cleared and user logged out.')
      }
    }

    // Lanjutkan penanganan error untuk kasus lain (404, 500, dll)
    return Promise.reject(error)
  },
)

export default apiClient
