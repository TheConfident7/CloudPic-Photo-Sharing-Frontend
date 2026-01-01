import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUser, logout as logoutApi } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  // Set user info
  function setUser(userData) {
    user.value = userData
    isLoggedIn.value = !!userData
  }

  // Get current logged in user
  async function fetchUser() {
    try {
      const userData = await getLoginUser()
      setUser(userData)
      return userData
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  // Logout
  async function logout() {
    try {
      await logoutApi()
    } finally {
      setUser(null)
    }
  }

  return {
    user,
    isLoggedIn,
    setUser,
    fetchUser,
    logout
  }
})

