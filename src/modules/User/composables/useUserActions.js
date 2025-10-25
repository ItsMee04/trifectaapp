// modules/User/composables/useUserActions.js

import { ref } from 'vue'
import { userService } from '../services/userService'
import { roleService } from '@/modules/Role/services/roleService'
import { useToast } from '@/composables/useToast' // Asumsi ini adalah useToast yang sama
import { Modal } from 'bootstrap'

const toast = useToast()

const validateEditForm = (formData, errorState) => {
  errorState.value = {}
  let isValid = true

  if (!formData.email.trim()) {
    errorState.value.email = 'Email wajib diisi.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errorState.value.email = 'Format email tidak valid.'
    isValid = false
  }

  // Password hanya di-validate jika ada isinya
  if (formData.password.trim() && formData.password.trim().length < 6) {
    errorState.value.password = 'Password minimal 6 karakter.'
    isValid = false
  }
  // CATATAN: Karena ini modal EDIT, kita tidak wajibkan password diisi kecuali jika API memerlukan.
  // Kode asli mewajibkan password:
  if (!formData.password.trim()) {
    errorState.value.password = 'Password wajib diisi.'
    isValid = false
  }

  if (!formData.role) {
    errorState.value.role = 'Role wajib dipilih.'
    isValid = false
  }

  if (!isValid) {
    toast.error('Mohon periksa kembali input Anda!')
  }

  return isValid
}

export function useUserActions(allData, roleList, renderFeatherIcons, initTooltips) {
  const isSubmitting = ref(false)
  const showPassword = ref(false) // Untuk toggle password
  const isLoading = ref(false)

  const editForm = ref({
    id: null,
    pegawai: '',
    email: '',
    password: '',
    role: null,
  })

  const editErrors = ref({})

  // Helper untuk menutup Modal
  const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    const modalInstance = Modal.getInstance(modalElement)
    if (modalInstance) {
      modalInstance.hide()
    }
  }

  // FUNGSI MENGAMBIL DATA UTAMA
  const fetchUsersData = async () => {
    isLoading.value = true
    try {
      const responseData = await userService.getUsers()
      allData.value = responseData.map((user) => ({
        ...user,
        // Tambahkan field untuk tampilan
        role_label: user.role ? user.role.role : 'Role belum dipilih',
        role_class: user.role
          ? user.role.id === 1
            ? 'bg-soft-primary'
            : 'bg-soft-secondary'
          : 'bg-soft-danger',
        email_label: user.email ? user.email : 'Belum Ada Email',
        email_class: user.email ? 'bg-soft-secondary' : 'bg-soft-danger',
        status_label: user.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: user.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))
      renderFeatherIcons()
      initTooltips()
    } catch (error) {
      toast.error('Gagal memuat data pengguna.')
    } finally {
      isLoading.value = false
    }
  }

  // FUNGSI MENGAMBIL DAFTAR ROLE (untuk dropdown)
  const fetchRolesList = async () => {
    try {
      const response = await roleService.getRole()
      roleList.value = response
    } catch (error) {
      toast.error('Gagal memuat daftar role.')
    }
  }

  // FUNGSI MENYIAPKAN DATA EDIT
  const setCurrentEditItem = (userItem) => {
    editForm.value.id = userItem.id
    editForm.value.pegawai = userItem.pegawai ? userItem.pegawai.nama : 'N/A'
    editForm.value.email = userItem.email || ''
    editForm.value.password = '' // Selalu kosongkan password saat membuka modal
    // Temukan objek role yang cocok dari roleList
    editForm.value.role = roleList.value.find((role) => role.id === userItem.role_id) || null
    editErrors.value = {} // Reset error
    showPassword.value = false
    // Panggil modal show di Parent
  }

  // FUNGSI HANDLER EDIT USER
  const handleEditUser = async (formData) => {
    if (!validateEditForm(formData, editErrors)) {
      return
    }

    const userData = {
      email: formData.email,
      // Hanya kirim password jika diisi, jika kosong hapus dari payload
      password: formData.password.trim() || undefined,
      role_id: formData.role ? formData.role.id : null, // Kirim role_id
    }

    // Hapus password jika tidak diisi agar tidak dianggap sebagai string kosong
    if (!userData.password) {
      delete userData.password
    }

    isSubmitting.value = true
    try {
      const response = await userService.updateUsers(formData.id, userData)
      toast.success(response.message || 'Data pengguna berhasil diperbarui!')
      hideModal('editUserModal')
      await fetchUsersData()
    } catch (error) {
      const apiErrors = error.response?.data?.errors
      if (apiErrors) {
        editErrors.value = apiErrors
        toast.error('Gagal memperbarui data. Mohon periksa kembali formulir.')
      } else {
        toast.error(
          error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data pengguna.',
        )
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // FUNGSI RESET FORM (untuk event hidden.bs.modal)
  const resetForm = () => {
    editForm.value = { id: null, pegawai: '', email: '', password: '', role: null }
    editErrors.value = {}
    showPassword.value = false
  }

  return {
    editForm,
    editErrors,
    isSubmitting,
    showPassword,
    isLoading,
    fetchUsersData,
    fetchRolesList,
    setCurrentEditItem,
    handleEditUser,
    resetForm,
    togglePassword: () => (showPassword.value = !showPassword.value), // Expose toggle function
  }
}
