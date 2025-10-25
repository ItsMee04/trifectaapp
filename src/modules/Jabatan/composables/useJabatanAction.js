// src/composables/usermanagement/useJabatanActions.js

import { ref } from 'vue'
import { jabatanService } from '@/modules/Jabatan/services/jabatanService'
import { useToast } from '@/composables/useToast'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

// Inisialisasi toast di luar (seperti kode asli Anda)
const toast = useToast()

// Fungsi VALIDASI yang digeneralisasi
const validateForm = (formData, errorState) => {
  errorState.value = {}
  if (!formData.jabatan || formData.jabatan.trim() === '') {
    errorState.value.jabatan = 'Nama Jabatan tidak boleh kosong.'
  }
  return Object.keys(errorState.value).length === 0
}

export function useJabatanActions(allData, renderFeatherIcons, initTooltips) {
  const isSubmitting = ref(false)
  const isLoading = ref(true)
  // TAMBAHKAN STATE PENTING INI UNTUK MODULARITAS
  const isEditMode = ref(false)

  const form = ref({ jabatan: '' })
  const errors = ref({})
  const editForm = ref({ id: null, jabatan: '' })
  const editErrors = ref({})

  // Helper untuk menutup Modal (kita gabung di sini)
  const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    const modalInstance = Modal.getInstance(modalElement)
    if (modalInstance) {
      modalInstance.hide()
    }
  }

  // FUNGSI UTAMA UNTUK MENGAMBIL DATA
  const fetchDataFromApi = async () => {
    isLoading.value = true
    try {
      const responseData = await jabatanService.getJabatan()
      allData.value = responseData.map((item) => ({
        ...item,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))
      renderFeatherIcons()
      initTooltips()
    } catch (error) {
      toast.error('Gagal memuat data jabatan.')
    } finally {
      isLoading.value = false
    }
  }

  // FUNGSI UNTUK MENAMBAH JABATAN
  const handleStoreJabatan = async (formData) => {
    // Menerima formData dari Parent/Modal
    if (!validateForm(formData, errors)) {
      toast.error('Ada kesalahan pada form. Silakan periksa kembali.') // <-- Perbaikan di sini
      return
    }

    isSubmitting.value = true
    try {
      const response = await jabatanService.storeJabatan({ jabatan: formData.jabatan })
      if (response.success) {
        toast.success(response.message)
        hideModal('jabatanModal') // Asumsi ID modal yang digabung adalah 'jabatanModal'
        await fetchDataFromApi()
      } else {
        toast.error(response.message || 'Gagal menyimpan data.')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI UNTUK RESET FORM
  // Fungsi ini hanya mereset state di composable, penutupan modal dilakukan di parent/saat event 'hidden.bs.modal'
  const resetForm = () => {
    form.value.jabatan = ''
    errors.value = {}
    editForm.value = { id: null, jabatan: '' }
    editErrors.value = {}
    isEditMode.value = false
  }

  // FUNGSI UNTUK MENYIAPKAN DATA EDIT
  const setCurrentEditItem = (item) => {
    isEditMode.value = true // <-- Set mode ke Edit
    editForm.value.id = item.id
    editForm.value.jabatan = item.jabatan
    editErrors.value = {}
    // Tidak perlu menampilkan modal di sini. Parent yang akan melakukannya.
  }

  // FUNGSI UNTUK MENGEDIT JABATAN
  const handleEditJabatan = async (formData) => {
    // Menerima formData dari Parent/Modal
    if (!validateForm(formData, editErrors)) {
      toast.error('Ada kesalahan pada form. Silakan periksa kembali.')
      return
    }

    isSubmitting.value = true
    try {
      const response = await jabatanService.updateJabatan(formData.id, {
        jabatan: formData.jabatan,
      })

      if (response.success) {
        toast.success(response.message)
        hideModal('jabatanModal') // Asumsi ID modal yang digabung adalah 'jabatanModal'
        await fetchDataFromApi()
      } else {
        toast.error(response.message || 'Gagal memperbarui data.')
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.'
      toast.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI UNTUK MENGHAPUS JABATAN (Tidak ada perubahan)
  const handleDeleteJabatan = async (item) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: 'Anda tidak akan bisa mengembalikannya!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })
    const payload = { id: item.id }
    if (result.isConfirmed) {
      try {
        const response = await jabatanService.deleteJabatan(payload)
        if (response.success) {
          toast.success(response.message)
          await fetchDataFromApi()
        } else {
          toast.error(response.message || 'Gagal menghapus data.')
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan saat menghubungi server.'
        toast.error(errorMessage)
      }
    }
  }

  return {
    form,
    errors,
    editForm,
    editErrors,
    isSubmitting,
    isEditMode, // <-- VARIABEL PENTING SUDAH DIKEMBALIKAN
    isLoading,
    setCurrentEditItem, // <-- Ganti openEditModal dengan setCurrentEditItem
    fetchDataFromApi,
    handleStoreJabatan,
    handleEditJabatan,
    handleDeleteJabatan,
    resetForm,
  }
}
