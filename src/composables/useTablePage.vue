<template>
  <div class="row">
    <div class="card">
      <!-- 🔍 Header (Search & slot kanan) -->
      <div class="card-header justify-content-between">
        <div class="card-title">
          <div class="search-set">
            <div class="search-input">
              <input type="text" class="form-control" placeholder="Search ..." v-model="internalSearch"
                @input="emit('update:search', internalSearch)" />
            </div>
          </div>
        </div>
        <slot name="header-right"></slot>
      </div>

      <!-- 📋 Tabel -->
      <div class="card-body">
        <div class="table-responsive">
          <table class="table text-nowrap table-striped table-hover">
            <thead>
              <tr>
                <th v-for="(col, index) in columns" :key="index" scope="col">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Data kosong -->
              <tr v-if="paginatedData.length === 0 && !loading">
                <td :colspan="columns.length" class="text-center">Tidak ada data.</td>
              </tr>

              <!-- Loading -->
              <tr v-if="loading">
                <td :colspan="columns.length" class="text-center">Loading...</td>
              </tr>

              <!-- Render data -->
              <tr v-else v-for="(item, index) in paginatedData" :key="item.id">
                <th scope="row">{{ startIndex.value + index + 1 }}</th>

                <td v-for="(col, colIndex) in columns.slice(1)" :key="colIndex"
                  :class="{ 'action-table-data': col.key === 'action' }">
                  <template v-if="$slots[col.key]">
                    <slot :name="col.key" :item="item" :index="index"></slot>
                  </template>
                  <template v-else>
                    {{ resolveValue(item, col.key) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 🔢 Pagination -->
        <nav aria-label="Page navigation" v-if="totalPages > 1">
          <ul class="pagination justify-content-end mb-3 mt-3">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue'
import feather from 'feather-icons'

// ==== Props ====
const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  search: { type: String, default: '' },
  itemsPerPage: { type: Number, default: 10 },
  loading: { type: Boolean, default: false }
})

// ==== Emits ====
const emit = defineEmits(['update:search', 'page-change'])

// ==== Reactive State ====
const internalSearch = ref(props.search)
const currentPage = ref(1)

// ==== Filter & Pagination ====
const filteredData = computed(() => {
  const source = props.data || []
  if (!internalSearch.value) return source
  const term = internalSearch.value.toLowerCase()
  return source.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(term))
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage)
const paginatedData = computed(() =>
  filteredData.value.slice(startIndex.value, startIndex.value + props.itemsPerPage)
)

// ==== Pagination Methods ====
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    emit('page-change', currentPage.value)
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    emit('page-change', currentPage.value)
  }
}
const goToPage = page => {
  currentPage.value = page
  emit('page-change', page)
}

// ==== Helper ====
const resolveValue = (item, key) => item[key] ?? ''

// ==== Feather Refresh ====
const refreshFeather = () => nextTick(() => feather.replace())

// ==== Lifecycle ====
onMounted(refreshFeather)
onUpdated(refreshFeather)
watch([internalSearch, () => props.data], () => {
  currentPage.value = 1
  refreshFeather()
})
</script>
