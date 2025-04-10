import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Home from './components/Home.vue'
import Profile from './components/Profile.vue'
import Login from './components/Login.vue'

// Pinia ストアの初期化
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ルーターの設定
const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Keycloak 設定
const initKeycloak = async () => {
  const keycloak = new Keycloak({
    url: "https://otp.localhost:12180",
    realm: "schub",
    clientId: "ecn-client",
  });

  try {
    // まず現在の URL にクエリパラメータが含まれているか確認
    if (window.location.search) {
      console.log("URL には認証パラメータが含まれています:", window.location.search);
    }

    // Keycloak の初期化
    const authenticated = await keycloak.init({
      pkceMethod: "S256",
      responseMode: "query",
      flow: "standard",
      checkLoginIframe: false,
      enableLogging: true,
      useNonce: true,
      scope: "openid email profile",
      redirectUri: "http://localhost:3000/profile",
    });

    const authStore = useAuthStore();
    authStore.setKeycloak(keycloak);
    authStore.setAuthenticated(authenticated);

    console.log("認証状態:", authenticated);

    // URL クリーンアップを setTimeout で遅延実行
    setTimeout(() => {
      if (window.location.search) {
        console.log("URL クリーンアップを実行します");
        const baseUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, baseUrl);
        console.log("新しい URL:", window.location.href);
      }
    }, 500);  // 500ms 待ってから実行

    // トークンの自動更新設定
    if (authenticated) {
      setInterval(() => {
        keycloak.updateToken(70).catch(() => {
          console.error('Failed to refresh token');
          authStore.logout();
        });
      }, 60000);
    }

    // ルートガード設定
    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (authStore.isAuthenticated) {
          next();
        } else {
          next('/login');
        }
      } else {
        next();
      }
    });

    // アプリケーション起動
    app.use(router);
    app.mount('#app');

  } catch (error) {
    console.error('Keycloak initialization failed', error);
  }
};
// Keycloak初期化を実行
initKeycloak()