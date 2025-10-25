import apiClient from '@/services/api'

export const jenisService = {
  /**
   * Mengambil semua data jenis dari API.
   * @returns {Promise<Array>}
   */
  async getJenis() {
    try {
      const response = await apiClient.get('/jenisproduk/getJenisProduk')
      return response.data.Data
    } catch (error) {
      console.error('Gagal mengambil data jenis:', error)
      throw error
    }
  },

  /**
   * Menyimpan data jenis baru ke API.
   * @param {FormData} formData Objek FormData yang berisi data jenis.
   * @returns {Promise<Object>}
   */
  async storeJenis(formData) {
    try {
      const response = await apiClient.post('/jenisproduk/storeJenisProduk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Gagal menyimpan data jenis:', error.response?.data)
      throw error
    }
  },

  /**
   * Memperbarui data jenis yang sudah ada di API.
   * @param {number} id ID jenis yang akan diperbarui.
   * @param {FormData} formData Objek FormData yang berisi data yang diperbarui.
   * @returns {Promise<Object>}
   */
  async updateJenis(id, formData) {
    try {
      // Menggunakan method POST dengan header method override untuk PUT
      formData.append('_method', 'PUT')
      const response = await apiClient.post(`/jenisproduk/updateJenisProduk/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Gagal memperbarui data jenis:', error.response?.data)
      throw error
    }
  },

  /**
   * Menghapus data jenis berdasarkan ID.
   * @param {number} id ID jenis yang akan dihapus.
   * @returns {Promise<Object>}
   */
  async deleteJenis(payload) {
    try {
      const response = await apiClient.post(`/jenisproduk/deleteJenisProduk/`, payload)
      return response.data
    } catch (error) {
      console.error('Gagal menghapus data jenis:', error.response?.data)
      throw error
    }
  },
}
