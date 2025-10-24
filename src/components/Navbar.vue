<template>
  <!-- Sidebar -->
  <div class="sidebar sidebar" id="sidebar">
    <!-- Menggunakan komponen SimpleBar yang sudah didaftarkan secara global -->
    <SimpleBar :style="{ maxHeight: `${sidebarHeight}px` }" class="sidebar-inner">
      <div id="sidebar-menu" class="sidebar-menu">
        <ul>
          <li class="submenu-open">
            <h6 class="submenu-hdr">Main</h6>
            <ul>
              <li class="submenu">
                <!-- data-feather ikon di sini -->
                <a href="javascript:void(0);" class="subdrop active"><i
                    data-feather="grid"></i><span>Dashboard</span><span class="menu-arrow"></span></a>
                <ul>
                  <li><a href="index.html" class="active">Admin Dashboard</a></li>
                  <li><a href="sales-dashboard.html">Sales Dashboard</a></li>
                </ul>
              </li>
              <li class="submenu">
                <a href="javascript:void(0);"><i data-feather="smartphone"></i><span>Application</span><span
                    class="menu-arrow"></span></a>
                <ul>
                  <li><a href="chat.html">Chat</a></li>
                  <li class="submenu submenu-two"><a href="javascript:void(0);">Call<span
                        class="menu-arrow inside-submenu"></span></a>
                    <ul>
                      <li><a href="video-call.html">Video Call</a></li>
                      <li><a href="audio-call.html">Audio Call</a></li>
                      <li><a href="call-history.html">Call History</a></li>
                    </ul>
                  </li>
                  <li><a href="calendar.html">Calendar</a></li>
                  <li><a href="email.html">Email</a></li>
                  <li><a href="todo.html">To Do</a></li>
                  <li><a href="notes.html">Notes</a></li>
                  <li><a href="file-manager.html">File Manager</a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="submenu-open">
            <h6 class="submenu-hdr">Inventory</h6>
            <ul>
              <li><a href="product-list.html"><i data-feather="box"></i><span>Products</span></a></li>
              <li><a href="add-product.html"><i data-feather="plus-square"></i><span>Create
                    Product</span></a></li>
              <li><a href="expired-products.html"><i data-feather="codesandbox"></i><span>Expired
                    Products</span></a></li>
              <li><a href="low-stocks.html"><i data-feather="trending-down"></i><span>Low
                    Stocks</span></a></li>
              <li><a href="category-list.html"><i data-feather="codepen"></i><span>Category</span></a>
              </li>
              <li><a href="sub-categories.html"><i data-feather="speaker"></i><span>Sub
                    Category</span></a></li>
              <li><a href="brand-list.html"><i data-feather="tag"></i><span>Brands</span></a></li>
              <li><a href="units.html"><i data-feather="speaker"></i><span>Units</span></a></li>
              <li><a href="varriant-attributes.html"><i data-feather="layers"></i><span>Variant
                    Attributes</span></a></li>
              <li><a href="warranty.html"><i data-feather="bookmark"></i><span>Warranties</span></a>
              </li>
              <li><a href="barcode.html"><i data-feather="align-justify"></i><span>Print
                    Barcode</span></a></li>
              <li><a href="qrcode.html"><i data-feather="maximize"></i><span>Print QR Code</span></a>
              </li>
            </ul>
          </li>
          <li class="submenu-open">
            <h6 class="submenu-hdr">Stock</h6>
            <ul>
              <li><a href="manage-stocks.html"><i data-feather="package"></i><span>Manage
                    Stock</span></a></li>
              <li><a href="stock-adjustment.html"><i data-feather="clipboard"></i><span>Stock
                    Adjustment</span></a></li>
              <li><a href="stock-transfer.html"><i data-feather="truck"></i><span>Stock
                    Transfer</span></a></li>
            </ul>
          </li>
          <li class="submenu-open">
            <h6 class="submenu-hdr">Sales</h6>
            <ul>
              <li><a href="sales-list.html"><i data-feather="shopping-cart"></i><span>Sales</span></a>
              </li>
              <li><a href="invoice-report.html"><i data-feather="file-text"></i><span>Invoices</span></a></li>
              <li><a href="sales-returns.html"><i data-feather="copy"></i><span>Sales
                    Return</span></a></li>
              <li><a href="quotation-list.html"><i data-feather="save"></i><span>Quotation</span></a>
              </li>
              <li><a href="pos.html"><i data-feather="hard-drive"></i><span>POS</span></a></li>
            </ul>
          </li>
          <li class="submenu-open">
            <h6 class="submenu-hdr">Promo</h6>
            <ul>
              <li><a href="coupons.html"><i data-feather="shopping-cart"></i><span>Coupons</span></a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </SimpleBar>
  </div>
  <!-- /Sidebar -->

  <!-- Logika class dan event klik dipertahankan untuk menutup sidebar -->
  <div class="sidebar-overlay"></div>
</template>

<script setup>
import { onMounted, onUnmounted, onBeforeUnmount, ref, nextTick } from 'vue';
import SimpleBar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

const sidebarHeight = ref(0)

onMounted(() => {
    calculateSidebarHeight()
    window.addEventListener('resize', calculateSidebarHeight)
})

onUnmounted(() => {
    window.removeEventListener('resize', calculateSidebarHeight)
})

const calculateSidebarHeight = () => {
    const headerHeight = 60
    sidebarHeight.value = window.innerHeight - headerHeight
}

</script>

<style>
.sidebar-inner {
  /* opsional, agar SimpleBar tampil full height container */
  height: 100%;
  max-height: 100%;
}
</style>
