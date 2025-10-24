// src/main.js

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// --- Impor CSS dan JS untuk Toastify ---
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// ----------------------------------------

// Impor vue-simplebar
import SimpleBar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

import './assets/plugins/fontawesome/css/fontawesome.min.css'
import './assets/plugins/fontawesome/css/all.min.css'

import './assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate' // Diimpor

import App from './App.vue'
import router from './router'

const app = createApp(App)
// ----------------------------------------------------
// Tambahkan pendaftaran global di sini
// Ini memastikan komponen SimpleBar tersedia di mana saja
app.component('VueSimplebar', SimpleBar)
// ----------------------------------------------------

// ----------------------------------------
// --- Daftarkan Plugin Toastify ---
const toastOptions = {
  // Opsi konfigurasi umum Toastify
  autoClose: 3000, // Notifikasi akan hilang setelah 3 detik
  position: toast.POSITION.TOP_RIGHT, // Posisi default: kanan atas
  theme: 'light', // Contoh: menggunakan tema berwarna
}

app.use(Vue3Toastify, toastOptions)
// ----------------------------------------



// --- Inisialisasi dan Konfigurasi Pinia ---
const pinia = createPinia()
pinia.use(piniaPluginPersistedState) // <-- DAFTARKAN PLUGIN PERSISTENSI DI SINI

app.use(pinia) // <-- Gunakan instance Pinia yang sudah di-configure
// ------------------------------------------

app.use(router)

app.mount('#app')
