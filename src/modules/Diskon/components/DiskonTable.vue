<template>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table text-nowrap table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Diskon / Promo</th>
            <th scope="col">Nilai</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="text-center">
              <span class="spinner-border spinner-border-sm me-2 text-secondary" role="status"
                aria-hidden="true"></span>
              Memuat data...
            </td>
          </tr>
          <tr v-else-if="totalItemsAvailable === 0">
            <td colspan="5" class="text-center">Tidak ada data.</td>
          </tr>
          <tr v-else v-for="(item, index) in paginatedData" :key="item.id">
            <th scope="row">{{ startIndex + index + 1 }}</th>
            <td>{{ item.diskon }}</td>
            <td>{{ item.nilai }} %</td>
            <td>
              <span :class="['badge', item.status_class]">
                <i class="ri-check-fill align-middle me-1"></i>{{ item.status_label }}
              </span>
            </td>
            <td class="action-table-data">
              <div class="edit-delete-action">
                <a href="#" class="me-2 edit-icon p-2" data-bs-toggle="modal" data-bs-target="#editDiskonModal"
                  title="Edit" @click.prevent="$emit('edit', item)">
                  <i data-feather="edit" class="feather-edit"></i>
                </a>

                <a class="confirm-text p-2" data-bs-toggle="tooltip" title="Hapus"
                  @click.prevent="$emit('delete', item.id)">
                  <i data-feather="trash-2" class="feather-trash-2"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-end mb-3 mt-3">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="javascript:void(0);" @click.prevent="$emit('prev-page')">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="javascript:void(0);" @click.prevent="$emit('go-to-page', page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="javascript:void(0);" @click.prevent="$emit('next-page')">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  paginatedData: { type: Array, required: true },
  startIndex: { type: Number, required: true },
  isLoading: { type: Boolean, required: true },
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItemsAvailable: { type: Number, required: true }, // DITAMBAHKAN INI
});

defineEmits(['edit', 'delete', 'prev-page', 'next-page', 'go-to-page']);
</script>
