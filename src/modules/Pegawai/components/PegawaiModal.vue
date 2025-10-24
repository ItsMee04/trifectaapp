<template>
  <Teleport to="body">
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="pegawaiModalLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>{{ isEditMode ? 'EDIT PEGAWAI' : 'TAMBAH PEGAWAI' }}</h4>
                </div>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <!-- STRUKTUR FORM -->
              <div class="modal-body custom-modal-body">
                <!-- Penting: Panggil submitForm di sini -->
                <form @submit.prevent="submitForm">
                  <div class="row">
                    <!-- Input NIP (kiri) -->
                    <div class="mb-3 col-md-6">
                      <label class="form-label">NIP
                        <span class="text-danger ms-1">*</span>
                      </label>
                      <!-- FIX: Ganti v-model dari localForm.nip menjadi props.initialForm.nip -->
                      <input type="text" v-model="initialForm.nip" class="form-control"
                        :class="{ 'is-invalid': initialErrors.nip }">
                      <div class="invalid-feedback" v-if="initialErrors.nip">
                        {{ initialErrors.nip }}
                      </div>
                    </div>
                    <!-- Input NAMA (kanan) -->
                    <div class="mb-3 col-md-6">
                      <label class="form-label">NAMA<span class="text-danger ms-1">*</span></label>
                      <!-- FIX: Ganti v-model dari localForm.nama menjadi props.initialForm.nama -->
                      <input type="text" v-model="initialForm.nama" class="form-control"
                        :class="{ 'is-invalid': initialErrors.nama }">
                      <div class="invalid-feedback" v-if="initialErrors.nama">
                        {{ initialErrors.nama }}
                      </div>
                    </div>
                  </div>

                  <!-- Input ALAMAT -->
                  <div class="mb-3">
                    <label class="form-label">ALAMAT<span class="text-danger ms-1">*</span></label>
                    <!-- FIX: Ganti v-model dari localForm.alamat menjadi props.initialForm.alamat -->
                    <textarea v-model="initialForm.alamat" class="form-control" cols="30" rows="4"
                      :class="{ 'is-invalid': initialErrors.alamat }"></textarea>
                    <div class="invalid-feedback" v-if="initialErrors.alamat">
                      {{ initialErrors.alamat }}
                    </div>
                  </div>

                  <!-- Input KONTAK -->
                  <div class="mb-3">
                    <label class="form-label">KONTAK<span class="text-danger ms-1">*</span></label>
                    <!-- FIX: Ganti v-model dari localForm.kontak menjadi props.initialForm.kontak -->
                    <input type="text" v-model="initialForm.kontak" class="form-control"
                      :class="{ 'is-invalid': initialErrors.kontak }">
                    <div class="invalid-feedback" v-if="initialErrors.kontak">
                      {{ initialErrors.kontak }}
                    </div>
                  </div>

                  <!-- Input JABATAN -->
                  <div class="mb-3">
                    <label class="form-label">JABATAN<span class="text-danger ms-1">*</span></label>
                    <div>
                      <!-- FIX: Ganti v-model dari localForm.jabatan menjadi props.initialForm.jabatan -->
                      <VueMultiselect v-model="initialForm.jabatan" :options="jabatanList" :multiple="false"
                        :close-on-select="true" placeholder="Pilih Jabatan" label="jabatan" track-by="id"
                        :class="{ 'is-invalid-multiselect': initialErrors.jabatan }"></VueMultiselect>
                    </div>
                    <div class="invalid-feedback d-block" v-if="initialErrors.jabatan">
                      {{ initialErrors.jabatan }}
                    </div>
                  </div>

                  <!-- AVATAR UPLOAD DAN PREVIEW -->
                  <div class="add-choosen">
                    <div class="mb-3">
                      <label class="form-label">AVATAR</label>
                      <div class="image-upload">
                        <input type="file" name="imagePegawai" id="imagePegawai" @change="handleFileChange" accept="image/*">
                        <div class="image-uploads">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="plus-down-add me-0">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <h4>UPLOAD AVATAR</h4>
                        </div>
                      </div>
                    </div>
                    <!-- Area Pratinjau Gambar -->
                    <div class="phone-img mt-3"
                      style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px; border: 2px dashed #ccc; position: relative; background: #f9f9f9;">
                      <img v-if="currentImagePreview" :src="currentImagePreview" alt="previewImage"
                        style="width: 100%; height: 100%; display: block; object-fit: cover;">
                      <div v-else
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; color: #888; font-size: 14px; padding: 10px;">
                        <span class="text-center">Pratinjau Gambar</span>
                      </div>
                    </div>
                  </div>

                  <!-- Tombol Aksi -->
                  <div class="modal-footer-btn">
                    <button type="button" class="btn btn-warning me-2" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </span>
                      <span v-else>
                        {{ isEditMode ? 'Perbarui Pegawai' : 'Simpan Pegawai' }}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
              <!-- AKHIR DARI STRUKTUR FORM -->

            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';


const props = defineProps({
  id: { type: String, required: true },
  // FIX: initialForm sekarang langsung digunakan sebagai model
  initialForm: { type: Object, required: true },
  initialErrors: { type: Object, required: true },
  jabatanList: { type: Array, required: true },
  isEditMode: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },

  // URL Pratinjau untuk mode Tambah (imagePreviewUrl dari Composable)
  imagePreviewUrl: { type: String, default: null },
  // URL Pratinjau untuk mode Edit (editImageUrl dari Composable)
  editImageUrl: { type: String, default: null },
});

const emit = defineEmits(['submit-form', 'image-change', 'reset-form']);


// Computed property untuk menentukan URL pratinjau mana yang ditampilkan
const currentImagePreview = computed(() => {
  return props.isEditMode ? props.editImageUrl : props.imagePreviewUrl;
});


// Menangani perubahan file
const handleFileChange = (event) => {
  const file = event.target.files[0];
  // Emit event ke parent (PegawaiPage.vue) untuk memproses file dan URL pratinjau
  emit('image-change', file);

  // Penting: Jangan reset input file di sini agar file tetap terlampir sebelum submit.
};

// Menangani submit
const submitForm = () => {
  // Emit event ke parent untuk memanggil aksi Store/Update
  emit('submit-form');
};

// Pastikan ada logic reset saat modal ditutup
onMounted(() => {
  const modalElement = document.getElementById(props.id);
  if (modalElement) {
    // Emit event reset-form ketika modal ditutup
    modalElement.addEventListener('hidden.bs.modal', () => {
      emit('reset-form');
      // Secara manual reset input file untuk memastikan file tidak tersimpan di form setelah ditutup
      const fileInput = document.getElementById('imagePegawai');
      if (fileInput) {
        fileInput.value = '';
      }
    });
  }
});

// FIX: Menghapus kode yang tidak perlu (localForm dan watcher-nya)
// const localForm = ref({});
// watch(() => props.initialForm, (newVal) => {
//   if (JSON.stringify(localForm.value) !== JSON.stringify(newVal)) {
//     localForm.value = { ...newVal };
//   }
// }, { deep: true, immediate: true });
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
/* Tambahkan sedikit styling untuk memastikan multiselect terlihat valid saat error */
.is-invalid-multiselect .multiselect__select {
  border-color: #dc3545 !important;
}
</style>
