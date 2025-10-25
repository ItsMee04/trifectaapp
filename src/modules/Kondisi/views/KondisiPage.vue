<template>
  <div>
    <div class="content container-fluid">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>HALAMAN KONDISI</h4>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb breadcrumb-pipe">
                <li class="breadcrumb-item"><a href="#">Produk</a></li>
                <li class="breadcrumb-item active" aria-current="page">Kondisi</li>
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
          <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#tambahKondisiModal"
            @click.prevent>
            <i data-feather="plus-circle" class="me-2"></i>
            Tambah Kondisi
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
          <div class="card-body">
            <KondisiTable :data="paginatedData" :startIndex="startIndex" :currentPage="currentPage"
              :totalPages="totalPages" :isLoading="isLoading" :totalItemsAvailable="totalItems" @edit="openEditModal"
              @delete="handleDeleteKondisi" @go-to-page="goToPage" @prev-page="prevPage" @next-page="nextPage" />
          </div>
        </div>
      </div>
    </div>

    <KondisiModal :initialForm="form" :initialErrors="errors" :editForm="editForm" :editErrors="editErrors"
      :isSubmitting="isSubmitting" @update:storeKondisi="value => form.kondisi = value"
      @update:editKondisi="value => editForm.kondisi = value" @submit-store="handleStoreKondisi"
      @submit-edit="handleEditKondisi" @reset-form="resetForm" @reset-edit-form="resetEditForm" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import feather from 'feather-icons';
import { initTooltips } from '@/composables/useTooltip'; // Asumsi composable Anda
import { Modal } from 'bootstrap';

// Import Components
import KondisiTable from '@/modules/Kondisi/components/KondisiTable.vue';
import KondisiModal from '@/modules/Kondisi/components/KondisiModal.vue';

// Import Composables
import { useKondisiData } from '@/modules/Kondisi/composables/useKondisiData';
import { useKondisiActions } from '@/modules/Kondisi/composables/useKondisiActions';

// ===================================
// STATE LOKAL & UTILITIES
// ===================================
const allData = ref([]); // State utama yang dibagikan ke Composables
const isHeaderCollapsed = ref(false);

const renderFeatherIcons = () => feather.replace();
const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
  document.body.classList.toggle('header-collapse', isHeaderCollapsed.value);
};

// ===================================
// HUBUNGKAN COMPOSABLES
// ===================================

// Composables: Data & Pagination
const {
  currentPage,
  searchQuery,
  paginatedData,
  startIndex,
  totalPages,
  totalItems, // Digunakan untuk totalItemsAvailable
  goToPage,
  prevPage,
  nextPage,
} = useKondisiData(allData);

// Composables: CRUD & Actions
const {
  isLoading,
  isSubmitting,
  form,
  editForm,
  errors,
  editErrors,
  fetchDataFromApi,
  handleStoreKondisi,
  setCurrentEditItem,
  handleEditKondisi,
  handleDeleteKondisi,
  resetForm,
  resetEditForm,
} = useKondisiActions(allData, renderFeatherIcons, initTooltips);


// Logika Pembuka Modal Edit (Menampilkan modal secara manual setelah setting data)
const openEditModal = (item) => {
  setCurrentEditItem(item); // 1. Set data di composable

  const modalEl = document.getElementById('editKondisiModal'); // 2. Tampilkan modal
  if (modalEl) {
    let modalInstance = Modal.getInstance(modalEl);
    if (!modalInstance) {
      modalInstance = new Modal(modalEl);
    }
    modalInstance.show();
  } else {
    console.error('Kesalahan: Elemen modal (#editKondisiModal) tidak ditemukan.');
  }
  nextTick(renderFeatherIcons);
};


// ===================================
// LIFECYCLE HOOKS & WATCHER
// ===================================
onMounted(() => {
  fetchDataFromApi();
  renderFeatherIcons();
  initTooltips();

  // Pasang listener untuk mereset form edit saat modal ditutup
  const modalEditElement = document.getElementById('editKondisiModal');
  if (modalEditElement) {
    // Gunakan fungsi resetEditForm dari composable saat modal ditutup
    modalEditElement.addEventListener('hidden.bs.modal', resetEditForm);
  }
});

// Panggil render/init ulang saat data tabel berubah
watch(paginatedData, () => {
  nextTick(() => {
    renderFeatherIcons();
    initTooltips();
  });
});
</script>
