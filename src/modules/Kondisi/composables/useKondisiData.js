// modules/Kondisi/composables/useKondisiData.js
import { ref, computed, watch } from 'vue'

export function useKondisiData(allData) {
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const searchQuery = ref('')

  // Computed Property untuk memfilter data
  const filteredData = computed(() => {
    if (!searchQuery.value) return allData.value
    const query = searchQuery.value.toLowerCase()
    return allData.value.filter((item) => item.kondisi.toLowerCase().includes(query))
  })

  // Computed Property untuk Pagination
  const totalItems = computed(() => filteredData.value.length)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
  const endIndex = computed(() => startIndex.value + itemsPerPage.value)
  const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

  // Metode Navigasi
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  const prevPage = () => goToPage(currentPage.value - 1)
  const nextPage = () => goToPage(currentPage.value + 1)

  // Watcher: Reset halaman ke-1 saat search query berubah
  watch(searchQuery, () => (currentPage.value = 1))

  // Watcher: Reset halaman ke-1 jika halaman saat ini melebihi total halaman (misal setelah delete)
  watch(totalPages, (newVal) => {
    if (currentPage.value > newVal) {
      currentPage.value = 1
    }
  })

  return {
    currentPage,
    searchQuery,
    paginatedData,
    startIndex,
    totalPages,
    totalItems, // Dikirim ke View/Component untuk totalItemsAvailable
    goToPage,
    prevPage,
    nextPage,
  }
}
