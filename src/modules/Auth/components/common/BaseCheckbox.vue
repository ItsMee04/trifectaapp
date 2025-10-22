<template>
  <div class="custom-control custom-checkbox">
    <label class="checkboxs ps-4 mb-0 pb-0 line-height-1">
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)">
      <span class="checkmarks"></span>{{ label }}
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean, // Nilai checkbox (true/false)
  label: String
});
defineEmits(['update:modelValue']);
</script>
