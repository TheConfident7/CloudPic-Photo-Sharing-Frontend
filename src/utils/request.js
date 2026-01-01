import axios from 'axios'

const request = axios.create({
  baseURL: 'https://scaleblemultimediasharingbackend-whw-exf0gpd5fmgkd3er.francecentral-01.azurewebsites.net/api',
  timeout: 10000,
  withCredentials: true
})

// Request interceptor
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 0) {
      return res.data
    } else {
      return Promise.reject(new Error(res.message || 'Request failed'))
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request

