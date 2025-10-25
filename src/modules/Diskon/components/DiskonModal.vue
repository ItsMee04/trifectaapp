<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + 'Label'" aria-hidden="true"
    data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered custom-modal-two">
      <div class="modal-content">
        <div class="page-wrapper-new p-0">
          <div class="content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>{{ modalTitle }}</h4>
              </div>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="$emit('submit')">
                <div class="mb-3">
                  <label :for="modalId + 'NamaDiskon'" class="form-label">Nama Diskon</label>
                  <input type="text" class="form-control" :id="modalId + 'NamaDiskon'" :value="diskon"
                    @input="$emit('update:diskon', $event.target.value)" :class="{ 'is-invalid': errors.diskon }">
                  <div class="invalid-feedback" v-if="errors.diskon">
                    {{ errors.diskon }}
                  </div>
                </div>
                <div class="mb-3">
                  <label :for="modalId + 'NilaiDiskon'" class="form-label">Nilai Diskon (%)</label>
                  <input type="text" class="form-control" :id="modalId + 'NilaiDiskon'" :value="nilai"
                    @input="$emit('update:nilai', $event.target.value)" :class="{ 'is-invalid': errors.nilai }">
                  <div class="invalid-feedback" v-if="errors.nilai">
                    {{ errors.nilai }}
                  </div>
                </div>
                <div class="modal-footer-btn">
                  <button type="button" class="btn btn-warning me-2" data-bs-dismiss="modal">Batal</button>
                  <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                    <span v-if="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Menyimpan...
                    </span>
                    <span v-else>
                      Simpan Diskon
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modalId: { type: String, required: true },
  modalTitle: { type: String, required: true },
  diskon: { type: [String, Number], default: '' },
  nilai: { type: [String, Number], default: '' },
  errors: { type: Object, default: () => ({}) },
  isSubmitting: { type: Boolean, default: false },
});

defineEmits(['update:diskon', 'update:nilai', 'submit']);
</script>
