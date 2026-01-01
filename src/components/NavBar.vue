<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span>📷</span>
        <span>Picture Sharing Platform</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/pictures" class="nav-link">Pictures</router-link>
        <template v-if="userStore.isLoggedIn">
          <router-link to="/upload" class="nav-link">Upload</router-link>
          <router-link to="/my-pictures" class="nav-link">My Pictures</router-link>
          <div class="user-info">
            <span class="username">{{ userStore.user?.nickname || userStore.user?.account }}</span>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link register-btn">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.logo span:first-child {
  font-size: 24px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: #666;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link.router-link-active {
  color: #667eea;
  font-weight: 500;
}

.register-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  padding: 8px 16px;
  border-radius: 6px;
}

.register-btn:hover {
  opacity: 0.9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  color: #333;
  font-size: 14px;
}

.logout-btn {
  background: #f5f5f5;
  color: #666;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 20px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
