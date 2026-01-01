<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="title">CloudPic Photo Sharing</h1>
      <h2 class="subtitle">Register</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="account">Account</label>
          <input
            id="account"
            v-model="form.userAccount"
            type="text"
            placeholder="Enter your account"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.userPassword"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div class="form-group">
          <label for="checkPassword">Confirm Password</label>
          <input
            id="checkPassword"
            v-model="form.checkPassword"
            type="password"
            placeholder="Enter your password again"
            required
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
        <div class="link-text">
          Already have an account?
          <router-link to="/login">Login now</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/user'

const router = useRouter()

const form = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

const loading = ref(false)

const handleRegister = async () => {
  if (loading.value) return
  
  if (form.value.userPassword !== form.value.checkPassword) {
    alert('Passwords do not match')
    return
  }
  
  loading.value = true
  try {
    await register(form.value)
    alert('Registration successful, please login')
    router.push('/login')
  } catch (error) {
    alert(error.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 30px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  transition: opacity 0.3s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.link-text a {
  color: #667eea;
  font-weight: 500;
}

.link-text a:hover {
  text-decoration: underline;
}
</style>
