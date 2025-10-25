import apiClient from '@/services/api'

export const diskonService = {
  /**
   * Mengambil semua data diskon dari API.
   * @returns {Promise<Array>}
   */
  async getDiskon() {
    try {
      const response = await apiClient.get('/diskon/getDiskon')
      return response.data.Data // Asumsi API mengembalikan { data: [...] }
    } catch (error) {
      console.error('Gagal mengambil data diskon:', error)
      throw error // Lempar error untuk ditangani di komponen
    }
  },

  /**
   * Menyimpan data diskon baru ke API.
   * @param {object} data - Objek yang berisi nama diskon.
   * @returns {Promise<object>}
   */
  async storeDiskon(data) {
    try {
      const response = await apiClient.post('/diskon/storeDiskon', data)
      return response.data
    } catch (error) {
      console.error('Gagal menyimpan diskon:', error.response?.data?.message || error.message)
      throw error
    }
  },

  async updateDiskon(id, data) {
    try {
      const response = await apiClient.put(`/diskon/updateDiskon/${id}`, data)

      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui data.')
      }
    } catch (error) {
      throw error
    }
  },

  // Menghapus data diskon
  async deleteDiskon(payload) {
    try {
      const response = await apiClient.post(`/diskon/deleteDiskon/`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
