<!-- components/Login.vue -->
<template>
  <div class="login">
    <h1>ログインページ</h1>
    <button @click="login" class="login-button">Keycloakでログイン</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const login = () => {
  authStore.login()
}
</script>

<style scoped>
.login-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}
</style>