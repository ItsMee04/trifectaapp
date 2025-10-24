<template>
  <div class="col-xl-3 col-sm-6 col-12 d-flex">
    <div class="dash-widget w-100" :class="colorClass">
      <div class="dash-widgetimg">
        <span><img :src="icon" alt="icon" /></span>
      </div>
      <div class="dash-widgetcontent">
        <h5><span class="counters">{{ amount }}</span></h5>
        <h6>{{ label }}</h6>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  colorClass: String,
  amount: String,
  label: String
})
</script>
