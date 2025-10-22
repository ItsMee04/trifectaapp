<template>
  <div class="account-page">
    <div class="main-wrapper">
      <div class="account-content">
        <div class="login-wrapper login-new">
          <div class="container">
            <LoginForm />

            <div class="my-4 d-flex justify-content-center align-items-center copyright-text">
              <p>Copyright &copy; 2023 DreamsPOS. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/modules/Auth/components/LoginForm.vue';
// Logika autentikasi dan routing akan ada di sini atau di LoginForm.vue
</script>
