// stores/auth.ts
import { defineStore } from 'pinia'
import type Keycloak from 'keycloak-js'

interface AuthState {
  keycloak: Keycloak | null
  isAuthenticated: boolean
  tokenRefreshInterval: number | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    keycloak: null,
    isAuthenticated: false,
    tokenRefreshInterval: null
  }),

  getters: {
    username: (state) => {
      return state.keycloak?.tokenParsed?.preferred_username || ''
    }
  },

  actions: {
    setKeycloak(keycloak: Keycloak) {
      this.keycloak = keycloak

      // トークン更新のイベントリスナーを追加
      keycloak.onTokenExpired = () => {
        console.log('トークンが期限切れになりました。更新を試みます。')
        this.updateToken()
      }

      // 認証状態変更のイベントリスナーを追加
      keycloak.onAuthSuccess = () => {
        console.log('認証に成功しました')
        this.isAuthenticated = true
        this.setupTokenRefresh()
      }

      keycloak.onAuthLogout = () => {
        console.log('ログアウトしました')
        this.isAuthenticated = false
        this.clearTokenRefresh()
      }
    },

    setAuthenticated(authenticated: boolean) {
      this.isAuthenticated = authenticated
      if (authenticated) {
        this.setupTokenRefresh()
      } else {
        this.clearTokenRefresh()
      }
    },

    setupTokenRefresh() {
      // 既存のインターバルをクリア
      this.clearTokenRefresh()

      // 新しいトークン更新インターバルを設定
      this.tokenRefreshInterval = window.setInterval(() => {
        this.updateToken()
      }, 60000) as unknown as number
    },

    clearTokenRefresh() {
      if (this.tokenRefreshInterval) {
        clearInterval(this.tokenRefreshInterval)
        this.tokenRefreshInterval = null
      }
    },

    login() {
      if (this.keycloak) {
        this.keycloak.login()
      }
    },

    logout() {
      if (this.keycloak) {
        this.clearTokenRefresh()
        this.keycloak.logout()
      }
    },

    async updateToken() {
      if (this.keycloak) {
        try {
          const refreshed = await this.keycloak.updateToken(70)
          if (refreshed) {
            console.log('トークンが更新されました')
          }
          return true
        } catch (error) {
          console.error('トークンの更新に失敗しました', error)
          this.isAuthenticated = false
          return false
        }
      }
      return false
    },

    getToken() {
      return this.keycloak?.token
    }
  }
})