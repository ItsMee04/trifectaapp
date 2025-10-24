<template>
  <!-- Sidebar -->
  <div class="sidebar sidebar" id="sidebar">
    <!-- Menggunakan komponen SimpleBar yang sudah didaftarkan secara global -->
    <SimpleBar :style="{ maxHeight: `${sidebarHeight}px` }" class="sidebar-inner">
      <div id="sidebar-menu" class="sidebar-menu">
        <ul>
          <!-- MAIN -->
          <li class="submenu-open" v-if="canAccess(['admin', 'owner', 'pegawai'])">
            <h6 class="submenu-hdr">Main</h6>
            <ul>
              <li :class="{ 'active': $route.path === '/dashboard' }">
                <router-link to="/dashboard">
                  <i data-feather="grid"></i><span>Dashboard</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- MASTER -->
          <li class="submenu-open" v-if="canAccess(['admin', 'owner'])">
            <h6 class="submenu-hdr">Master</h6>
            <ul>
              <!-- USER MANAGEMENT -->
              <li class="submenu" v-if="canAccess(['admin'])">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'usermanagement', 'active': activeMenuId === 'usermanagement' }"
                  @click.prevent="toggleSubmenu('usermanagement')">
                  <i data-feather="users"></i>
                  <span>User Management</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'usermanagement' ? 'block' : 'none' }">
                  <li><router-link to="/jabatan" :class="{ 'active': $route.path === '/jabatan' }">Jabatan</router-link>
                  </li>
                  <li><router-link to="/pegawai" :class="{ 'active': $route.path === '/pegawai' }">Pegawai</router-link>
                  </li>
                  <li><router-link to="/role" :class="{ 'active': $route.path === '/role' }">Role</router-link></li>
                  <li><router-link to="/user" :class="{ 'active': $route.path === '/user' }">User
                      Account</router-link></li>
                </ul>
              </li>

              <!-- PRODUK -->
              <li class="submenu" v-if="canAccess(['admin', 'pegawai'])">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'produk', 'active': activeMenuId === 'produk' }"
                  @click.prevent="toggleSubmenu('produk')">
                  <i data-feather="archive"></i>
                  <span>Produk</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'produk' ? 'block' : 'none' }">
                  <li><router-link to="/kondisi" :class="{ 'active': $route.path === '/kondisi' }">Kondisi</router-link>
                  </li>
                  <li><router-link to="/diskon" :class="{ 'active': $route.path === '/diskon' }">Diskon /
                      Promo</router-link></li>
                  <li><router-link to="/jenisproduk" :class="{ 'active': $route.path === '/jenisproduk' }">Jenis
                      Produk</router-link></li>
                  <li><router-link to="/produk" :class="{ 'active': $route.path === '/produk' }">Produk</router-link>
                  </li>
                </ul>
              </li>

              <!-- NAMPAN -->
              <li class="submenu" v-if="canAccess(['admin'])">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'nampan', 'active': activeMenuId === 'nampan' }"
                  @click.prevent="toggleSubmenu('nampan')">
                  <i data-feather="layers"></i>
                  <span>Nampan</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'nampan' ? 'block' : 'none' }">
                  <li><router-link to="/nampan" :class="{ 'active': $route.path === '/nampan' }">Nampan</router-link>
                  </li>
                  <li><router-link to="/nampanproduk" :class="{ 'active': $route.path === '/nampanproduk' }">Nampan
                      Produk</router-link></li>
                </ul>
              </li>

              <!-- PELANGGAN -->
              <li class="submenu" v-if="canAccess(['admin', 'pegawai'])">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'pelanggan', 'active': activeMenuId === 'pelanggan' }"
                  @click.prevent="toggleSubmenu('pelanggan')">
                  <i data-feather="users"></i>
                  <span>Pelanggan</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'pelanggan' ? 'block' : 'none' }">
                  <li><router-link to="/pelanggan"
                      :class="{ 'active': $route.path === '/pelanggan' }">Pelanggan</router-link>
                  </li>
                  <li><router-link to="/suplier" :class="{ 'active': $route.path === '/suplier' }">Suplier</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <!-- TRANSAKSI -->
          <li class="submenu-open" v-if="canAccess(['admin', 'pegawai', 'owner'])">
            <h6 class="submenu-hdr">Transaksi</h6>
            <ul>
              <li :class="{ 'active': $route.path === '/pos' }">
                <router-link to="/pos">
                  <i data-feather="hard-drive"></i><span>POS</span>
                </router-link>
              </li>
              <li :class="{ 'active': $route.path === '/offtake' }">
                <router-link to="/offtake">
                  <i data-feather="pocket"></i><span>Offtake</span>
                </router-link>
              </li>
              <li class="submenu">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'jenispembelian', 'active': activeMenuId === 'jenispembelian' }"
                  @click.prevent="toggleSubmenu('jenispembelian')">
                  <i data-feather="shopping-bag"></i>
                  <span>Jenis Pembelian</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'jenispembelian' ? 'block' : 'none' }">
                  <li><router-link to="/pembeliandalamtoko"
                      :class="{ 'active': $route.path === '/pembeliandalamtoko' }">Pembelian
                      Dari Toko</router-link></li>
                  <li><router-link to="/pembelianluartoko"
                      :class="{ 'active': $route.path === '/pembelianluartoko' }">Pembelian
                      Dari Luar Toko</router-link></li>
                </ul>
              </li>
              <li :class="{ 'active': $route.path === '/perbaikan' }" v-if="canAccess(['admin'])">
                <router-link to="/perbaikan">
                  <i data-feather="repeat"></i><span>Perbaikan</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- SALES -->
          <li class="submenu-open" v-if="canAccess(['admin', 'owner'])">
            <h6 class="submenu-hdr">Sales</h6>
            <ul>
              <li :class="{ 'active': $route.path === '/penjualan' }">
                <router-link to="/penjualan">
                  <i data-feather="arrow-left-circle"></i><span>Transaksi Penjualan</span>
                </router-link>
              </li>
              <li :class="{ 'active': $route.path === '/pembelian' }">
                <router-link to="/pembelian">
                  <i data-feather="arrow-right-circle"></i><span>Transaksi Pembelian</span>
                </router-link>
              </li>
              <li :class="{ 'active': $route.path === '/transaksiofftake' }">
                <router-link to="/transaksiofftake">
                  <i data-feather="arrow-up-circle"></i><span>Transaksi Offtake</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- LAPORAN -->
          <li class="submenu-open" v-if="canAccess(['owner', 'admin'])">
            <h6 class="submenu-hdr">Laporan</h6>
            <ul>
              <li class="submenu">
                <a href="javascript:void(0);"
                  :class="{ 'subdrop': openMenuId === 'laporan', 'active': activeMenuId === 'laporan' }"
                  @click.prevent="toggleSubmenu('laporan')">
                  <i data-feather="book"></i>
                  <span>Stok</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul :style="{ display: openMenuId === 'laporan' ? 'block' : 'none' }">
                  <li><router-link to="/stok-harian" :class="{ 'active': $route.path === '/stok-harian' }">Stok Produk
                      Harian</router-link></li>
                  <li><router-link to="/stok-bulanan" :class="{ 'active': $route.path === '/stok-bulanan' }">Stok Produk
                      Bulanan</router-link></li>
                </ul>
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import feather from "feather-icons";
import SimpleBar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const sidebarHeight = ref(0)
const activeMenuId = ref(null)
const openMenuId = ref(null)
const route = useRoute()

