import request from '../utils/request'

/**
 * User register
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * User login
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * Get current logged in user
 */
export function getLoginUser() {
  return request({
    url: '/user/get/login',
    method: 'get'
  })
}

/**
 * User logout
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

