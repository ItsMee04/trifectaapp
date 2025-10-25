<!-- modules/Produk/views/ProdukPage.vue -->
<template>
  <div>
    <div class="content container-fluid">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>HALAMAN PRODUK</h4>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb breadcrumb-pipe">
                <li class="breadcrumb-item"><a href="#">Produk</a></li>
                <li class="breadcrumb-item active" aria-current="page">Produk</li>
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
          <a href="#" class="btn btn-added color" data-bs-toggle="modal" data-bs-target="#tambahProdukModal">
            <i data-feather="plus-circle" class="me-2"></i>
            Tambah Produk
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
            <ProdukTable :data="paginatedData" :startIndex="startIndex" :currentPage="currentPage"
              :totalPages="totalPages" :isLoading="isLoading" :totalItemsAvailable="totalItems" @view="openViewModal"
              @edit="openEditModal" @delete="handleDeleteProduk" @go-to-page="goToPage" @prev-page="prevPage"
              @next-page="nextPage" />
          </div>
        </div>
      </div>
    </div>

    <ProdukModal :initialForm="form" :initialErrors="errors" :editForm="editForm" :editErrors="editErrors"
      :isSubmitting="isSubmitting" :imagePreviewUrl="imagePreviewUrl" :editImageUrl="editImageUrl"
      :jenisList="jenisList" :kondisiList="kondisiList" @update:nama="val => form.nama = val"
      @update:kondisi="val => form.kondisi = val" @update:jenis="val => form.jenis = val"
      @update:berat="val => form.berat = val" @update:karat="val => form.karat = val"
      @update:lingkar="val => form.lingkar = val" @update:panjang="val => form.panjang = val"
      @update:hargajual="val => form.hargajual = val" @update:hargabeli="val => form.hargabeli = val"
      @update:keterangan="val => form.keterangan = val" @update:editNama="val => editForm.nama = val"
      @update:editKondisi="val => editForm.kondisi = val" @update:editJenis="val => editForm.jenis = val"
      @update:editBerat="val => editForm.berat = val" @update:editKarat="val => editForm.karat = val"
      @update:editLingkar="val => editForm.lingkar = val" @update:editPanjang="val => editForm.panjang = val"
      @update:editHargajual="val => editForm.hargajual = val" @update:editHargabeli="val => editForm.hargabeli = val"
      @update:editKeterangan="val => editForm.keterangan = val" @image-change="handleImageChange"
      @edit-image-change="handleEditImageChange" @submit-store="handleStoreProduk" @submit-edit="handleUpdateProduk"
      @reset-form="resetForm" @reset-edit-form="resetEditForm" />

    <ProdukViewModal :viewForm="editForm" @reset-view-form="resetEditForm" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import feather from 'feather-icons'
import { initTooltips } from '@/composables/useTooltip'
import { Modal } from 'bootstrap'

import ProdukTable from '@/modules/Produk/components/ProdukTable.vue'
import ProdukModal from '@/modules/Produk/components/ProdukModal.vue'
import ProdukViewModal from '@/modules/Produk/components/ProdukViewModal.vue'

import { useProdukData } from '@/modules/Produk/composables/useProdukData'
import { useProdukActions } from '@/modules/Produk/composables/useProdukActions'

const allData = ref([])
const isHeaderCollapsed = ref(false)

const editImageUrl = computed(() => newImagePreviewUrl.value || editForm.value.existing_image_url)
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
} = useProdukData(allData)

const {
  isLoading,
  isSubmitting,
  form,
  editForm,
  errors,
  editErrors,
  imagePreviewUrl,
  newImagePreviewUrl,
  jenisList,
  kondisiList,
  fetchDataFromApi,
  fetchJenisList,
  fetchKondisiList,
  handleImageChange,
  handleEditImageChange,
  handleStoreProduk,
  setCurrentEditItem,
  handleUpdateProduk,
  handleDeleteProduk,
  openViewModal,
  resetForm,
  resetEditForm,
} = useProdukActions(allData, renderFeatherIcons, initTooltips)

const openEditModal = (item) => {
  setCurrentEditItem(item)
  const modal = new Modal(document.getElementById('editProdukModal'))
  modal.show()
  nextTick(renderFeatherIcons)
}

onMounted(() => {
  fetchDataFromApi()
  fetchJenisList()
  fetchKondisiList()
  renderFeatherIcons()
  initTooltips()
})

watch(paginatedData, () => {
  nextTick(() => {
    renderFeatherIcons()
    initTooltips()
  })
})
</script>
