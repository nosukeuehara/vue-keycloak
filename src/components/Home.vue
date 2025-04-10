<!-- components/Home.vue -->
<template>
  <div class="home">
    <h1>ホームページ</h1>
    <p v-if="authStore.isAuthenticated">
      ようこそ、{{ authStore.username }} さん！
    </p>
    <p v-else>
      ログインしていません。<router-link to="/login">ログイン</router-link>してください。
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>