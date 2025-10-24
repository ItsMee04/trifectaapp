// src/services/usermanagement/pegawaiService.js
import apiClient from "@/services/api";

export const pegawaiService = {
    /**
     * Mengambil semua data pegawai dari API.
     * @returns {Promise<Array>}
     */
    async getPegawai() {
        try {
            const response = await apiClient.get("/pegawai/getPegawai");
            return response.data.Data;
        } catch (error) {
            console.error("Gagal mengambil data pegawai:", error);
            throw error;
        }
    },

    /**
     * Menyimpan data pegawai baru ke API.
     * @param {FormData} formData Objek FormData yang berisi data pegawai.
     * @returns {Promise<Object>}
     */
    async storePegawai(formData) {
        try {
            const response = await apiClient.post("/pegawai/storePegawai", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Gagal menyimpan data pegawai:", error.response?.data);
            throw error;
        }
    },

    /**
     * Memperbarui data pegawai yang sudah ada di API.
     * @param {number} id ID pegawai yang akan diperbarui.
     * @param {FormData} formData Objek FormData yang berisi data yang diperbarui.
     * @returns {Promise<Object>}
     */
    async updatePegawai(id, formData) {
        try {
            // Menggunakan method POST dengan header method override untuk PUT
            formData.append("_method", "PUT");
            const response = await apiClient.post(
                `/pegawai/updatePegawai/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Gagal memperbarui data pegawai:", error.response?.data);
            throw error;
        }
    },

    async deletePegawai(payload) {
        try {
            const response = await apiClient.post(`/pegawai/deletePegawai/`, payload);
            return response.data;
        } catch (error) {
            console.error("Gagal menghapus data pegawai:", error.response?.data);
            throw error;
        }
    },
};
