import apiClient from "@/services/api";

export const produkService = {
    /**
     * Mengambil semua data produk dari API.
     * @returns {Promise<Array>}
     */
    async getProduk() {
        try {
            const response = await apiClient.get("/produk/getProduk");
            return response.data.Data;
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            throw error;
        }
    },

    /**
     * Menyimpan data produk baru ke API.
     * @param {FormData} formData Objek FormData yang berisi data produk.
     * @returns {Promise<Object>}
     */
    async storeProduk(formData) {
        try {
            const response = await apiClient.post("/produk/storeProduk", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Gagal menyimpan data produk:", error.response?.data);
            throw error;
        }
    },

    async updateProduk(id, payload) {
        try {
            // Menggunakan method POST dengan header method override untuk PUT
            payload.append("_method", "PUT");
            const response = await apiClient.post(
                `/produk/updateProduk/${id}`,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Gagal memperbarui data produk:", error.response?.data);
            throw error;
        }
    },

    async deleteProduk(payload) {
        try {
            const response = await apiClient.post(`/produk/deleteProduk`, payload);
            return response.data;
        } catch (error) {
            console.error("Gagal menghapus data produk:", error.response?.data);
            throw error;
        }
    },

    async getProdukByBarcode(payload) {
        try {
            const response = await apiClient.post(`/produk/getProdukByBarcode`, payload);
            return response.data; // { success, message, ... }
        } catch (error) {
            console.error("Error storeProduk:", error);
            throw error;
        }
    }
};
