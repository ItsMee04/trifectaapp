<template>
  <div class="content container-fluid">
    <!-- Header dinamis -->
    <useHeaderPage title="HALAMAN JABATAN" :breadcrumbs="['User Management', 'Jabatan']" :showAddButton="true"
      addLabel="Tambah Jabatan" modalTarget="#tambahJabatanModal" @refresh="fetchDataFromApi"
      @add="handleTambahClick" />

    <!-- Tabel reusable -->
    <useTablePage :columns="columns" :data="dataJabatan" v-model:search="searchQuery" :items-per-page="5"
      :loading="loading">
      <!-- Slot Action -->
      <template #action="{ item }">
        <div class="edit-delete-action">
          <a href="#" class="me-2 edit-icon p-2" title="Edit" @click.prevent="openEditModal(item)">
            <i data-feather="edit" class="feather-edit"></i>
          </a>
          <a href="#" class="confirm-text p-2" title="Hapus" @click.prevent="handleDeleteJabatan(item.id)">
            <i data-feather="trash-2" class="feather-trash-2"></i>
          </a>
        </div>
      </template>
    </useTablePage>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useHeaderPage from '@/composables/useHeaderPage.vue'
import useTablePage from '@/composables/useTablePage.vue'
import { jabatanService } from '@/modules/Jabatan/services/jabatanService'

// ==== Reactive State ====
const searchQuery = ref('')
const loading = ref(false)
const dataJabatan = ref([])

// ==== Kolom Tabel ====
const columns = [
  { label: 'No.', key: 'no' },
  { label: 'Jabatan', key: 'jabatan' },
  { label: 'Status', key: 'status_label' },
  { label: 'Action', key: 'action' }
]

// ==== Methods ====
const fetchDataFromApi = async () => {
  loading.value = true
  try {
    const res = await jabatanService.getJabatan()
    dataJabatan.value = Array.isArray(res.Data)
      ? res.Data.map(item => ({
        ...item,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger'
      }))
      : []
  } catch (err) {
    console.error('Gagal memuat data dari API:', err)
    dataJabatan.value = []
  } finally {
    loading.value = false
  }
}

const handleTambahClick = () => console.log('➕ Tambah jabatan diklik')
const openEditModal = item => console.log('✏️ Edit item:', item)
const handleDeleteJabatan = id => console.log('🗑️ Hapus jabatan id:', id)

// ==== Lifecycle ====
onMounted(fetchDataFromApi)
</script>

<style scoped></style>
