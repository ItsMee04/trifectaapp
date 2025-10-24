import { ref, computed, watch } from 'vue';

export function usePegawaiData(allData) {
  // STATE
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const searchQuery = ref('');

  // --- COMPUTED PROPERTIES ---

  // 1. Data yang sudah difilter/dicari
  const filteredData = computed(() => {
    if (!searchQuery.value) return allData.value;
    const query = searchQuery.value.toLowerCase();

    return allData.value.filter(item =>
      item.nama.toLowerCase().includes(query) ||
      item.nip.toLowerCase().includes(query) ||
      item.jabatan.jabatan.toLowerCase().includes(query) // Cari berdasarkan nama jabatan
    );
  });

  // 2. Total item setelah difilter
  const totalItems = computed(() => filteredData.value.length);

  // 3. Total halaman
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

  // 4. Index awal untuk slicing
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

  // 5. Index akhir untuk slicing
  const endIndex = computed(() => startIndex.value + itemsPerPage.value);

  // 6. Data yang sudah dipaginasi
  const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value));


  // --- METHODS ---

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const prevPage = () => goToPage(currentPage.value - 1);

  const nextPage = () => goToPage(currentPage.value + 1);


  // --- WATCHERS ---

  // Reset halaman ke-1 setiap kali query pencarian berubah
  watch(searchQuery, () => currentPage.value = 1);

  // Pastikan halaman tidak melebihi total halaman jika item berkurang
  watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      currentPage.value = newTotalPages;
    } else if (newTotalPages === 0) {
      currentPage.value = 1;
    }
  });


  return {
    currentPage,
    itemsPerPage,
    searchQuery,
    paginatedData,
    startIndex,
    totalPages,
    goToPage,
    prevPage,
    nextPage,
  };
}
