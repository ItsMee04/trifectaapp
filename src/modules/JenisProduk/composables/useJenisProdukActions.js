// modules/JenisProduk/composables/useJenisProdukActions.js
import { ref } from 'vue'
import { jenisService } from '../services/jenisService'
import { useToast } from '@/composables/useToast'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'
import { STORAGE_BASE_URL } from '@/composables/useBase'

const toast = useToast()

const validateForm = (form, errors) => {
  errors.value = {}
  if (!form.jenis?.trim()) {
    errors.value.jenis = 'Jenis produk wajib diisi.'
    toast.error('Mohon periksa kembali input Anda!')
    return false
  }
  return true
}

export function useJenisProdukActions(allData, renderFeatherIcons, initTooltips) {
  const isLoading = ref(true)
  const isSubmitting = ref(false)

  const form = ref({ jenis: '', image_jenis_produk: null })
  const editForm = ref({ id: null, jenis: '', image_jenis_produk: null, new_image_file: null })
  const errors = ref({})
  const editErrors = ref({})

  const imagePreviewUrl = ref(null)
  const editImageUrl = ref(null)

  const resetForm = () => {
    form.value = { jenis: '', image_jenis_produk: null }
    errors.value = {}
    imagePreviewUrl.value = null
    const modal = Modal.getInstance(document.getElementById('tambahJenisModal'))
    if (modal) modal.hide()
  }

  const resetEditForm = () => {
    editForm.value = { id: null, jenis: '', image_jenis_produk: null, new_image_file: null }
    editErrors.value = {}
    editImageUrl.value = null
  }

  const fetchDataFromApi = async () => {
    if (allData.value.length === 0) {
      isLoading.value = true
    }
    try {
      const data = await jenisService.getJenis()
      allData.value = data.map(item => ({
        ...item,
        image: item.image_jenis_produk
          ? `${STORAGE_BASE_URL}/icon/${item.image_jenis_produk}?t=${Date.now()}`
          : '/src/assets/img/noimage.jpg',
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))
      renderFeatherIcons()
      initTooltips()
    } catch (err) {
      toast.error('Gagal memuat data jenis produk.')
      allData.value = []
    } finally {
      isLoading.value = false
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.value.image_jenis_produk = file
      imagePreviewUrl.value = URL.createObjectURL(file)
    }
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      editForm.value.new_image_file = file
      editImageUrl.value = URL.createObjectURL(file)
    }
  }

  const handleStoreJenis = async () => {
    if (!validateForm(form.value, errors)) return
    isSubmitting.value = true
    try {
      const payload = new FormData()
      payload.append('jenisproduk', form.value.jenis)
      if (form.value.image_jenis_produk) payload.append('imagejenisproduk', form.value.image_jenis_produk)

      await jenisService.storeJenis(payload)
      toast.success('Jenis produk berhasil ditambahkan.')
      resetForm()
      await fetchDataFromApi()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan jenis produk.')
    } finally {
      isSubmitting.value = false
    }
  }

  const setCurrentEditItem = (item) => {
    resetEditForm()
    editForm.value.id = item.id
    editForm.value.jenis = item.jenis_produk
    editForm.value.image_jenis_produk = item.image_jenis_produk
    editImageUrl.value = item.image
  }

  const handleUpdateJenis = async () => {
    if (!validateForm(editForm.value, editErrors)) return
    isSubmitting.value = true
    try {
      const payload = new FormData()
      payload.append('_method', 'PUT')
      payload.append('jenisproduk', editForm.value.jenis)
      if (editForm.value.new_image_file) payload.append('imagejenisproduk', editForm.value.new_image_file)

      await jenisService.updateJenis(editForm.value.id, payload)
      toast.success('Jenis produk berhasil diperbarui.')
      const modal = Modal.getInstance(document.getElementById('editJenisModal'))
      if (modal) modal.hide()
      await fetchDataFromApi()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui jenis produk.')
    } finally {
      isSubmitting.value = false
    }
  }

  const handleDeleteJenis = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })
    if (result.isConfirmed) {
      try {
        const payload = { id: id }
        await jenisService.deleteJenis(payload)
        toast.success('Jenis produk berhasil dihapus.')
        await fetchDataFromApi()
      } catch {
        toast.error('Gagal menghapus jenis produk.')
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
    imagePreviewUrl,
    editImageUrl,
    fetchDataFromApi,
    handleImageChange,
    handleEditImageChange,
    handleStoreJenis,
    setCurrentEditItem,
    handleUpdateJenis,
    handleDeleteJenis,
    resetForm,
    resetEditForm,
  }
}
