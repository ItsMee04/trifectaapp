<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered mb-0">
      <thead>
        <tr>
          <th scope="col" style="width: 50px;">#</th>
          <th scope="col" style="width: 80px;">Icon</th>
          <th scope="col">Nama Jenis Produk</th>
          <th scope="col" style="width: 150px;">Status</th>
          <th scope="col" style="width: 120px;" class="text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="5" class="text-center">
            <span class="spinner-border spinner-border-sm me-2 text-secondary" role="status" aria-hidden="true"></span>
            Memuat data...
          </td>
        </tr>
        <tr v-else-if="paginatedData.length === 0">
          <td colspan="5" class="text-center">
            Tidak ada data.
          </td>
        </tr>
        <tr v-else v-for="(item, index) in paginatedData" :key="item.id">
          <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
          <td>
            <img :src="item.image" alt="Icon" class="avatar-xs rounded-circle bg-light me-1">
          </td>
          <td>{{ item.nama_jenis_produk }}</td>
          <td>
            <span class="badge" :class="item.status_class">{{ item.status_label }}</span>
          </td>
          <td class="text-center">
            <div class="d-flex justify-content-center">
              <button type="button" class="btn btn-soft-info btn-sm me-2" data-bs-toggle="tooltip"
                data-bs-placement="top" title="Edit" @click="$emit('edit', item)">
                <i data-feather="edit" class="icon-xs"></i>
              </button>
              <button type="button" class="btn btn-soft-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top"
                title="Hapus" @click="$emit('delete', item.id)">
                <i data-feather="trash-2" class="icon-xs"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="!isLoading && totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
    <div class="dataTables_info">
      Menampilkan {{ (currentPage - 1) * perPage + 1 }} hingga {{ Math.min(currentPage * perPage, filteredData.length)
      }} dari {{ filteredData.length }} entri
    </div>
    <nav>
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="previousPage">Sebelumnya</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Berikutnya</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  paginatedData: { type: Array, required: true },
  filteredData: { type: Array, required: true },
  isLoading: { type: Boolean, required: true },
  currentPage: { type: Number, required: true },
  perPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  setPage: { type: Function, required: true },
  previousPage: { type: Function, required: true },
  nextPage: { type: Function, required: true },
});

defineEmits(['edit', 'delete']);
</script>
