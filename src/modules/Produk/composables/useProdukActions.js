// modules/Produk/composables/useProdukActions.js
import { ref } from 'vue'
import { produkService } from '../services/produkService'
import { jenisService } from '@/modules/JenisProduk/services/jenisService'
import { kondisiService } from '@/modules/Kondisi/services/kondisiService'
import { useToast } from '@/composables/useToast'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'

import { STORAGE_BASE_URL } from '@/composables/useBase'

const toast = useToast()

const validateForm = (formData, errorState) => {
  errorState.value = {}
  if (!formData.nama?.trim()) {
    errorState.value.nama = 'Nama wajib diisi.'
    toast.error('Mohon periksa kembali input Anda!')
    return false
  }
  if (!formData.kondisi) {
    errorState.value.kondisi = 'Kondisi wajib diisi.'
    toast.error('Mohon periksa kembali input Anda!')
    return false
  }
  if (!formData.jenis) {
    errorState.value.jenis = 'Jenis wajib diisi.'
    toast.error('Mohon periksa kembali input Anda!')
    return false
  }
  return true
}

export function useProdukActions(allData, renderFeatherIcons, initTooltips) {
  const isLoading = ref(true)
  const isSubmitting = ref(false)

  const form = ref({
    nama: '',
    kondisi: null,
    jenis: null,
    berat: '',
    karat: '',
    lingkar: '',
    panjang: '',
    hargajual: '',
    hargabeli: '',
    keterangan: '',
    image_produk: null,
  })

  const editForm = ref({
    id: null,
    nama: '',
    kondisi: null,
    kondisi_label: '',
    jenis: null,
    jenis_label: '',
    berat: '',
    karat: '',
    lingkar: '',
    panjang: '',
    hargajual: '',
    hargabeli: '',
    keterangan: '',
    existing_image_url: null,
    new_image_file: null,
  })

  const errors = ref({})
  const editErrors = ref({})
  const imagePreviewUrl = ref(null)
  const newImagePreviewUrl = ref(null)

  const jenisList = ref([])
  const kondisiList = ref([])

  const resetForm = () => {
    form.value = {
      nama: '',
      kondisi: null,
      jenis: null,
      berat: '',
      karat: '',
      lingkar: '',
      panjang: '',
      hargajual: '',
      hargabeli: '',
      keterangan: '',
      image_produk: null,
    }
    errors.value = {}
    imagePreviewUrl.value = null
    const modal = Modal.getInstance(document.getElementById('tambahProdukModal'))
    if (modal) modal.hide()
  }

  const resetEditForm = () => {
    editForm.value = {
      id: null,
      nama: '',
      kondisi: null,
      jenis: null,
      berat: '',
      karat: '',
      lingkar: '',
      panjang: '',
      hargajual: '',
      hargabeli: '',
      keterangan: '',
      existing_image_url: null,
      new_image_file: null,
    }
    editErrors.value = {}
    newImagePreviewUrl.value = null
  }

  const fetchDataFromApi = async () => {
    if (allData.value.length === 0) {
      isLoading.value = true
    }
    try {
      const data = await produkService.getProduk()
      allData.value = data.map(item => ({
        ...item,
        image: item.image_produk
          ? `${STORAGE_BASE_URL}/produk/${item.image_produk}?t=${Date.now()}`
          : '/src/assets/img/noimage.jpg',
        barcode_exists: !!item.kodeproduk,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger',
      }))
      renderFeatherIcons()
      initTooltips()
    } catch (err) {
      toast.error('Gagal memuat data produk.')
      allData.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchJenisList = async () => {
    try {
      jenisList.value = await jenisService.getJenis()
    } catch {
      toast.error('Gagal memuat data jenis.')
    }
  }

  const fetchKondisiList = async () => {
    try {
      kondisiList.value = await kondisiService.getKondisi()
    } catch {
      toast.error('Gagal memuat data kondisi.')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.value.image_produk = file
      imagePreviewUrl.value = URL.createObjectURL(file)
    }
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      editForm.value.new_image_file = file
      newImagePreviewUrl.value = URL.createObjectURL(file)
    }
  }

  const handleStoreProduk = async () => {
    if (!validateForm(form.value, errors)) return
    isSubmitting.value = true

    const payload = new FormData()

    // Kirim field teks & objek
    payload.append('nama', form.value.nama)
    payload.append('kondisi', form.value.kondisi?.id ?? '')
    payload.append('jenis', form.value.jenis?.id ?? '')
    payload.append('berat', form.value.berat)
    payload.append('karat', form.value.karat)
    payload.append('lingkar', form.value.lingkar)
    payload.append('panjang', form.value.panjang)
    payload.append('hargajual', form.value.hargajual)
    payload.append('hargabeli', form.value.hargabeli)
    payload.append('keterangan', form.value.keterangan)

    // ⬇️ Kirim file secara eksplisit
    if (form.value.image_produk instanceof File) {
      payload.append('imageProduk', form.value.image_produk)
    }

    try {
      await produkService.storeProduk(payload)
      toast.success('Produk berhasil ditambahkan.')
      resetForm()
      await fetchDataFromApi()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk.')
    } finally {
      isSubmitting.value = false
    }
  }

  const setCurrentEditItem = (item) => {
    resetEditForm()
    editForm.value.id = item.id
    editForm.value.kodeproduk = item.kodeproduk
    editForm.value.nama = item.nama
    editForm.value.kondisi = kondisiList.value.find(c => c.id === item.kondisi_id)
    editForm.value.jenis = jenisList.value.find(c => c.id === item.jenisproduk_id)
    // untuk view modal (string label)
    editForm.value.jenis_label = item.jenisproduk.jenis_produk
    editForm.value.kondisi_label = item.kondisi.nama
    editForm.value.berat = item.berat
    editForm.value.karat = item.karat
    editForm.value.lingkar = item.lingkar
    editForm.value.panjang = item.panjang
    editForm.value.hargajual = item.harga_jual
    editForm.value.hargabeli = item.harga_beli
    editForm.value.keterangan = item.keterangan
    editForm.value.status = item.status
    editForm.value.existing_image_url = item.image_produk ? `${STORAGE_BASE_URL}/produk/${item.image_produk}?t=${Date.now()}` : '/src/assets/img/noimage.jpg'
  }

  const handleUpdateProduk = async () => {
    if (!validateForm(editForm.value, editErrors)) return
    isSubmitting.value = true

    const payload = new FormData()

    // Field teks & objek
    payload.append('nama', editForm.value.nama)
    payload.append('kondisi', editForm.value.kondisi?.id ?? '')
    payload.append('jenis', editForm.value.jenis?.id ?? '')
    payload.append('berat', editForm.value.berat)
    payload.append('karat', editForm.value.karat)
    payload.append('lingkar', editForm.value.lingkar)
    payload.append('panjang', editForm.value.panjang)
    payload.append('hargajual', editForm.value.hargajual)
    payload.append('hargabeli', editForm.value.hargabeli)
    payload.append('keterangan', editForm.value.keterangan)

    // ⬇️ File baru (opsional)
    if (editForm.value.new_image_file instanceof File) {
      payload.append('imageProduk', editForm.value.new_image_file)
    }

    // ⬇️ Method override untuk Laravel
    payload.append('_method', 'PUT')

    try {
      await produkService.updateProduk(editForm.value.id, payload)
      toast.success('Produk berhasil diperbarui.')
      const modal = Modal.getInstance(document.getElementById('editProdukModal'))
      if (modal) modal.hide()
      await fetchDataFromApi()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui produk.')
    } finally {
      isSubmitting.value = false
    }
  }

  const handleDeleteProduk = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })
    if (result.isConfirmed) {
      try {
        const payload = { id: id }
        await produkService.deleteProduk(payload)
        toast.success('Produk berhasil dihapus.')
        await fetchDataFromApi()
      } catch {
        toast.error('Gagal menghapus produk.')
      }
    }
  }

  const openViewModal = (item) => {
    setCurrentEditItem(item)
    const modal = new Modal(document.getElementById('viewProdukModal'))
    modal.show()
  }

  return {
    isLoading,
    isSubmitting,
    form,
    editForm,
    errors,
    editErrors,
    imagePreviewUrl,
    newImagePreviewUrl,
    jenisList,
    kondisiList,
    fetchDataFromApi,
    fetchJenisList,
    fetchKondisiList,
    handleImageChange,
    handleEditImageChange,
    handleStoreProduk,
    setCurrentEditItem,
    handleUpdateProduk,
    handleDeleteProduk,
    openViewModal,
    resetForm,
    resetEditForm,
  }
}
