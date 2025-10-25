import apiClient from '@/services/api'

export const kondisiService = {
  /**
   * Mengambil semua data kondisi dari API.
   * @returns {Promise<Array>}
   */
  async getKondisi() {
    try {
      const response = await apiClient.get('/kondisi/getKondisi')
      return response.data.Data // Asumsi API mengembalikan { data: [...] }
    } catch (error) {
      console.error('Gagal mengambil data kondisi:', error)
      throw error // Lempar error untuk ditangani di komponen
    }
  },

  /**
   * Menyimpan data kondisi baru ke API.
   * @param {object} data - Objek yang berisi nama kondisi.
   * @returns {Promise<object>}
   */
  async storeKondisi(data) {
    try {
      const response = await apiClient.post('/kondisi/storeKondisi', data)
      return response.data
    } catch (error) {
      console.error('Gagal menyimpan kondisi:', error.response?.data?.message || error.message)
      throw error
    }
  },

  async updateKondisi(id, data) {
    try {
      const response = await apiClient.put(`/kondisi/updateKondisi/${id}`, data)

      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui data.')
      }
    } catch (error) {
      throw error
    }
  },

  // Menghapus data kondisi
  async deleteKondisi(payload) {
    try {
      const response = await apiClient.post(`/kondisi/deleteKondisi/`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
