// modules/Diskon/composables/useDiskonActions.js
import { useToast } from '@/composables/useToast'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import { diskonService } from '../services/diskonService' // Import service

// FUNGSI UTILITY EKSTERNAL (Sesuai kebutuhan di View)
const toast = useToast()

// Fungsi Validasi
const validateForm = (formData, errorState) => {
  errorState.value = {} // Reset error
  let isValid = true

  if (!formData.diskon || formData.diskon.trim() === '') {
    errorState.value.diskon = 'Nama Diskon wajib diisi.'
    isValid = false
  }
  // Validasi Nilai (pastikan diisi dan berupa angka/dapat dikonversi)
  if (!formData.nilai || isNaN(Number(formData.nilai))) {
    errorState.value.nilai = 'Nilai Diskon wajib diisi dan harus berupa angka.'
    isValid = false
  }

  if (!isValid) {
    toast.error('Mohon periksa kembali input Anda!')
  }
  return isValid
}

export function useDiskonActions(dataState) {
  const { allData, form, editForm, errors, editErrors, isSubmitting, isLoading } = dataState

  // Helper untuk reset form Tambah dan sembunyikan modal
  const resetStoreForm = () => {
    form.value = { diskon: '', nilai: '' }
    errors.value = {}
    const modalElement = document.getElementById('tambahDiskonModal')
    const modal = Modal.getInstance(modalElement)
    if (modal) modal.hide()
  }

  // Helper untuk reset form Edit (dipanggil saat modal edit dibuka/ditutup)
  const resetEditForm = () => {
    editForm.value = { id: null, diskon: '', nilai: '' }
    editErrors.value = {}
  }

  // FUNGSI UTAMA: Ambil Data dari API
  const fetchDataFromApi = async () => {
    if (allData.value.length === 0) {
      isLoading.value = true
    }
    try {
      const responseData = await diskonService.getDiskon()
      allData.value = responseData.map((item) => ({
        ...item,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))
    } catch (error) {
      toast.error('Gagal memuat data diskon.')
      allData.value = []
    } finally {
      isLoading.value = false
    }
  }

  // FUNGSI: Handler Submit Tambah
  const handleStoreDiskon = async () => {
    if (!validateForm(form.value, errors)) return

    isSubmitting.value = true
    try {
      const response = await diskonService.storeDiskon(form.value)
      toast.success(response.message)
      resetStoreForm()
      await fetchDataFromApi()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data diskon.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI: Setup Form Edit
  const setCurrentEditItem = (item) => {
    resetEditForm() // Bersihkan error dari aksi sebelumnya
    editForm.value.id = item.id
    editForm.value.diskon = item.diskon
    editForm.value.nilai = item.nilai
  }

  // FUNGSI: Handler Submit Edit
  const handleEditDiskon = async () => {
    if (!validateForm(editForm.value, editErrors)) return

    isSubmitting.value = true
    try {
      const payload = { diskon: editForm.value.diskon, nilai: editForm.value.nilai }
      const response = await diskonService.updateDiskon(editForm.value.id, payload)
      toast.success(response.message)
      const modalElement = document.getElementById('editDiskonModal')
      const modal = Modal.getInstance(modalElement)
      if (modal) modal.hide()

      await fetchDataFromApi()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui data diskon.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI: Handler Delete
  const handleDeleteDiskon = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: 'Anda tidak akan bisa mengembalikannya!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })
    const payload = { id: id }
    if (result.isConfirmed) {
      try {
        const response = await diskonService.deleteDiskon(payload)
        toast.success(response.message || 'Data diskon berhasil dihapus.')
        await fetchDataFromApi()
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan saat menghapus data.'
        toast.error(errorMessage)
      }
    }
  }

  return {
    fetchDataFromApi,
    handleStoreDiskon,
    setCurrentEditItem,
    handleEditDiskon,
    handleDeleteDiskon,
    resetStoreForm,
    resetEditForm,
  }
}
