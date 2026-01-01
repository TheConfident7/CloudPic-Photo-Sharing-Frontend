<template>
  <div class="picture-detail-page">
    <NavBar />
    <div class="container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="picture" class="detail-content">
        <div class="image-section">
          <img :src="picture.imageUrl" :alt="picture.title" class="detail-image" />
        </div>
        <div class="info-section">
          <h1 class="title">{{ picture.title || 'Untitled' }}</h1>
          <div v-if="picture.desc" class="desc">
            <h3>Description</h3>
            <p>{{ picture.desc }}</p>
          </div>
          <div class="meta">
            <div class="meta-item">
              <span class="label">Category:</span>
              <span class="value">{{ picture.tag || 'Uncategorized' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Size:</span>
              <span class="value">{{ formatSize(picture.size) }}</span>
            </div>
            <div v-if="picture.width && picture.height" class="meta-item">
              <span class="label">Dimensions:</span>
              <span class="value">{{ picture.width }} × {{ picture.height }}</span>
            </div>
            <div v-if="picture.format" class="meta-item">
              <span class="label">Format:</span>
              <span class="value">{{ picture.format }}</span>
            </div>
            <div v-if="picture.uploadTime" class="meta-item">
              <span class="label">Upload Time:</span>
              <span class="value">{{ formatDate(picture.uploadTime) }}</span>
            </div>
            <div v-if="picture.uploader" class="meta-item">
              <span class="label">Uploader:</span>
              <span class="value">{{ picture.uploader.nickname || picture.uploader.account }}</span>
            </div>
          </div>
          <div v-if="isOwner" class="actions">
            <button @click="showEditDialog = true" class="btn btn-primary">Edit</button>
            <button @click="handleDelete" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="error">Picture not found</div>
    </div>

    <!-- Edit Dialog -->
    <div v-if="showEditDialog" class="dialog-overlay" @click="showEditDialog = false">
      <div class="dialog" @click.stop>
        <h2>Edit Picture Information</h2>
        <form @submit.prevent="handleEdit">
          <div class="form-group">
            <label>Name</label>
            <input v-model="editForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editForm.introduction" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Category</label>
            <input v-model="editForm.category" type="text" />
          </div>
          <div class="dialog-actions">
            <button type="button" @click="showEditDialog = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="editLoading">
              {{ editLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { getPictureVoById, editPicture, deletePicture } from '../api/picture'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const picture = ref(null)
const loading = ref(false)
const showEditDialog = ref(false)
const editLoading = ref(false)

const editForm = ref({
  name: '',
  introduction: '',
  category: ''
})

const isOwner = computed(() => {
  return userStore.isLoggedIn && picture.value && 
         userStore.user?.uid === picture.value.uploaderId
})

const loadPicture = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const data = await getPictureVoById(id)
    picture.value = data
    editForm.value = {
      name: data.title || '',
      introduction: data.desc || '',
      category: data.tag || ''
    }
  } catch (error) {
    console.error('Failed to load picture:', error)
    alert('Failed to load picture')
  } finally {
    loading.value = false
  }
}

const handleEdit = async () => {
  editLoading.value = true
  try {
    await editPicture({
      id: picture.value.picId,
      name: editForm.value.name,
      introduction: editForm.value.introduction,
      category: editForm.value.category
    })
    alert('Saved successfully')
    showEditDialog.value = false
    loadPicture()
  } catch (error) {
    alert(error.message || 'Save failed')
  } finally {
    editLoading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this picture?')) return
  
  try {
    await deletePicture({ id: picture.value.picId })
    alert('Deleted successfully')
    router.push('/pictures')
  } catch (error) {
    alert(error.message || 'Delete failed')
  }
}

const formatSize = (bytes) => {
  if (!bytes) return 'Unknown'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US')
}

onMounted(() => {
  loadPicture()
})
</script>

<style scoped>
.picture-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-section {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.detail-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.desc h3 {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.desc p {
  color: #333;
  line-height: 1.6;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
}

.dialog h2 {
  margin-bottom: 24px;
  color: #333;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #667eea;
  outline: none;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
  }
  
  .image-section {
    position: static;
  }
}
</style>

