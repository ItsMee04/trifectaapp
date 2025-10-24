import apiClient from '@/services/api'

export const jabatanService = {
  /**
   * Mengambil semua data jabatan dari API.
   * @returns {Promise<Array>}
   */
  async getJabatan() {
    try {
      const response = await apiClient.get('/jabatan/getJabatan')
      return response.data.Data // Asumsi API mengembalikan { data: [...] }
    } catch (error) {
      console.error('Gagal mengambil data jabatan:', error)
      throw error // Lempar error untuk ditangani di komponen
    }
  },

  /**
   * Menyimpan data jabatan baru ke API.
   * @param {object} data - Objek yang berisi nama_jabatan.
   * @returns {Promise<object>}
   */
  async storeJabatan(data) {
    try {
      const response = await apiClient.post('/jabatan/storeJabatan', data)
      return response.data
    } catch (error) {
      console.error('Gagal menyimpan jabatan:', error.response?.data?.message || error.message)
      throw error
    }
  },

  async updateJabatan(id, data) {
    try {
      const response = await apiClient.put(`/jabatan/updateJabatan/${id}`, data)

      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui data.')
      }
    } catch (error) {
      throw error
    }
  },

  // Menghapus data jabatan
  async deleteJabatan(payload) {
    try {
      const response = await apiClient.post("/jabatan/deleteJabatan", payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
