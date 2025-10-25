<!-- modules/Produk/components/ProdukViewModal.vue -->
<template>
  <Teleport to="body">
    <div class="modal fade" id="viewProdukModal" tabindex="-1" aria-labelledby="viewProdukModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-xl modal-dialog-centered custom-modal-two">
        <div class="modal-content">
          <div class="page-wrapper-new p-0">
            <div class="content">
              <div class="modal-header border-0 custom-modal-header">
                <div class="page-title">
                  <h4>VIEW PRODUK</h4>
                </div>
                <button type="button" class="close" @click="closeViewModal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body custom-modal-body">
                <div class="row">
                  <div class="col-lg-8 col-sm-12">
                    <div class="card">
                      <div class="card-body">
                        <div class="productdetails">
                          <ul class="product-bar">
                            <li>
                              <h4>KODE PRODUK</h4>
                              <h6>{{ viewForm.kodeproduk }}</h6>
                            </li>
                            <li>
                              <h4>JENIS PRODUK</h4>
                              <h6>{{ viewForm.jenis_label }}</h6>
                            </li>
                            <li>
                              <h4>BERAT</h4>
                              <h6>{{ viewForm.berat }} Gram</h6>
                            </li>
                            <li>
                              <h4>KARAT</h4>
                              <h6>{{ viewForm.karat }} K</h6>
                            </li>
                            <li>
                              <h4>LINGKAR</h4>
                              <h6>{{ viewForm.lingkar }} Cm</h6>
                            </li>
                            <li>
                              <h4>PANJANG</h4>
                              <h6>{{ viewForm.panjang }} Cm</h6>
                            </li>
                            <li>
                              <h4>HARGA / GRAM</h4>
                              <h6>{{ formatRupiah(viewForm.hargajual) }}</h6>
                            </li>
                            <li>
                              <h4>STATUS</h4>
                              <h6 v-if="viewForm.status === 1">
                                <span class="badge bg-success">In Stok</span>
                              </h6>
                              <h6 v-else>
                                <span class="badge bg-danger">Out Stok</span>
                              </h6>
                            </li>
                            <li>
                              <h4>KETERANGAN</h4>
                              <h6>{{ viewForm.keterangan }}</h6>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-sm-12">
                    <div class="product-box">
                      <div class="card">
                        <div class="card-body">
                          <div class="slider-product-details">
                            <div class="owl-carousel owl-theme product-slide">
                              <div class="slider-product">
                                <img :src="viewForm.existing_image_url" alt="img" class="responsive-image" />
                                <h4>{{ viewForm.kodeproduk + '.png' }}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

defineProps({
  viewForm: Object,
})

const emit = defineEmits(['reset-view-form'])

const closeViewModal = () => {
  const modalEl = document.getElementById('viewProdukModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
  emit('reset-view-form')
}

const formatRupiah = (value) => {
  if (isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.product-box {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card {
  border: none;
  height: 100%;
}

.card-body {
  height: 100%;
}

.responsive-image {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

.slider-product-details,
.owl-carousel,
.slider-product {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
