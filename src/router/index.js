import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pictures',
    name: 'Pictures',
    component: () => import('../views/Pictures.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/picture/:id',
    name: 'PictureDetail',
    component: () => import('../views/PictureDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/Upload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-pictures',
    name: 'MyPictures',
    component: () => import('../views/MyPictures.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      try {
        await userStore.fetchUser()
        if (!userStore.isLoggedIn) {
          next({ name: 'Login', query: { redirect: to.fullPath } })
          return
        }
      } catch (error) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
    }
  }
  
  next()
})

export default router

