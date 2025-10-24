<template>
  <Teleport to="body">
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="roleModalLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>{{ isEditMode ? 'EDIT ROLE' : 'TAMBAH ROLE' }}</h4>
                </div>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label for="namaRole" class="form-label">Nama Role</label>
                    <input type="text" class="form-control" id="namaRole" v-model="localForm.role"
                      :class="{ 'is-invalid': initialErrors.role }">
                    <div class="invalid-feedback" v-if="initialErrors.role">
                      {{ initialErrors.role }}
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
                        Simpan Role
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
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  initialForm: { type: Object, required: true },
  initialErrors: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['submit-form', 'reset-form']);

// State lokal untuk menampung data form agar tidak memutasi prop
const localForm = ref({ ...props.initialForm });

// Sinkronisasi localForm dengan initialForm dari Parent
watch(() => props.initialForm, (newVal) => {
  localForm.value = { ...newVal };
}, { deep: true, immediate: true });

const submitForm = () => {
  // Emit event ke parent dengan data form yang sudah diubah
  emit('submit-form', localForm.value);
};
</script>
