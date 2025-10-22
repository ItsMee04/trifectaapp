<template>
  <div class="login-content user-login">
    <div class="login-logo">
      <img src="/src/assets/img/logo.png" alt="img" />
      <a href="index.html" class="login-logo logo-white">
        <img src="/src/assets/img/logo-white.png" alt />
      </a>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="login-userset">
        <div class="login-userheading">
          <h3>Sign In</h3>
          <h4>Access the Dreamspos panel using your email and passcode.</h4>
        </div>

        <BaseInput v-model="email" label="Email Address" icon="/src/assets/img/icons/mail.svg" type="text" />

        <div class="form-login">
          <label>Password</label>
          <div class="pass-group">
            <input :type="passwordFieldType" v-model="password" class="pass-input" />

            <span class="fas toggle-password" :class="{
              'fa-eye': passwordFieldType === 'text',
              'fa-eye-slash': passwordFieldType === 'password'
            }" @click="togglePasswordVisibility"></span>
          </div>
        </div>

        <div class="form-login">
          <button class="btn btn-login" type="submit" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // <-- Pastikan onMounted diimpor
import BaseInput from '@/modules/Auth/components/common/BaseInput.vue';
import { useAuthStore } from '@/stores/authStore';

// State lokal form
const email = ref('');
const password = ref('');
const passwordFieldType = ref('password');
const rememberMe = ref(false); // <-- State baru untuk checkbox

// Inisialisasi Store
const authStore = useAuthStore();

// --- LOGIKA MEMUAT EMAIL SAAT KOMPONEN DIMUAT ---
onMounted(() => {
  // Cek apakah ada email yang tersimpan di Pinia Store
  const storedEmail = authStore.rememberedEmail;
  if (storedEmail) {
    email.value = storedEmail;
    rememberMe.value = true; // Set checkbox menjadi true
  }
});
// ------------------------------------------------

// Fungsi untuk mengubah tipe input
const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

// Logika Utama Login
const handleLogin = async () => {
  if (!email.value || !password.value) {
    return;
  }

  try {
    // Panggil action loginUser dari Pinia Store
    await authStore.loginUser({
      email: email.value,
      password: password.value,
    });

    // --- LOGIKA MENYIMPAN/MENGHAPUS EMAIL DI PINIA SETELAH SUKSES ---
    // Logika ini hanya dieksekusi jika loginUser berhasil (tidak throw error)
    if (rememberMe.value) {
      // Simpan email terakhir yang digunakan ke Pinia (yang kemudian di-persist)
      authStore.rememberedEmail = email.value;
    } else {
      // Hapus email yang tersimpan
      authStore.rememberedEmail = null;
    }
    // ------------------------------------------------------------

  } catch (error) {
    // Penanganan error sudah dilakukan di Pinia Store, kita hanya mencatat di sini.
    console.error('Login failed at component level.');
  }
};
</script>
