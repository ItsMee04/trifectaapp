<template>
  <div class="col-xl-3 col-sm-6 col-12 d-flex">
    <div class="dash-count w-100" :class="colorClass">
      <div class="dash-counts">
        <h4>{{ value }}</h4>
        <h5>{{ label }}</h5>
      </div>
      <div class="dash-imgs">
        <template v-if="iconType === 'feather'">
          <i :data-feather="icon"></i>
        </template>
        <template v-else>
          <img :src="icon" class="img-fluid" alt="icon" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: [String, Number],
  label: String,
  icon: String,
  iconType: { type: String, default: 'feather' },
  colorClass: String
})
</script>
