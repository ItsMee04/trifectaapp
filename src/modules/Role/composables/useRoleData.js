// modules/Role/composables/useRoleData.js

import { ref, computed, watch } from 'vue';

export function useRoleData(allData) {
  // STATE PAGINATION & SEARCH
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const searchQuery = ref('');

  // COMPUTED PROPERTIES
  // 1. Data yang sudah difilter berdasarkan pencarian
  const filteredData = computed(() => {
    if (!searchQuery.value) return allData.value;
    const query = searchQuery.value.toLowerCase();
    return allData.value.filter(item => item.role.toLowerCase().includes(query));
  });

  // 2. Total item setelah difilter
  const totalItems = computed(() => filteredData.value.length);

  // 3. Total halaman
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

  // 4. Index awal dan akhir
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
  const endIndex = computed(() => startIndex.value + itemsPerPage.value);

  // 5. Data untuk halaman saat ini
  const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value));

  // METODE NAVIGASI
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  const prevPage = () => goToPage(currentPage.value - 1);
  const nextPage = () => goToPage(currentPage.value + 1);

  // WATCHER: Reset halaman ke-1 saat query pencarian berubah
  watch(searchQuery, () => currentPage.value = 1);

  return {
    currentPage,
    searchQuery,
    paginatedData,
    startIndex,
    totalPages,
    goToPage,
    prevPage,
    nextPage,
    totalItems,
  };
}
