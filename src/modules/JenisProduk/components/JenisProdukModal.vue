<!-- modules/JenisProduk/components/JenisProdukModal.vue -->
<template>
  <Teleport to="body">
    <!-- Modal Tambah -->
    <div class="modal fade" id="tambahJenisModal" tabindex="-1" aria-labelledby="tambahJenisModalLabel"
      aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>TAMBAH JENIS PRODUK</h4>
                </div>
                <button type="button" class="close" @click="closeTambahModal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-store')">
                  <div class="mb-3">
                    <label class="form-label">Nama Jenis Produk<span class="text-danger ms-1">*</span></label>
                    <input type="text" class="form-control" :value="initialForm.jenis"
                      @input="$emit('update:jenis', $event.target.value)"
                      :class="{ 'is-invalid': initialErrors.jenis }" />
                    <div class="invalid-feedback" v-if="initialErrors.jenis">
                      {{ initialErrors.jenis }}
                    </div>
                  </div>

                  <!-- TAMBAH -->
                  <div class="add-choosen">
                    <div class="mb-3">
                      <label class="form-label">ICON JENIS</label>
                      <div class="image-upload">
                        <input type="file" name="imageJenisTambah" id="imageJenisTambah"
                          @change="$emit('image-change', $event)" accept="image/*" />
                        <div class="image-uploads">
                          <i data-feather="upload" class="plus-down-add me-0"></i>
                          <h4>UPLOAD ICON</h4>
                        </div>
                      </div>
                    </div>

                    <div id="previewTambah" class="phone-img mt-3"
                      style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; border: 2px dashed #ccc; position: relative; background: #f9f9f9;">
                      <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="previewImage"
                        style="width: 100%; height: 100%; display: block; object-fit: cover;" />
                      <div v-else
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; color: #888; font-size: 14px; padding: 10px;">
                        <span class="text-center">Pratinjau Gambar</span>
                      </div>
                    </div>
                  </div>

                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2"
                      @click="closeTambahModal">
                      Batal
                    </button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Jenis Produk</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div class="modal fade" id="editJenisModal" tabindex="-1" aria-labelledby="editJenisModalLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>EDIT JENIS PRODUK</h4>
                </div>
                <button type="button" class="close" aria-label="Close"
                  @click="closeEditModal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-edit')">
                  <div class="mb-3">
                    <label class="form-label">Nama Jenis Produk<span class="text-danger ms-1">*</span></label>
                    <input type="text" class="form-control" :value="editForm.jenis"
                      @input="$emit('update:editJenis', $event.target.value)"
                      :class="{ 'is-invalid': editErrors.jenis }" />
                    <div class="invalid-feedback" v-if="editErrors.jenis">
                      {{ editErrors.jenis }}
                    </div>
                  </div>

                  <!-- EDIT -->
                  <div class="add-choosen">
                    <div class="mb-3">
                      <label class="form-label">ICON JENIS</label>
                      <div class="image-upload">
                        <input type="file" name="imageJenisEdit" id="imageJenisEdit"
                          @change="$emit('edit-image-change', $event)" accept="image/*" />
                        <div class="image-uploads">
                          <i data-feather="upload" class="plus-down-add me-0"></i>
                          <h4>UPLOAD ICON</h4>
                        </div>
                      </div>
                    </div>

                    <div id="previewEdit" class="phone-img mt-3"
                      style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; border: 2px dashed #ccc; position: relative; background: #f9f9f9;">
                      <img v-if="editImageUrl" :src="editImageUrl" alt="previewImage"
                        style="width: 100%; height: 100%; display: block; object-fit: cover;" />
                      <div v-else
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; color: #888; font-size: 14px; padding: 10px;">
                        <span class="text-center">Pratinjau Gambar</span>
                      </div>
                    </div>
                  </div>

                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2"
                      @click="closeEditModal">
                      Batal
                    </button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Jenis Produk</span>
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
import { Modal } from 'bootstrap';
defineProps({
  initialForm: Object,
  initialErrors: Object,
  editForm: Object,
  editErrors: Object,
  isSubmitting: Boolean,
  imagePreviewUrl: String,
  editImageUrl: String,
})

const emit = defineEmits([
  'update:jenis',
  'update:editJenis',
  'image-change',
  'edit-image-change',
  'submit-store',
  'submit-edit',
  'reset-form',
  'reset-edit-form',
])

const closeTambahModal = () => {
  const modalEl = document.getElementById('tambahJenisModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
  emit('reset-form') // ← ini yang benar
}

const closeEditModal = () => {
  const modalEl = document.getElementById('editJenisModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
  emit('reset-edit-form')
}
</script>
