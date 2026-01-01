import request from '../utils/request'

/**
 * Upload picture (file)
 */
export function uploadPicture(formData) {
  return request({
    url: '/picture/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * Delete picture
 */
export function deletePicture(data) {
  return request({
    url: '/picture/delete',
    method: 'post',
    data
  })
}

/**
 * Batch delete pictures
 */
export function deletePictureBatch(data) {
  return request({
    url: '/picture/delete/batch',
    method: 'post',
    data
  })
}

/**
 * Edit picture
 */
export function editPicture(data) {
  return request({
    url: '/picture/edit',
    method: 'post',
    data
  })
}

/**
 * Batch edit pictures
 */
export function editPictureBatch(data) {
  return request({
    url: '/picture/edit/batch',
    method: 'post',
    data
  })
}

/**
 * Get picture by id
 */
export function getPictureById(id) {
  return request({
    url: '/picture/get',
    method: 'get',
    params: { id }
  })
}

/**
 * Get picture by id (VO)
 */
export function getPictureVoById(id) {
  return request({
    url: '/picture/get/vo',
    method: 'get',
    params: { id }
  })
}

/**
 * Get picture list by page
 */
export function listPictureByPage(data) {
  return request({
    url: '/picture/list/page',
    method: 'post',
    data
  })
}

/**
 * Get picture list by page (VO)
 */
export function listPictureVoByPage(data) {
  return request({
    url: '/picture/list/page/vo',
    method: 'post',
    data
  })
}

