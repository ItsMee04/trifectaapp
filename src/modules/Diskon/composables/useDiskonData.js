// modules/Diskon/composables/useDiskonData.js
import { ref, computed, watch } from 'vue'

export function useDiskonData() {
  const allData = ref([])
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const searchQuery = ref('')
  const isLoading = ref(true) // Tambahkan state loading

  // State untuk Modal/Form
  const form = ref({ diskon: '', nilai: '' })
  const editForm = ref({ id: null, diskon: '', nilai: '' })
  const errors = ref({})
  const editErrors = ref({})
  const isSubmitting = ref(false) // Tambahkan state submitting

  // ----------------------
  // Computed Properties
  // ----------------------
  const filteredData = computed(() => {
    if (isLoading.value) return []
    if (!searchQuery.value) return allData.value

    const query = searchQuery.value.toLowerCase()

    return allData.value.filter((item) => {
      // Gabungkan Diskon (string) dan Nilai (dikonversi ke string) untuk difilter
      const diskonMatch = item.diskon.toLowerCase().includes(query)

      // Konversi item.nilai ke string agar bisa dicari
      const nilaiMatch = item.nilai.toString().includes(query)

      // Item akan ditampilkan jika diskon ATAU nilai cocok dengan kueri
      return diskonMatch || nilaiMatch
    })
  })

  const totalItems = computed(() => filteredData.value.length)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
  const endIndex = computed(() => startIndex.value + itemsPerPage.value)
  const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

  // ----------------------
  // Metode Navigasi
  // ----------------------
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  const prevPage = () => goToPage(currentPage.value - 1)
  const nextPage = () => goToPage(currentPage.value + 1)

  // ----------------------
  // Watcher
  // ----------------------
  watch(searchQuery, () => (currentPage.value = 1))

  return {
    allData,
    currentPage,
    itemsPerPage,
    searchQuery,
    isLoading,
    isSubmitting,
    form,
    editForm,
    errors,
    editErrors,
    filteredData,
    totalItems,
    totalPages,
    startIndex,
    paginatedData,
    goToPage,
    prevPage,
    nextPage,
  }
}
