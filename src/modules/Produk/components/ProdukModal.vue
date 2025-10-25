<!-- modules/Produk/components/ProdukModal.vue -->
<template>
  <Teleport to="body">
    <!-- Modal Tambah -->
    <div class="modal fade" id="tambahProdukModal" tabindex="-1" aria-labelledby="tambahProdukModalLabel"
      aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>TAMBAH PRODUK</h4>
                </div>
                <button type="button" class="close" @click="closeTambahModal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-store')">
                  <div class="mb-3">
                    <label class="form-label">Nama <span class="text-danger ms-1">*</span></label>
                    <input type="text" class="form-control" :value="initialForm.nama"
                      @input="$emit('update:nama', $event.target.value)"
                      :class="{ 'is-invalid': initialErrors.nama }" />
                    <div class="invalid-feedback" v-if="initialErrors.nama">{{ initialErrors.nama }}</div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Kondisi<span class="text-danger ms-1">*</span></label>
                      <VueMultiselect :model-value="initialForm.kondisi" :options="kondisiList" :allow-empty="false"
                        :searchable="true" placeholder="Pilih Kondisi" label="kondisi" track-by="id"
                        :class="{ 'is-invalid': initialErrors.kondisi }"
                        @update:model-value="val => $emit('update:kondisi', val)" />
                      <div class="invalid-feedback" v-if="initialErrors.kondisi">{{ initialErrors.kondisi }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Jenis<span class="text-danger ms-1">*</span></label>
                      <VueMultiselect :model-value="initialForm.jenis" :options="jenisList" :allow-empty="false"
                        :preselect-first="true" :searchable="true" placeholder="Pilih Jenis" label="jenis_produk"
                        track-by="id" :class="{ 'is-invalid': initialErrors.jenis }"
                        @update:model-value="val => $emit('update:jenis', val)" />
                      <div class="invalid-feedback" v-if="initialErrors.jenis">{{ initialErrors.jenis }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Berat<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.berat"
                        @input="$emit('update:berat', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.berat }" />
                      <div class="invalid-feedback" v-if="initialErrors.berat">{{ initialErrors.berat }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Karat<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.karat"
                        @input="$emit('update:karat', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.karat }" />
                      <div class="invalid-feedback" v-if="initialErrors.karat">{{ initialErrors.karat }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Lingkar<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.lingkar"
                        @input="$emit('update:lingkar', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.lingkar }" />
                      <div class="invalid-feedback" v-if="initialErrors.lingkar">{{ initialErrors.lingkar }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Panjang<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.panjang"
                        @input="$emit('update:panjang', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.panjang }" />
                      <div class="invalid-feedback" v-if="initialErrors.panjang">{{ initialErrors.panjang }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Harga Jual<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.hargajual"
                        @input="$emit('update:hargajual', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.hargajual }" />
                      <div class="invalid-feedback" v-if="initialErrors.hargajual">{{ initialErrors.hargajual }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Harga Beli<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="initialForm.hargabeli"
                        @input="$emit('update:hargabeli', $event.target.value)"
                        :class="{ 'is-invalid': initialErrors.hargabeli }" />
                      <div class="invalid-feedback" v-if="initialErrors.hargabeli">{{ initialErrors.hargabeli }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Keterangan<span class="text-danger ms-1">*</span></label>
                    <textarea class="form-control" cols="30" rows="4" :value="initialForm.keterangan"
                      @input="$emit('update:keterangan', $event.target.value)"
                      :class="{ 'is-invalid': initialErrors.keterangan }"></textarea>
                    <div class="invalid-feedback" v-if="initialErrors.keterangan">{{ initialErrors.keterangan }}</div>
                  </div>
                  <div class="add-choosen">
                    <div class="mb-3">
                      <label class="form-label">Foto Produk</label>
                      <div class="image-upload">
                        <input type="file" name="imageProdukTambah" id="imageProdukTambah"
                          @change="$emit('image-change', $event)" accept="image/*" />
                        <div class="image-uploads">
                          <i data-feather="upload" class="plus-down-add me-0"></i>
                          <h4>Upload Foto Produk</h4>
                        </div>
                      </div>
                    </div>
                    <div id="previewTambah" class="phone-img mt-3"
                      style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; border: 2px dashed #ccc; position: relative; background: #f9f9f9;">
                      <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="previewImage"
                        style="width: 100%; height: 100%; display: block; object-fit: contain;" />
                      <div v-else
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; color: #888; font-size: 14px; padding: 10px;">
                        <span class="text-center">Pratinjau Gambar</span>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2" @click="closeTambahModal">Batal</button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Produk</span>
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
    <div class="modal fade" id="editProdukModal" tabindex="-1" aria-labelledby="editProdukModalLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>EDIT PRODUK</h4>
                </div>
                <button type="button" class="close" @click="closeEditModal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <form @submit.prevent="$emit('submit-edit')">
                  <div class="mb-3">
                    <label class="form-label">Nama <span class="text-danger ms-1">*</span></label>
                    <input type="text" class="form-control" :value="editForm.nama"
                      @input="$emit('update:editNama', $event.target.value)"
                      :class="{ 'is-invalid': editErrors.nama }" />
                    <div class="invalid-feedback" v-if="editErrors.nama">{{ editErrors.nama }}</div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Kondisi<span class="text-danger ms-1">*</span></label>
                      <VueMultiselect :model-value="editForm.kondisi" :options="kondisiList" :allow-empty="false"
                        :searchable="true" placeholder="Pilih Kondisi" label="kondisi" track-by="id"
                        :class="{ 'is-invalid': editErrors.kondisi }"
                        @update:model-value="val => $emit('update:editKondisi', val)" />
                      <div class="invalid-feedback" v-if="editErrors.kondisi">{{ editErrors.kondisi }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Jenis<span class="text-danger ms-1">*</span></label>
                      <VueMultiselect :model-value="editForm.jenis" :options="jenisList" :allow-empty="false"
                        :preselect-first="true" :searchable="true" placeholder="Pilih Jenis" label="jenis_produk"
                        track-by="id" :class="{ 'is-invalid': editErrors.jenis }"
                        @update:model-value="val => $emit('update:editJenis', val)" />
                      <div class="invalid-feedback" v-if="editErrors.jenis">{{ editErrors.jenis }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Berat<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.berat"
                        @input="$emit('update:editBerat', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.berat }" />
                      <div class="invalid-feedback" v-if="editErrors.berat">{{ editErrors.berat }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Karat<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.karat"
                        @input="$emit('update:editKarat', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.karat }" />
                      <div class="invalid-feedback" v-if="editErrors.karat">{{ editErrors.karat }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Lingkar<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.lingkar"
                        @input="$emit('update:editLingkar', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.lingkar }" />
                      <div class="invalid-feedback" v-if="editErrors.lingkar">{{ editErrors.lingkar }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Panjang<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.panjang"
                        @input="$emit('update:editPanjang', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.panjang }" />
                      <div class="invalid-feedback" v-if="editErrors.panjang">{{ editErrors.panjang }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Harga Jual<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.hargajual"
                        @input="$emit('update:editHargajual', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.hargajual }" />
                      <div class="invalid-feedback" v-if="editErrors.hargajual">{{ editErrors.hargajual }}</div>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label class="form-label">Harga Beli<span class="text-danger ms-1">*</span></label>
                      <input type="text" class="form-control" :value="editForm.hargabeli"
                        @input="$emit('update:editHargabeli', $event.target.value)"
                        :class="{ 'is-invalid': editErrors.hargabeli }" />
                      <div class="invalid-feedback" v-if="editErrors.hargabeli">{{ editErrors.hargabeli }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Keterangan<span class="text-danger ms-1">*</span></label>
                    <textarea class="form-control" cols="30" rows="4" :value="editForm.keterangan"
                      @input="$emit('update:editKeterangan', $event.target.value)"
                      :class="{ 'is-invalid': editErrors.keterangan }"></textarea>
                    <div class="invalid-feedback" v-if="editErrors.keterangan">{{ editErrors.keterangan }}</div>
                  </div>
                  <div class="add-choosen">
                    <div class="mb-3">
                      <label class="form-label">Foto Produk</label>
                      <div class="image-upload">
                        <input type="file" name="imageProdukEdit" id="imageProdukEdit"
                          @change="$emit('edit-image-change', $event)" accept="image/*" />
                        <div class="image-uploads">
                          <i data-feather="upload" class="plus-down-add me-0"></i>
                          <h4>Upload Foto Produk</h4>
                        </div>
                      </div>
                    </div>
                    <div id="previewEdit" class="phone-img mt-3"
                      style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; border: 2px dashed #ccc; position: relative; background: #f9f9f9;">
                      <img v-if="editImageUrl" :src="editImageUrl" alt="previewImage"
                        style="width: 100%; height: 100%; display: block; object-fit: contain;" />
                      <div v-else
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; color: #888; font-size: 14px; padding: 10px;">
                        <span class="text-center">Pratinjau Gambar</span>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2" @click="closeEditModal">Batal</button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </span>
                      <span v-else>Simpan Produk</span>
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
import { Modal } from 'bootstrap'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';

defineProps({
  initialForm: Object,
  initialErrors: Object,
  editForm: Object,
  editErrors: Object,
  isSubmitting: Boolean,
  imagePreviewUrl: String,
  editImageUrl: String,
  jenisList: Array,
  kondisiList: Array,
})

const emit = defineEmits([
  'update:nama',
  'update:kondisi',
  'update:jenis',
  'update:berat',
  'update:karat',
  'update:lingkar',
  'update:panjang',
  'update:hargajual',
  'update:hargabeli',
  'update:keterangan',
  'update:editNama',
  'update:editKondisi',
  'update:editJenis',
  'update:editBerat',
  'update:editKarat',
  'update:editLingkar',
  'update:editPanjang',
  'update:editHargajual',
  'update:editHargabeli',
  'update:editKeterangan',
  'image-change',
  'edit-image-change',
  'submit-store',
  'submit-edit',
  'reset-form',
  'reset-edit-form',
])

const closeTambahModal = () => {
  const modalEl = document.getElementById('tambahProdukModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
  emit('reset-form')
}

const closeEditModal = () => {
  const modalEl = document.getElementById('editProdukModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
  emit('reset-edit-form')
}
</script>
