<template>
  <Teleport to="body">
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>EDIT USER</h4>
                </div>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label for="editPegawai" class="form-label">Pegawai</label>
                    <input type="text" class="form-control" id="editPegawai" v-model="localForm.pegawai" readonly>
                  </div>
                  <div class="mb-3">
                    <label for="editEmail" class="form-label">Email</label>
                    <input type="text" class="form-control" id="editEmail" v-model="localForm.email"
                      :class="{ 'is-invalid': initialErrors.email }">
                    <div class="invalid-feedback" v-if="initialErrors.email">
                      {{ initialErrors.email }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="editPassword" class="form-label">Password</label>
                    <div class="pass-group">
                      <input :type="showPassword ? 'text' : 'password'" v-model="localForm.password"
                        class="form-control" placeholder="Biarkan kosong jika tidak ingin diubah" id="editPassword"
                        :class="{ 'is-invalid': initialErrors.password }" />

                      <div class="invalid-feedback" v-if="initialErrors.password">
                        {{ initialErrors.password }}
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Role<span class="text-danger ms-1">*</span></label>
                    <div :class="{ 'is-invalid': initialErrors.role }">
                      <VueMultiselect v-model="localForm.role" :options="roleList" :allow-empty="false"
                        :preselect-first="true" :searchable="true" placeholder="Pilih Role" label="role" track-by="id"
                        :class="{ 'is-invalid': initialErrors.role }">
                      </VueMultiselect>
                    </div>
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
                        Simpan User
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
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const props = defineProps({
  id: { type: String, required: true },
  initialForm: { type: Object, required: true },
  initialErrors: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
  roleList: { type: Array, required: true },
  showPassword: { type: Boolean, default: false }, // Menerima state toggle password
});

const emit = defineEmits(['submit-form', 'toggle-password']);

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
