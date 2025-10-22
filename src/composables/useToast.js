// src/composables/useToast.js

// Impor langsung fungsi toast dari package
import { toast } from 'vue3-toastify'

/**
 * Composable untuk menangani notifikasi toast menggunakan vue3-toastify.
 * Karena toast diekspor dan diinisialisasi secara global, kita hanya perlu
 * membungkusnya dalam fungsi helper untuk konsistensi.
 */
export function useToast() {
  const notify = {
    // Tampilkan notifikasi sukses
    success: (message) => {
      toast.success(message)
    },

    // Tampilkan notifikasi error
    error: (message) => {
      toast.error(message)
    },

    // Tampilkan notifikasi peringatan
    warning: (message) => {
      toast.warn(message)
    },

    // Tampilkan notifikasi umum
    info: (message) => {
      toast.info(message)
    },

    // Tampilkan notifikasi default
    default: (message) => {
      toast(message)
    },
  }

  return notify
}
