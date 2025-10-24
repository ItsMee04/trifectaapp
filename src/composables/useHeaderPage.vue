<template>
  <div class="page-header">
    <!-- 🔹 Bagian Kiri: Judul dan Breadcrumb -->
    <div class="add-item d-flex">
      <div class="page-title">
        <h4>{{ title }}</h4>
        <nav aria-label="breadcrumb" v-if="breadcrumbs.length">
          <ol class="breadcrumb breadcrumb-pipe">
            <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item"
              :class="{ active: index === breadcrumbs.length - 1 }"
              :aria-current="index === breadcrumbs.length - 1 ? 'page' : null">
              <a v-if="index !== breadcrumbs.length - 1" href="#">{{ item }}</a>
              <span v-else>{{ item }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- 🔹 Bagian Tengah: Tombol kecil kanan atas -->
    <ul class="table-top-head">
      <!-- 🔁 Refresh -->
      <li>
        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click="$emit('refresh')">
          <i data-feather="rotate-ccw" class="feather-rotate-ccw"></i>
        </a>
      </li>
    </ul>

    <!-- 🔹 Bagian Kanan: Tombol Tambah (opsional) -->
    <div class="page-btn import" v-if="showAddButton">
      <a href="javascript:void(0)" class="btn btn-added color" data-bs-toggle="modal" :data-bs-target="modalTarget"
        @click="$emit('add')">
        <i data-feather="plus-circle" class="me-2"></i>
        {{ addLabel }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watchEffect, nextTick } from 'vue'
import feather from 'feather-icons'

/* ===========================
   📦 Props
=========================== */
const props = defineProps({
  title: { type: String, default: 'Judul Halaman' },
  breadcrumbs: { type: Array, default: () => [] },
  showAddButton: { type: Boolean, default: true },
  addLabel: { type: String, default: 'Tambah Data' },
  modalTarget: { type: String, default: '' },
})

/* ===========================
   ⚙️ Emits
=========================== */
const emit = defineEmits(['refresh', 'add'])

/* ===========================
   🪶 Feather Icon Auto Refresh
=========================== */
onMounted(() => nextTick(() => feather.replace()))
watchEffect(() => {
  nextTick(() => feather.replace())
})
</script>
