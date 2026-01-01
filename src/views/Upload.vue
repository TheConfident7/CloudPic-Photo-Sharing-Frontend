<template>
  <div class="upload-page">
    <NavBar />
    <div class="container">
      <h1>Upload Pictures</h1>
      
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileSelect"
            style="display: none"
          />
          <div v-if="!uploadingFiles.length" class="upload-placeholder">
            <div class="upload-icon">📤</div>
            <p>Click or drag images here to upload</p>
            <p class="hint">Support multiple image uploads</p>
          </div>
          <div v-else class="file-list">
            <div v-for="(file, index) in uploadingFiles" :key="index" class="file-item">
              <img :src="file.preview" alt="" class="file-preview" />
              <div class="file-info">
                <input
                  v-model="file.name"
                  type="text"
                  placeholder="Picture name"
                  class="file-name-input"
                />
                <p class="hint-text">You can edit and add description and category in "My Pictures" after upload</p>
              </div>
              <div class="file-actions">
                <button
                  @click.stop="uploadFile(file, index)"
                  :disabled="file.uploading"
                  class="btn btn-primary"
                >
                  {{ file.uploading ? 'Uploading...' : 'Upload' }}
                </button>
                <button
                  @click.stop="removeFile(index)"
                  class="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { uploadPicture } from '../api/picture'

const router = useRouter()

const fileInput = ref(null)
const uploadingFiles = ref([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  addFiles(files)
}

const addFiles = (files) => {
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadingFiles.value.push({
        file,
        preview: e.target.result,
        name: file.name.replace(/\.[^/.]+$/, ''),
        uploading: false
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeFile = (index) => {
  uploadingFiles.value.splice(index, 1)
}

const uploadFile = async (fileItem, index) => {
  fileItem.uploading = true
  try {
    const formData = new FormData()
    formData.append('file', fileItem.file)
    formData.append('pictureName', fileItem.name)
    
    await uploadPicture(formData)
    alert('Upload successful')
    uploadingFiles.value.splice(index, 1)
    
    if (uploadingFiles.value.length === 0) {
      router.push('/my-pictures')
    }
  } catch (error) {
    alert(error.message || 'Upload failed')
  } finally {
    fileItem.uploading = false
  }
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 32px;
}

.upload-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-area {
  min-height: 300px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #667eea;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.upload-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.hint {
  font-size: 12px;
  margin-top: 8px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.file-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  align-items: start;
}

.file-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-name-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.file-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
}

.btn-danger {
  background: #f56565;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .file-item {
    grid-template-columns: 1fr;
  }
  
  .file-actions {
    flex-direction: row;
  }
}
</style>
