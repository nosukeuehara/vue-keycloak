<!-- App.vue -->
<template>
  <div class="app">
    <header>
      <nav>
        <router-link to="/">ホーム</router-link> |
        <router-link to="/profile" v-if="authStore.isAuthenticated">プロフィール</router-link>
        <template v-if="authStore.isAuthenticated">
          | <a href="#" @click.prevent="logout">ログアウト</a>
        </template>
        <template v-else>
          | <router-link to="/login">ログイン</router-link>
        </template>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = ref(authStore.isAuthenticated)

// 認証状態の変更を監視
watch(() => authStore.isAuthenticated, (newValue) => {
  isAuthenticated.value = newValue
})

// コンポーネントマウント時に認証状態を確認
onMounted(() => {
  isAuthenticated.value = authStore.isAuthenticated
})

const logout = () => {
  authStore.logout()
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>