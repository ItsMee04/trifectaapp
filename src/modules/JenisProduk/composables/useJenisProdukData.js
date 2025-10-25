import { ref, computed } from 'vue'

export function useJenisProdukData(allData) {
  const search = ref('')
  const currentPage = ref(1)
  const perPage = ref(10)

  const filteredData = computed(() => {
    if (!search.value) {
      return allData.value
    }
    const searchTerm = search.value.toLowerCase()
    return allData.value.filter((item) => {
      return item.nama_jenis_produk.toLowerCase().includes(searchTerm)
    })
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / perPage.value)
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return filteredData.value.slice(start, end)
  })

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const previousPage = () => {
    setPage(currentPage.value - 1)
  }

  const nextPage = () => {
    setPage(currentPage.value + 1)
  }

  return {
    search,
    currentPage,
    perPage,
    filteredData,
    totalPages,
    paginatedData,
    setPage,
    previousPage,
    nextPage,
  }
}
