<template>
  <div class="main-wrapper">
    <Header />
    <Navbar />
    <main class="page-wrapper">
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';

import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import feather from 'feather-icons'

// Set atribut HTML untuk layout horizontal DreamsPOS
onMounted(() => {
  feather.replace()
})
</script>
