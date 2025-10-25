import apiClient from '@/services/api'

export const userService = {
  /**
   * Mengambil semua data pengguna (user) dari API.
   * @returns {Promise<Array>} Array berisi objek user.
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/users/getUsers')
      // Asumsi API mengembalikan { success: true, message: ..., Data: [...] }
      return response.data.Data
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error)
      throw error // Lempar error untuk ditangani di komponen Vue
    }
  },

  /**
   * Mengambil data pengguna berdasarkan ID.
   * @param {number} id ID pengguna yang akan diambil.
   * @returns {Promise<Object>} Objek user.
   */
  async getUsersByID(id) {
    try {
      const response = await apiClient.get(`/users/getUsersByID/${id}`)
      // Asumsi API mengembalikan { success: true, message: ..., Data: [...] }
      // Karena ini mengambil by ID, mungkin akan mengembalikan array 1 item,
      // jadi kita ambil item pertamanya jika ada.
      return response.data.Data[0] || null
    } catch (error) {
      console.error(`Gagal mengambil data pengguna dengan ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Memperbarui data pengguna yang sudah ada di API.
   * @param {number} id ID pengguna yang akan diperbarui.
   * @param {Object} data Objek berisi data yang akan diperbarui (email, password, role_id).
   * @returns {Promise<Object>} Data respons dari API.
   */
  async updateUsers(id, data) {
    try {
      const response = await apiClient.put(`/users/updateUsers/${id}`, data)
      return response.data
    } catch (error) {
      console.error(
        `Gagal memperbarui data pengguna dengan ID ${id}:`,
        error.response?.data || error.message,
      )
      throw error
    }
  },

  // Anda bisa menambahkan fungsi lain di sini jika ada (misalnya: deleteUsers, storeUsers)
}
