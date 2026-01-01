<template>
  <div class="home">
    <NavBar />
    <div class="hero">
      <div class="hero-content">
        <h1>Discover and Share Beautiful Pictures</h1>
        <p>Upload, browse, and manage your picture collection</p>
        <div class="hero-buttons">
          <router-link to="/pictures" class="btn btn-primary">Browse Pictures</router-link>
          <router-link v-if="userStore.isLoggedIn" to="/upload" class="btn btn-secondary">Upload Pictures</router-link>
          <router-link v-else to="/login" class="btn btn-secondary">Login to Upload</router-link>
        </div>
      </div>
    </div>
    <div class="features">
      <div class="container">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📤</div>
            <h3>Easy Upload</h3>
            <p>Simple and fast file upload</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Quickly search and filter the pictures you need</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📁</div>
            <h3>Category Management</h3>
            <p>Organize your pictures with tags and categories</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast Loading</h3>
            <p>Optimized image loading and thumbnail display</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    try {
      await userStore.fetchUser()
    } catch (error) {
      // Not logged in, ignore error
    }
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
  font-weight: bold;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.2s, opacity 0.2s;
  display: inline-block;
}

.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.features {
  padding: 80px 20px;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 48px;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 32px;
  border-radius: 12px;
  background: #f9f9f9;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .features h2 {
    font-size: 28px;
  }
}
</style>
