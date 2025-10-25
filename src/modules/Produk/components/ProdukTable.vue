<!-- modules/Produk/components/ProdukTable.vue -->
<template>
  <div class="table-responsive">
    <table class="table text-nowrap table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Kode</th>
          <th scope="col">Nama</th>
          <th scope="col">Berat</th>
          <th scope="col">Karat</th>
          <th scope="col">Harga @Gram</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="8" class="text-center">
            <span class="spinner-border spinner-border-sm me-2 text-secondary"></span>Memuat data...
          </td>
        </tr>
        <tr v-else-if="totalItemsAvailable === 0">
          <td colspan="8" class="text-center">Tidak ada data.</td>
        </tr>
        <tr v-else v-for="(item, index) in data" :key="item.id">
          <th scope="row">{{ startIndex + index + 1 }}</th>
          <td>
            <div class="lh-1 text-center">
              <img v-if="item.barcode_exists" :src="`${STORAGE_BASE_URL}/barcode/${item.kodeproduk}.jpg`"
                :alt="'Barcode ' + item.kodeproduk"
                style="max-width: 100px; height: auto; display: block; margin: 0 auto 5px auto;" />
              <img v-else src="/src/assets/img/noimageavailable.png" alt="Barcode tidak tersedia"
                style="max-width: 100px; height: auto; display: block; margin: 0 auto 5px auto;" />
              <span style="display: block;">{{ item.kodeproduk }}</span>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="avatar avatar-sm me-2 avatar-rounded">
                <img :src="item.image" alt="img" />
              </div>
              <div>
                <div class="lh-1">
                  <span>{{ item.nama }}</span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="lh-1">
              <span>{{ item.berat }} gram</span>
            </div>
          </td>
          <td>
            <div class="lh-1">
              <span>{{ item.karat }} K</span>
            </div>
          </td>
          <td>
            <div class="lh-1">
              <span>{{ formatRupiah(item.harga_jual) }}</span>
            </div>
          </td>
          <td>
            <span :class="['badge', item.status_class]">
              <i class="ri-check-fill align-middle me-1"></i>{{ item.status_label }}
            </span>
          </td>
          <td class="action-table-data">
            <div class="edit-delete-action">
              <a href="#" class="me-2 edit-icon p-2" data-bs-toggle="tooltip" title="View"
                @click.prevent="$emit('view', item)">
                <i data-feather="eye" class="feather-eye"></i>
              </a>
              <a href="#" class="me-2 edit-icon p-2" data-bs-toggle="tooltip" title="Edit"
                @click.prevent="$emit('edit', item)">
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

  <nav aria-label="Page navigation" v-if="totalPages > 0">
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
import { STORAGE_BASE_URL } from '@/composables/useBase'
defineProps({
  data: Array,
  startIndex: Number,
  currentPage: Number,
  totalPages: Number,
  isLoading: Boolean,
  totalItemsAvailable: Number,
})

const formatRupiah = (value) => {
  if (isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

defineEmits(['view', 'edit', 'delete', 'go-to-page', 'prev-page', 'next-page'])
</script>
