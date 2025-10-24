<template>
  <div class="content">
    <div class="row">
      <!-- Komponen Ringkasan (widget atas) -->
      <SummaryCard v-for="(item, index) in summaryCards" :key="index" :icon="item.icon" :colorClass="item.colorClass"
        :amount="item.amount" :label="item.label" />
    </div>

    <div class="row mt-4">
      <!-- Komponen statistik tambahan -->
      <StatsCounter v-for="(stat, index) in statsCounters" :key="index" :value="stat.value" :label="stat.label"
        :icon="stat.icon" :iconType="stat.iconType" :colorClass="stat.colorClass" />
    </div>
  </div>
</template>

<script setup>
import SummaryCard from '../components/SummaryCard.vue'
import StatsCounter from '../components/StatsCounter.vue'

// Data dummy (nanti bisa ambil dari API via service)
const summaryCards = [
  {
    icon: '/src/assets/img/icons/dash1.svg',
    colorClass: '',
    amount: '$307,144.00',
    label: 'Total Purchase Due'
  },
  {
    icon: '/src/assets/img/icons/dash2.svg',
    colorClass: 'dash1',
    amount: '$4,385.00',
    label: 'Total Sales Due'
  },
  {
    icon: '/src/assets/img/icons/dash3.svg',
    colorClass: 'dash2',
    amount: '$385,656.50',
    label: 'Total Sale Amount'
  },
  {
    icon: '/src/assets/img/icons/dash4.svg',
    colorClass: 'dash3',
    amount: '$400.00',
    label: 'Total Expense Amount'
  }
]

const statsCounters = [
  { value: 100, label: 'Customers', icon: 'user', iconType: 'feather', colorClass: '' },
  { value: 110, label: 'Suppliers', icon: 'user-check', iconType: 'feather', colorClass: 'das1' },
  { value: 150, label: 'Purchase Invoice', icon: '/src/assets/img/icons/file-text-icon-01.svg', iconType: 'img', colorClass: 'das2' },
  { value: 170, label: 'Sales Invoice', icon: 'file', iconType: 'feather', colorClass: 'das3' }
]
</script>
