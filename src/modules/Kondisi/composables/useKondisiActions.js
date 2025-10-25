// modules/Kondisi/composables/useKondisiActions.js
import { ref } from 'vue'
import { kondisiService } from '../services/kondisiService' // Gunakan service API yang sesungguhnya
import { useToast } from '@/composables/useToast'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'

const toast = useToast()
// Fungsi Validasi sudah diatur di useKondisiActions
const validateForm = (formData, errorState) => {
  errorState.value = {}
  if (!formData.kondisi || formData.kondisi.trim() === '') {
    errorState.value.kondisi = 'Nama Kondisi wajib diisi.'
    toast.error('Mohon periksa kembali input Anda!')
    return false
  }
  return true
}

export function useKondisiActions(allData, renderFeatherIcons, initTooltips) {
  const isSubmitting = ref(false)
  const isLoading = ref(true)

  const form = ref({ kondisi: '' })
  const editForm = ref({ id: null, kondisi: '' })
  const errors = ref({})
  const editErrors = ref({})

  // Helper untuk reset form Tambah dan sembunyikan modal
  const resetForm = () => {
    form.value = { kondisi: '' }
    errors.value = {}
    const modalElement = document.getElementById('tambahKondisiModal')
    const modal = Modal.getInstance(modalElement)
    if (modal) {
      modal.hide()
    }
  }

  // Helper untuk reset form Edit (saat modal edit ditutup)
  const resetEditForm = () => {
    editForm.value = { id: null, kondisi: '' }
    editErrors.value = {}
  }

  // FUNGSI UTAMA: Ambil Data dari API
  const fetchDataFromApi = async () => {
    // Terapkan instruksi kustom: Jangan tampilkan "Tidak ada data."
    if (allData.value.length === 0) {
      isLoading.value = true
    }

    try {
      // Asumsi API mengembalikan response.data.Data (sesuai service)
      const responseData = await kondisiService.getKondisi()

      allData.value = responseData.map((item) => ({
        ...item,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))

      // Pastikan data yang dimuat menyebabkan re-render icon/tooltip
      renderFeatherIcons()
      initTooltips()
    } catch (error) {
      toast.error('Gagal memuat data kondisi.')
      // Set data kosong agar tabel menampilkan pesan error data
      allData.value = []
    } finally {
      isLoading.value = false
    }
  }

  // FUNGSI: Handler Submit Tambah
  const handleStoreKondisi = async () => {
    if (!validateForm(form.value, errors)) return

    isSubmitting.value = true
    try {
      const response = await kondisiService.storeKondisi(form.value)
      toast.success(response.message)
      resetForm()
      await fetchDataFromApi()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data kondisi.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI: Setup Form Edit
  const setCurrentEditItem = (item) => {
    resetEditForm() // Reset error saat item baru di set

    editForm.value.id = item.id
    editForm.value.kondisi = item.kondisi
  }

  // FUNGSI: Handler Submit Edit
  const handleEditKondisi = async () => {
    if (!validateForm(editForm.value, editErrors)) return

    isSubmitting.value = true
    try {
      const payload = { kondisi: editForm.value.kondisi }
      const response = await kondisiService.updateKondisi(editForm.value.id, payload)
      toast.success(response.message || 'Data kondisi berhasil diperbarui.')
      // Sembunyikan modal Edit
      const modalElement = document.getElementById('editKondisiModal')
      const modal = Modal.getInstance(modalElement)
      if (modal) modal.hide()

      await fetchDataFromApi()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui data kondisi.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI: Handler Delete (Menyesuaikan dengan service POST dengan payload ID)
  const handleDeleteKondisi = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: 'Anda tidak akan bisa mengembalikannya!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        // KIRIM ID SEBAGAI PAYLOAD OBJEK
        const payload = { id: id }
        const response = await kondisiService.deleteKondisi(payload)
        toast.success(response.message || 'Data kondisi berhasil dihapus.')
        await fetchDataFromApi()
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan saat menghapus data.'
        toast.error(errorMessage)
      }
    }
  }

  return {
    isLoading,
    isSubmitting,
    form,
    editForm,
    errors,
    editErrors,
    fetchDataFromApi,
    handleStoreKondisi,
    setCurrentEditItem,
    handleEditKondisi,
    handleDeleteKondisi,
    resetForm,
    resetEditForm,
  }
}
