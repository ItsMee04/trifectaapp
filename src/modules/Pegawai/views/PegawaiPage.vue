<template>
  <div class="content container-fluid">
    <!-- Header Halaman dan Tombol Tambah -->
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>HALAMAN PEGAWAI</h4>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb breadcrumb-pipe">
              <li class="breadcrumb-item"><a href="#">User Management</a></li>
              <li class="breadcrumb-item active" aria-current="page">Pegawai</li>
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
            @click="toggleHeaderCollapse" :class="{ active: isHeaderCollapsed }">
            <i data-feather="chevron-up" class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
      <div class="page-btn import">
        <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#pegawaiModal"
          @click="resetAndOpenAddModal">
          <i data-feather="plus-circle" class="me-2"></i>
          Tambah Pegawai
        </a>
      </div>
    </div>

    <!-- Area Tabel dan Pencarian -->
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
          <!-- Komponen Tabel -->
          <PegawaiTable :data="paginatedData" :startIndex="startIndex" :currentPage="currentPage"
            :totalPages="totalPages" :isLoading="isLoading" :totalItemsAvailable="allData.length" @edit="openEditModal"
            @delete="handleDeletePegawai" @go-to-page="goToPage" @prev-page="prevPage" @next-page="nextPage" />
        </div>
      </div>
    </div>
  </div>

  <!-- Komponen Modal (Tambah/Edit) -->
  <PegawaiModal id="pegawaiModal" :jabatanList="jabatanList" :initialForm="currentForm" :initialErrors="currentErrors"
    :isEditMode="isEditMode" :isSubmitting="isSubmitting" :imagePreviewUrl="imagePreviewUrl"
    :editImageUrl="editImageUrl" @submit-form="handleSubmit" @image-change="handleImageChangeInModal" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import feather from 'feather-icons';
import { Modal, Tooltip } from 'bootstrap';
import { initTooltips } from '@/composables/useTooltip';
import { jabatanService } from '@/modules/Jabatan/services/jabatanService'; // Import service jabatan

// Import Komponen Anak
import PegawaiTable from '@/modules/Pegawai/components/PegawaiTable.vue';
import PegawaiModal from '@/modules/Pegawai/components/PegawaiModal.vue';

// Import Composables
import { usePegawaiData } from '../composable/usePegawaiData';
import { usePegawaiActions } from '../composable/usePegawaiActions';

// --- STATE & UTILITY ---
const isHeaderCollapsed = ref(false)
const allData = ref([]);
const jabatanList = ref([]); // State untuk list jabatan
const renderFeatherIcons = () => feather.replace();

// Fungsi untuk menghancurkan Tooltip lama sebelum merender yang baru
const refreshTooltipsAndIcons = () => {
  const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  existingTooltips.forEach(el => {
    const tooltipInstance = Tooltip.getInstance(el);
    if (tooltipInstance) {
      tooltipInstance.dispose();
    }
  });
  renderFeatherIcons();
  initTooltips();
};


// --- COMPOSABLES ---
// 1. Data/Pagination
const { currentPage, searchQuery, paginatedData, startIndex, totalPages, goToPage, prevPage, nextPage } = usePegawaiData(allData);

// 2. Actions (CRUD, Form State, Image Preview)
const {
  form, errors, imagePreviewUrl, editForm, editErrors,
  isSubmitting, isEditMode, editImageUrl, isLoading,
  fetchDataFromApi, handleStorePegawai, handleImageChange,
  handleUpdatePegawai, handleEditImageChange, setCurrentEditItem,
  handleDeletePegawai, resetForm
} = usePegawaiActions(allData, refreshTooltipsAndIcons);


// --- COMPUTED (Untuk Modal) ---
const currentForm = computed(() => isEditMode.value ? editForm.value : form.value);
const currentErrors = computed(() => isEditMode.value ? editErrors.value : errors.value);


// --- HANDLERS DARI MODAL ---

// Menangani submit dari modal (berdasarkan mode Edit/Tambah)
const handleSubmit = () => {
  if (isEditMode.value) {
    handleUpdatePegawai();
  } else {
    handleStorePegawai();
  }
};

// Menangani event perubahan gambar dari Modal
const handleImageChangeInModal = (file) => {
  if (isEditMode.value) {
    handleEditImageChange(file);
  } else {
    handleImageChange(file);
  }
};

// Fungsi pembuka modal edit
const openEditModal = (item) => {
  setCurrentEditItem(item); // 1. Set item yang akan diedit di Composable

  // 2. Akses DOM elemen modal
  const modalEl = document.getElementById('pegawaiModal');

  // 3. Tampilkan modal menggunakan Modal yang diimpor
  if (modalEl) {
    let modalInstance = Modal.getInstance(modalEl);
    if (!modalInstance) {
      modalInstance = new Modal(modalEl);
    }
    modalInstance.show();
  } else {
    console.error("Kesalahan: Elemen modal (#pegawaiModal) tidak ditemukan.");
  }

  nextTick(renderFeatherIcons);
};

// Fungsi pembuka modal tambah
const resetAndOpenAddModal = () => {
  resetForm(); // Reset form dan isEditMode = false
  // Modal akan terbuka via data-bs-target otomatis
};

// --- LOGIKA TAMBAHAN: FETCH JABATAN ---
const fetchJabatanList = async () => {
  try {
    const response = await jabatanService.getJabatan();
    jabatanList.value = response;
  } catch (error) {
    console.error('Gagal memuat data jabatan:', error);
  }
};

// --- LOGIKA HEADER COLLAPSE ---
const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value
  document.body.classList.toggle('header-collapse', isHeaderCollapsed.value)
}

// --- LIFECYCLE & WATCHERS ---
onMounted(() => {
  fetchJabatanList();
  fetchDataFromApi();
  nextTick(refreshTooltipsAndIcons);

  // Listener untuk mereset form saat modal ditutup
  const modalElement = document.getElementById('pegawaiModal');
  if (modalElement) {
    // Panggil resetForm saat modal ditutup, yang akan mereset semua state form
    modalElement.addEventListener('hidden.bs.modal', resetForm);
  }
});

watch(paginatedData, () => {
  nextTick(() => {
    refreshTooltipsAndIcons();
  });
});

watch(searchQuery, () => currentPage.value = 1);
</script>
