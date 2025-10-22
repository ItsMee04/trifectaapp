import apiClient from '@/services/api'

/**
 * Melakukan permintaan login ke API.
 * * @param {object} credentials - Objek berisi email dan password.
 * @returns {object} Data respons dari API (idealnya berisi token dan user data).
 * @throws {Error} Melempar error jika login gagal.
 */
export async function login(credentials) {
  try {
    // Panggil endpoint /auth/login
    const response = await apiClient.post('/login', credentials)

    // Kembalikan data yang diterima dari API (yang akan digunakan oleh Pinia Store)
    // Asumsi response.data = { token: '...', user: {...} }
    return response.data
  } catch (error) {
    // Biarkan error dilempar agar ditangkap di lapisan Pinia Store atau Composable
    throw error
  }
}

/**
 * Fungsi pembantu untuk membersihkan sisi klien jika diperlukan
 * setelah logout (walaupun sebagian besar sudah ditangani oleh Pinia Store).
 */
export async function logout() {
  try {
    // Panggil endpoint logout (jika API Anda memilikinya untuk invalidasi token di sisi server)
    await apiClient.post('/logout')

    return true
  } catch (error) {
    // Jika ada error pada proses server-side logout, kita abaikan
    // karena tujuan utama sudah tercapai (token akan dihapus di sisi klien oleh Pinia Store).
    // Anda bisa memilih untuk melempar error di sini jika itu kritis.
    // throw error;
    return false
  }
}
