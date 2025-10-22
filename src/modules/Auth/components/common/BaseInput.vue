<template>
  <div class="form-login">
    <label class="form-label">{{ label }}</label>
    <div class="form-addons">
      <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        class="form-control">
      <img v-if="icon" :src="icon" alt="img">
    </div>
  </div>
</template>

<script setup>
// Definisikan props yang diterima
defineProps({
  modelValue: [String, Number], // Nilai input saat ini
  label: String,
  icon: String,
  type: {
    type: String,
    default: 'text'
  }
});
// Definisikan event yang akan dipancarkan
defineEmits(['update:modelValue']);
</script>
