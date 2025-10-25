import { ref, onMounted, nextTick } from 'vue'
import { jenisService } from '@/services/produk/jenisService'
import { useToast } from '@/composables/useToast'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import { initTooltips } from '@/utilities/tooltip'
import feather from 'feather-icons'

// URL Dasar untuk gambar icon (Utilitas Pemformatan)
import { STORAGE_BASE_URL } from '@/composables/useBase'

/**
 * Memformat data mentah dari API agar siap ditampilkan di tabel.
 */
const getFormattedData = (data) => {
  return data.map((item) => ({
    ...item,
    // Tambahkan timestamp untuk mencegah caching pada gambar
    image: item.image_jenis_produk
      ? `${STORAGE_BASE_URL}/icon/${item.image_jenis_produk}?t=${new Date().getTime()}`
      : '/src/assets/img/noimage.jpg',
    status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
    status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
  }))
}

export function useJenisProdukActions(allData, isLoading) {
  const isSubmitting = ref(false)
  const modalTitle = ref('')
  const formMethod = ref('store')
  const toast = useToast()
  let modalInstance = null

  const form = ref({
    id: null,
    nama_jenis_produk: '',
    image_jenis_produk: null,
    status: 1,
    image_url: null,
  })

  onMounted(() => {
    const modalElement = document.getElementById('jenisProdukModal')
    if (modalElement) {
      modalInstance = new Modal(modalElement)
    }
  })

  // --- Fetch Data ---
  const fetchDataFromApi = async () => {
    // Tampilkan "Memuat data..." jika data kosong atau saat memulai
    if (allData.value.length === 0) {
      isLoading.value = true
    }

    try {
      const rawData = await jenisService.getJenis()
      allData.value = getFormattedData(rawData)

      await nextTick(() => {
        feather.replace()
        initTooltips()
      })
    } catch (error) {
      console.error('Gagal memuat data Jenis Produk:', error)
      toast.error('Gagal memuat data Jenis Produk.')
      allData.value = []
    } finally {
      isLoading.value = false
    }
  }

  // --- Actions Modal & Form ---
  const resetForm = () => {
    form.value = {
      id: null,
      nama_jenis_produk: '',
      image_jenis_produk: null,
      status: 1,
      image_url: null,
    }
  }

  const handleOpenModal = (method, data = null) => {
    resetForm()
    formMethod.value = method
    modalTitle.value = method === 'store' ? 'Tambah Jenis Produk Baru' : 'Edit Jenis Produk'

    if (method === 'update' && data) {
      form.value.id = data.id
      form.value.nama_jenis_produk = data.nama_jenis_produk
      form.value.status = data.status
      form.value.image_url = data.image
    }

    modalInstance?.show()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      form.value.image_jenis_produk = file
      form.value.image_url = URL.createObjectURL(file)
    } else {
      form.value.image_jenis_produk = null
    }
  }

  const handleSubmit = async (event) => {
    if (isSubmitting.value) return

    isSubmitting.value = true

    try {
      const formData = new FormData(event.target)
      if (formMethod.value === 'store') {
        formData.delete('id')
      }

      let response
      if (formMethod.value === 'store') {
        response = await jenisService.storeJenis(formData)
      } else {
        response = await jenisService.updateJenis(form.value.id, formData)
      }

      if (response.StatusCode === 200) {
        toast.success(response.Message || 'Data berhasil disimpan!')
        modalInstance?.hide()
        resetForm()
        await fetchDataFromApi()
      } else {
        toast.error(response.Message || 'Gagal menyimpan data jenis.')
      }
    } catch (error) {
      const message = error.response?.data?.Message || 'Terjadi kesalahan pada server.'
      toast.error(message)
    } finally {
      isSubmitting.value = false
    }
  }

  const handleDeleteJenis = (id) => {
    Swal.fire({
      title: 'Yakin?',
      text: 'Anda tidak akan dapat mengembalikan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = { id: id }
          const response = await jenisService.deleteJenis(payload)
          toast.success(response.Message || 'Data berhasil dihapus!')
          await fetchDataFromApi()
        } catch (error) {
          const message =
            error.response?.data?.Message || 'Terjadi kesalahan saat menghapus data jenis.'
          toast.error(message)
        }
      }
    })
  }

  return {
    form,
    isSubmitting,
    modalTitle,
    formMethod,
    fetchDataFromApi,
    handleOpenModal,
    handleFileChange,
    handleSubmit,
    handleDeleteJenis,
  }
}
