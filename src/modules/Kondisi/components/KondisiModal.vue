<template>
  <Teleport to="body">
    <div class="modal fade" id="tambahKondisiModal" tabindex="-1" aria-labelledby="tambahKondisiModalLabel"
      aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>TAMBAH KONDISI</h4>
                </div>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"
                  @click="$emit('reset-form')">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-store', initialForm)">
                  <div class="mb-3">
                    <label class="form-label">Nama Kondisi<span class="text-danger ms-1">*</span></label>
                    <input type="text" class="form-control" :value="initialForm.kondisi"
                      @input="$emit('update:storeKondisi', $event.target.value)"
                      :class="{ 'is-invalid': initialErrors.kondisi }">
                    <div class="invalid-feedback" v-if="initialErrors.kondisi">
                      {{ initialErrors.kondisi }}
                    </div>
                  </div>
                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2" data-bs-dismiss="modal"
                      @click="$emit('reset-form')">Batal</button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Kondisi</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editKondisiModal" tabindex="-1" aria-labelledby="editKondisiModalLabel"
      aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>EDIT KONDISI</h4>
                </div>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"
                  @click="$emit('reset-edit-form')">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-edit', editForm)">
                  <div class="mb-3">
                    <label class="form-label">Nama Kondisi<span class="text-danger ms-1">*</span></label>
                    <input type="text" :value="editForm.kondisi"
                      @input="$emit('update:editKondisi', $event.target.value)" class="form-control"
                      :class="{ 'is-invalid': editErrors.kondisi }">
                    <div class="invalid-feedback" v-if="editErrors.kondisi">
                      {{ editErrors.kondisi }}
                    </div>
                  </div>
                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2" data-bs-dismiss="modal"
                      @click="$emit('reset-edit-form')">Batal</button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Kondisi</span>
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
import { defineProps, defineEmits } from 'vue';

defineProps({
  initialForm: { type: Object, required: true }, // Form Tambah
  initialErrors: { type: Object, required: true },
  editForm: { type: Object, required: true }, // Form Edit
  editErrors: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
});

defineEmits([
  'submit-store',
  'submit-edit',
  'reset-form',
  'reset-edit-form',
  // Prop-modifier untuk v-model di Parent
  'update:storeKondisi',
  'update:editKondisi'
]);
</script>
