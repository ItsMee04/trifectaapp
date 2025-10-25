<!-- modules/JenisProduk/views/JenisProdukPage.vue -->
<template>
  <div>
    <div class="content container-fluid">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>HALAMAN JENIS PRODUK</h4>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb breadcrumb-pipe">
                <li class="breadcrumb-item"><a href="#">Produk</a></li>
                <li class="breadcrumb-item active">Jenis Produk</li>
              </ol>
            </nav>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a data-bs-toggle="tooltip" title="Refresh" @click="fetchDataFromApi">
              <i data-feather="rotate-ccw"></i>
            </a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" title="Collapse" @click="toggleHeaderCollapse" :class="{ active: isHeaderCollapsed }">
              <i data-feather="chevron-up"></i>
            </a>
          </li>
        </ul>
        <div class="page-btn import">
          <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#tambahJenisModal">
            <i data-feather="plus-circle" class="me-2"></i>Tambah Jenis Produk
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
            <JenisProdukTable
              :data="paginatedData"
              :startIndex="startIndex"
              :currentPage="currentPage"
              :totalPages="totalPages"
              :isLoading="isLoading"
              :totalItemsAvailable="totalItems"
              @edit="openEditModal"
              @delete="handleDeleteJenis"
              @go-to-page="goToPage"
              @prev-page="prevPage"
              @next-page="nextPage"
            />
          </div>
        </div>
      </div>
    </div>

    <JenisProdukModal
      :initialForm="form"
      :initialErrors="errors"
      :editForm="editForm"
      :editErrors="editErrors"
      :isSubmitting="isSubmitting"
      :imagePreviewUrl="imagePreviewUrl"
      :editImageUrl="editImageUrl"
      @update:jenis="val => form.jenis = val"
      @update:editJenis="val => editForm.jenis = val"
      @image-change="handleImageChange"
      @edit-image-change="handleEditImageChange"
      @submit-store="handleStoreJenis"
      @submit-edit="handleUpdateJenis"
      @reset-form="resetForm"
      @reset-edit-form="resetEditForm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import feather from 'feather-icons'
import { initTooltips } from '@/composables/useTooltip'
import { Modal } from 'bootstrap'

import JenisProdukTable from '@/modules/JenisProduk/components/JenisProdukTable.vue'
import JenisProdukModal from '@/modules/JenisProduk/components/JenisProdukModal.vue'

import { useJenisProdukData } from '@/modules/JenisProduk/composables/useJenisProdukData'
import { useJenisProdukActions } from '@/modules/JenisProduk/composables/useJenisProdukActions'

const allData = ref([])
const isHeaderCollapsed = ref(false)

const renderFeatherIcons = () => feather.replace()
const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value
  document.body.classList.toggle('header-collapse', isHeaderCollapsed.value)
}

const {
  currentPage,
  searchQuery,
  paginatedData,
  startIndex,
  totalPages,
  totalItems,
  goToPage,
  prevPage,
  nextPage,
} = useJenisProdukData(allData)

const {
  isLoading,
  isSubmitting,
  form,
  editForm,
  errors,
  editErrors,
  imagePreviewUrl,
  editImageUrl,
  fetchDataFromApi,
  handleImageChange,
  handleEditImageChange,
  handleStoreJenis,
  setCurrentEditItem,
  handleUpdateJenis,
  handleDeleteJenis,
  resetForm,
  resetEditForm,
} = useJenisProdukActions(allData, renderFeatherIcons, initTooltips)

const openEditModal = (item) => {
  setCurrentEditItem(item)
  const modal = new Modal(document.getElementById('editJenisModal'))
  modal.show()
  nextTick(renderFeatherIcons)
}

onMounted(() => {
  fetchDataFromApi()
  renderFeatherIcons()
  initTooltips()
})

watch(paginatedData, () => {
  nextTick(() => {
    renderFeatherIcons();
    initTooltips();
  });
});
</script>
