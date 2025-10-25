<template>
  <div class="table-responsive">
    <table class="table text-nowrap table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Jabatan</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="4" class="text-center">
            <span class="spinner-border spinner-border-sm me-2 text-secondary" role="status" aria-hidden="true"></span>
            Memuat data...
          </td>
        </tr>
        <tr v-else-if="totalItemsAvailable === 0">
          <td colspan="6" class="text-center">Tidak ada data.</td>
        </tr>
        <tr v-else v-for="(item, index) in data" :key="item.id">
          <th scope="row">{{ startIndex + index + 1 }}</th>
          <td>
            <div class="d-flex align-items-center">
              <div>
                <div class="lh-1">
                  <span>{{ item.jabatan }}</span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <span :class="['badge', item.status_class]">
              <i class="ri-check-fill align-middle me-1"></i>{{ item.status_label }}
            </span>
          </td>
          <td class="action-table-data">
            <div class="edit-delete-action">
              <a href="#" class="me-2 edit-icon p-2" data-bs-toggle="tooltip" title="Edit"
                @click.prevent="$emit('edit', item)">
                <i data-feather="edit" class="feather-edit"></i>
              </a>

              <a class="confirm-text p-2" data-bs-toggle="tooltip" title="Hapus" @click.prevent="$emit('delete', item)">
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
</template>

<script setup>
const props = defineProps({
  data: { type: Array, required: true },
  startIndex: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
  totalItemsAvailable: { type: Number, required: true },
});

const emit = defineEmits(['edit', 'delete', 'go-to-page', 'prev-page', 'next-page']);
</script>
