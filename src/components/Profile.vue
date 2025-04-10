<!-- components/Profile.vue -->
<template>
  <div class="profile">
    <h1>プロフィールページ</h1>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <h2>ユーザー情報</h2>
      <p><strong>ユーザー名:</strong> {{ userInfo.preferred_username }}</p>
      <p><strong>メール:</strong> {{ userInfo.email }}</p>
      <p><strong>名前:</strong> {{ userInfo.name }}</p>
      <p><strong>姓:</strong> {{ userInfo.family_name }}</p>
      <p><strong>名:</strong> {{ userInfo.given_name }}</p>
      
      <h3>ロール</h3>
      <ul>
        <li v-for="(role, idx) in roles" :key="idx">{{ role }}</li>
      </ul>
      
      <h3>トークン情報</h3>
      <p><strong>トークン期限:</strong> {{ tokenExpiration }}</p>
      <p><strong>アクセストークン:</strong>{{token}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const userInfo = ref<any>({})
const roles = ref<string[]>([])
const loading = ref(true)
const tokenExpiration = ref('')
const token = ref('')

onMounted(async () => {
  try {
    // ユーザー情報を取得
    if (authStore.keycloak) {
      userInfo.value = await authStore.keycloak.loadUserInfo()
      
      // トークンからロール情報を抽出
      const decodedToken = parseToken(authStore.keycloak.token)
      
      if (decodedToken && decodedToken.resource_access) {
        const clientRoles = decodedToken.resource_access[authStore.keycloak.clientId]?.roles || []
        roles.value = clientRoles
      }
      
      // トークン期限を計算
      const expiresIn = authStore.keycloak.tokenParsed?.exp 
        ? new Date(authStore.keycloak.tokenParsed.exp * 1000)
        : null
        
      tokenExpiration.value = expiresIn ? expiresIn.toLocaleString() : '不明'

      token.value = authStore.getToken()
    }
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました', error)
  } finally {
    loading.value = false
  }
})

// JWTトークンをパースする関数
function parseToken(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  } catch (error) {
    console.error('トークンのパースに失敗しました', error)
    return null
  }
}
</script>