<template>
  <div class="content container-fluid">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>HALAMAN USER</h4>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb breadcrumb-pipe">
              <li class="breadcrumb-item"><a href="#">User Management</a></li>
              <li class="breadcrumb-item active" aria-current="page">User</li>
            </ol>
          </nav>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click="fetchUsersData">
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
          <UserTable :data="paginatedData" :startIndex="startIndex" :currentPage="currentPage" :totalPages="totalPages"
            :isLoading="isLoading" :totalItemsAvailable="allData.length" @edit="openEditModal" @go-to-page="goToPage"
            @prev-page="prevPage" @next-page="nextPage" />
        </div>
      </div>
    </div>
  </div>

  <UserModal id="editUserModal" :initialForm="editForm" :initialErrors="editErrors" :isSubmitting="isSubmitting"
    :roleList="roleList" :showPassword="showPassword" @submit-form="handleEditUser" @toggle-password="togglePassword" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import feather from 'feather-icons';
import { initTooltips } from '@/composables/useTooltip'; // Asumsi ini ada
import { Modal } from 'bootstrap';

// Import Komponen Anak
import UserTable from '@/modules/User/components/UserTable.vue';
import UserModal from '@/modules/User/components/UserModal.vue';

// Import Composables
import { useUserData } from '@/modules/User/composables/useUserData';
import { useUserActions } from '@/modules/User/composables/useUserActions';

// STATE
const allData = ref([]);
const roleList = ref([]); // State untuk menampung daftar role
const isHeaderCollapsed = ref(false);

// FUNGSI UTAMA & Composables
const renderFeatherIcons = () => feather.replace();
const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
  document.body.classList.toggle('header-collapse', isHeaderCollapsed.value);
};

// Hubungkan useUserData
const {
  currentPage,
  searchQuery,
  paginatedData,
  startIndex,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
} = useUserData(allData);

// Hubungkan useUserActions
const {
  editForm,
  editErrors,
  isSubmitting,
  showPassword,
  isLoading,
  fetchUsersData,
  fetchRolesList,
  setCurrentEditItem,
  handleEditUser,
  resetForm,
  togglePassword,
} = useUserActions(allData, roleList, renderFeatherIcons, initTooltips);


// Logika Pembuka Modal
const openEditModal = (item) => {
  setCurrentEditItem(item); // 1. Set data yang akan diedit di composable

  const modalEl = document.getElementById('editUserModal'); // 2. Tampilkan modal secara manual
  if (modalEl) {
    let modalInstance = Modal.getInstance(modalEl);
    if (!modalInstance) {
      modalInstance = new Modal(modalEl);
    }
    modalInstance.show();
  } else {
    console.error('Kesalahan: Elemen modal (#editUserModal) tidak ditemukan.');
  }
  nextTick(renderFeatherIcons);
};

// LIFECYCLE HOOKS & WATCHER
onMounted(() => {
  fetchUsersData();
  fetchRolesList();
  renderFeatherIcons();
  initTooltips();

  // Pasang listener untuk mereset form saat modal ditutup
  const modalElement = document.getElementById('editUserModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetForm);
  }
});

watch(paginatedData, () => {
  nextTick(() => {
    renderFeatherIcons();
    initTooltips();
  });
});

watch(isHeaderCollapsed, (newValue) => {
  if (newValue) {
    document.body.classList.add('header-collapse');
  } else {
    document.body.classList.remove('header-collapse');
  }
});
</script>
