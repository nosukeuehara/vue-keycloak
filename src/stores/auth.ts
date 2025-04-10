// stores/auth.ts
import { defineStore } from 'pinia'
import type Keycloak from 'keycloak-js'

interface AuthState {
  keycloak: Keycloak | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    keycloak: null,
    isAuthenticated: false
  }),

  getters: {
    username: (state) => {
      return state.keycloak?.tokenParsed?.preferred_username || ''
    }
  },

  actions: {
    setKeycloak(keycloak: Keycloak) {
      this.keycloak = keycloak
    },

    setAuthenticated(authenticated: boolean) {
      this.isAuthenticated = authenticated
    },

    login() {
      if (this.keycloak) {
        this.keycloak.login()
      }
    },

    logout() {
      if (this.keycloak) {
        this.keycloak.logout()
      }
    },

    async updateToken() {
      if (this.keycloak) {
        try {
          await this.keycloak.updateToken(70)
          return true
        } catch (error) {
          console.error('トークンの更新に失敗しました', error)
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