// === STORE AUTH ===
const authStore = useAuthStore()
const user = ref(null)
const userRole = ref(null)

// === SIDEBAR BEHAVIOR ===
const submenuMapping = {
  '/dashboard': 'dashboard',
  '/jabatan': 'usermanagement',
  '/pegawai': 'usermanagement',
  '/role': 'usermanagement',
  '/user': 'usermanagement',
  '/kondisi': 'produk',
  '/diskon': 'produk',
  '/jenisproduk': 'produk',
  '/produk': 'produk',
  '/nampan': 'nampan',
  '/nampanproduk': 'nampan',
  '/pelanggan': 'pelanggan',
  '/suplier': 'pelanggan',
  '/pembeliandalamtoko': 'jenispembelian',
  '/pembelianluartoko': 'jenispembelian',
  '/stok-harian': 'laporan',
  '/stok-bulanan': 'laporan',
}

// === ROLE HANDLER ===
const canAccess = (allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true
  if (!userRole.value) return false
  return allowedRoles.map(r => r.toLowerCase()).includes(userRole.value)
}

// === INIT SIDEBAR ===
const updateMenuStates = () => {
  const parentId = submenuMapping[route.path]
  if (parentId) {
    openMenuId.value = parentId
    activeMenuId.value = parentId
  } else {
    openMenuId.value = null
    activeMenuId.value = null
  }
}

const toggleSubmenu = (menuId) => {
  openMenuId.value = openMenuId.value === menuId ? null : menuId
}

const calculateSidebarHeight = () => {
  const headerHeight = 60
  sidebarHeight.value = window.innerHeight - headerHeight
}

// === LIFECYCLE ===
onMounted(() => {
  // Ambil user dari Pinia
  user.value = authStore.user
  userRole.value = authStore.user?.role?.toLowerCase() || null

  calculateSidebarHeight()
  window.addEventListener('resize', calculateSidebarHeight)
  feather.replace()
  updateMenuStates()
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateSidebarHeight)
})

// Watch route untuk update submenu aktif
watch(() => route.path, () => updateMenuStates())
</script>

<style>
.sidebar-inner {
  /* opsional, agar SimpleBar tampil full height container */
  height: 100%;
  max-height: 100%;
  width: 100%;
}
</style>
