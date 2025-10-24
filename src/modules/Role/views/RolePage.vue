<template>
  <div class="content container-fluid">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>HALAMAN ROLE</h4>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb breadcrumb-pipe">
              <li class="breadcrumb-item"><a href="#">User Management</a></li>
              <li class="breadcrumb-item active" aria-current="page">Role</li>
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
        <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#roleModal"
          @click="resetAndOpenAddModal">
          <i data-feather="plus-circle" class="me-2"></i>
          Tambah Role
        </a>
      </div>
    </div>

    <div class="row">
      <div class="card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            <div class="search-set">
              <div class="search-input">
                <input type="text" class="form-control" placeholder="Search ..." v-model="searchQuery" />
              </div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <RoleTable :data="paginatedData" :startIndex="startIndex" :currentPage="currentPage"
            :totalPages="totalPages" @edit="openEditModal" @delete="handleDeleteRole" @go-to-page="goToPage"
            @prev-page="prevPage" @next-page="nextPage" />
        </div>
      </div>
    </div>
  </div>

  <RoleModal id="roleModal" :initialForm="currentForm" :initialErrors="currentErrors" :isEditMode="isEditMode"
    :isSubmitting="isSubmitting" @submit-form="handleSubmit" @reset-form="resetForm" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import feather from 'feather-icons'
import { initTooltips } from '@/composables/useTooltip'
// IMPOR UTAMA: Impor Modal dari 'bootstrap' secara langsung
import { Modal } from 'bootstrap'

// Import Komponen Anak
import RoleTable from '@/modules/Role/components/RoleTable.vue'
import RoleModal from '@/modules/Role/components/RoleModal.vue'

// Import Composables (Asumsi path dan fungsi)
import { useRoleData } from '@/modules/Role/composables/useRoleData'
import { useRoleActions } from '@/modules/Role/composables/useRoleActions'

// STATE
const allData = ref([])
const isHeaderCollapsed = ref(false)

// FUNGSI UMUM
const renderFeatherIcons = () => feather.replace()
const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value
  document.body.classList.toggle('header-collapse', isHeaderCollapsed.value)
}

// Hubungkan Composables
const {
  currentPage,
  searchQuery,
  paginatedData,
  startIndex,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
} = useRoleData(allData)

const {
  form,
  errors,
  editForm,
  editErrors,
  isSubmitting,
  isEditMode,
  fetchDataFromApi,
  handleStoreRole,
  handleEditRole,
  handleDeleteRole,
  resetForm,
  setCurrentEditItem,
} = useRoleActions(allData, renderFeatherIcons, initTooltips)

// Logic tambahan untuk menentukan form dan error mana yang sedang digunakan oleh Modal
const currentForm = computed(() => (isEditMode.value ? editForm.value : form.value))
const currentErrors = computed(() => (isEditMode.value ? editErrors.value : errors.value))

// Fungsi untuk menangani submit dari modal (menggunakan logika dari Composable)
const handleSubmit = async (formData) => {
  // Note: Pastikan Composable Anda menangani penutupan modal setelah sukses.
  if (isEditMode.value) {
    await handleEditRole(formData)
  } else {
    await handleStoreRole(formData)
  }
}

// Fungsi pembuka modal edit (SUDAH DIPERBAIKI)
const openEditModal = (item) => {
  setCurrentEditItem(item) // 1. Set item yang akan diedit
  // 2. Akses DOM elemen modal

  const modalEl = document.getElementById('roleModal') // 3. Tampilkan modal menggunakan Modal yang diimpor

  if (modalEl) {
    // Ambil atau buat instance Modal
    let modalInstance = Modal.getInstance(modalEl)

    if (!modalInstance) {
      modalInstance = new Modal(modalEl)
    } // Tampilkan modal
    modalInstance.show()
  } else {
    console.error('Kesalahan: Elemen modal (#roleModal) tidak ditemukan.')
  } // 4. Re-render ikon di modal

  nextTick(renderFeatherIcons)
}

// Fungsi pembuka modal tambah (sekaligus mereset form)
const resetAndOpenAddModal = () => {
  isEditMode.value = false // Set mode ke tambah
  resetForm() // Modal akan terbuka via data-bs-target otomatis
}

// LIFECYCLE HOOKS & WATCHER
onMounted(() => {
  fetchDataFromApi()
  renderFeatherIcons()
  initTooltips() // Pasang listener reset form saat modal ditutup

  const modalElement = document.getElementById('roleModal')
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetForm)
  }
})

// Watcher untuk merender ulang ikon/tooltip setelah data paginasi berubah
watch(paginatedData, () => {
  nextTick(() => {
    renderFeatherIcons()
    initTooltips()
  })
})
</script>
