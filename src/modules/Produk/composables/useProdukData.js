// modules/Produk/composables/useProdukData.js
import { ref, computed, watch } from 'vue'

export function useProdukData(allData) {
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const searchQuery = ref('')

  const filteredData = computed(() => {
    if (!searchQuery.value) return allData.value
    const query = searchQuery.value.toLowerCase()
    return allData.value.filter(item => item.nama.toLowerCase().includes(query))
  })

  const totalItems = computed(() => filteredData.value.length)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
  const paginatedData = computed(() => filteredData.value.slice(startIndex.value, startIndex.value + itemsPerPage.value))

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
  }
  const prevPage = () => goToPage(currentPage.value - 1)
  const nextPage = () => goToPage(currentPage.value + 1)

  watch(searchQuery, () => currentPage.value = 1)
  watch(totalPages, (newVal) => {
    if (currentPage.value > newVal) currentPage.value = 1
  })

  return {
    currentPage,
    searchQuery,
    paginatedData,
    startIndex,
    totalPages,
    totalItems,
    goToPage,
    prevPage,
    nextPage,
  }
}
