<template>
  <div>
    <div class="content container-fluid">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>HALAMAN DISKON</h4>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb breadcrumb-pipe">
                <li class="breadcrumb-item"><a href="#">Produk</a></li>
                <li class="breadcrumb-item active" aria-current="page">DISKON</li>
              </ol>
            </nav>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click="fetchDataFromApi">
              <i data-feather="rotate-ccw" class="feather-rotate-ccw"></i>
            </a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"
              @click="toggleHeaderCollapse" :class="{ 'active': isHeaderCollapsed }">
              <i data-feather="chevron-up" class="feather-chevron-up"></i>
            </a>
          </li>
        </ul>
        <div class="page-btn import">
          <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#tambahDiskonModal"
            @click="resetStoreForm">
            <i data-feather="plus-circle" class="me-2"></i>
            Tambah Diskon
          </a>
        </div>
      </div>

      <div class="row">
        <div class="card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              <div class="search-set">
                <div class="search-input">
                  <input type="text" class="form-control" placeholder="Search ..." v-model="searchQuery">
                </div>
              </div>
            </div>
          </div>

          <DiskonTable :paginatedData="paginatedData" :startIndex="startIndex" :isLoading="isLoading"
            :currentPage="currentPage" :totalPages="totalPages" :totalItemsAvailable="allData.length"
            @edit="openEditModal" @delete="handleDeleteDiskon" @prev-page="prevPage" @next-page="nextPage"
            @go-to-page="goToPage" />

        </div>
      </div>

    </div>

    <Teleport to="body">
      <DiskonModal modalId="tambahDiskonModal" modalTitle="TAMBAH DISKON" :diskon="form.diskon" :nilai="form.nilai"
        :errors="errors" :isSubmitting="isSubmitting" @update:diskon="form.diskon = $event"
        @update:nilai="form.nilai = $event" @submit="handleStoreDiskon" />
    </Teleport>

    <Teleport to="body">
      <DiskonModal modalId="editDiskonModal" modalTitle="EDIT DISKON" :diskon="editForm.diskon" :nilai="editForm.nilai"
        :errors="editErrors" :isSubmitting="isSubmitting" @update:diskon="editForm.diskon = $event"
        @update:nilai="editForm.nilai = $event" @submit="handleEditDiskon" />
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick } from 'vue';
import { Modal, Tooltip } from 'bootstrap'; // Pastikan Tooltip diimpor jika digunakan
import feather from 'feather-icons';

import DiskonTable from '@/modules/Diskon/components/DiskonTable.vue';
import DiskonModal from '@/modules/Diskon/components/DiskonModal.vue';
import { useDiskonData } from '@/modules/Diskon/composables/useDiskonData';
import { useDiskonActions } from '@/modules/Diskon/composables/useDiskonActions';

// ===================================
// FUNGSI UTILITAS LOKAL (SOLUSI ICON ERROR)
// ===================================
const renderFeatherIcons = () => {
  // Memastikan feather diimpor dan ada
  if (feather) {
    feather.replace();
  }
};

const initBootstrapTooltips = () => {
  // Menginisialisasi semua tooltip Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    // Pastikan Anda menggunakan Tooltip dari Bootstrap, bukan Modal
    return new Tooltip(tooltipTriggerEl);
  });
};

// ===================================
// COMPOSABLES
// ===================================
const dataState = useDiskonData();
const {
  // Fungsi ini tidak lagi diekspor dari useDiskonActions
  fetchDataFromApi,
  handleStoreDiskon,
  setCurrentEditItem,
  handleEditDiskon,
  handleDeleteDiskon,
  resetStoreForm,
  resetEditForm,
} = useDiskonActions(dataState); // useDiskonActions TIDAK LAGI menerima fungsi utilitas

const {
  paginatedData,
  startIndex,
  isLoading,
  isSubmitting,
  form,
  editForm,
  errors,
  editErrors,
  searchQuery,
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  goToPage,
  allData,
} = dataState;

// ===================================
// LOGIKA VIEW LAIN
// ===================================
const isHeaderCollapsed = ref(false);

const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
  // class 'header-collapse' dikelola oleh watcher di bawah
};

const openEditModal = (item) => {
  setCurrentEditItem(item);
  const modalElement = document.getElementById('editDiskonModal');
  // Cek instance modal, hindari pembuatan instance baru berulang
  let modalInstance = Modal.getInstance(modalElement);
  if (!modalInstance) {
    modalInstance = new Modal(modalElement);
  }
  modalInstance.show();

  // Render ikon di dalam modal setelah dibuka (jika ada)
  renderFeatherIcons();
};

// ===================================
// LIFECYCLE HOOKS & WATCHER (REVISI FINAL)
// ===================================
onMounted(() => {
  // 1. Panggil untuk ikon STATIS (Header, Tombol Tambah, dll.)
  nextTick(() => { // <-- PASTIKAN SEMUA ELEMEN STATIS DI-RENDER
    renderFeatherIcons();
    initBootstrapTooltips();
  });

  // 2. Mulai ambil data
  fetchDataFromApi();

  // ... Setup event listeners modal tetap sama ...
});

// Watcher ini mengatasi masalah ikon tabel:
// 1. Berjalan segera ({ immediate: true })
// 2. Berjalan setelah data dari API dimuat dan paginatedData berubah.
watch(paginatedData, () => {
  nextTick(() => { // <-- PASTIKAN ELEMEN DINAMIS DI-RENDER
    renderFeatherIcons();
    initBootstrapTooltips();
  });
}, { immediate: true });

watch(isHeaderCollapsed, (newValue) => {
  if (newValue) {
    document.body.classList.add('header-collapse');
  } else {
    document.body.classList.remove('header-collapse');
  }
});
</script>
