<template>
  <div class="my-pictures-page">
    <NavBar />
    <div class="container">
      <div class="page-header">
        <h1>My Pictures</h1>
        <router-link to="/upload" class="upload-link">+ Upload New Picture</router-link>
      </div>

      <div class="filters">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search pictures..."
          @input="handleSearch"
          class="search-input"
        />
        <select v-model="filters.category" @change="loadPictures" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div v-if="selectedPictures.length > 0" class="batch-actions">
        <span>{{ selectedPictures.length }} picture(s) selected</span>
        <div class="batch-buttons">
          <button @click="showBatchEditDialog = true" class="btn btn-secondary">Batch Edit</button>
          <button @click="handleBatchDelete" class="btn btn-danger">Batch Delete</button>
          <button @click="selectedPictures = []" class="btn btn-secondary">Clear Selection</button>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="pictures.length === 0" class="empty">No pictures found</div>
      <div v-else class="pictures-grid">
        <div
          v-for="picture in pictures"
          :key="picture.picId"
          class="picture-item"
          :class="{ selected: selectedPictures.includes(picture.picId) }"
        >
          <input
            type="checkbox"
            :checked="selectedPictures.includes(picture.picId)"
            @change="toggleSelect(picture.picId)"
            class="select-checkbox"
          />
          <PictureCard
            :picture="picture"
            @click="goToDetail(picture.picId)"
          />
          <div class="item-actions">
            <button @click.stop="editPictureItem(picture)" class="action-btn">Edit</button>
            <button @click.stop="deletePicture(picture.picId)" class="action-btn danger">Delete</button>
          </div>
        </div>
      </div>

      <div v-if="total > 0" class="pagination">
        <button
          @click="changePage(current - 1)"
          :disabled="current === 1"
          class="page-btn"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ current }} of {{ Math.ceil(total / pageSize) }}
        </span>
        <button
          @click="changePage(current + 1)"
          :disabled="current >= Math.ceil(total / pageSize)"
          class="page-btn"
        >
          Next
        </button>
      </div>
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

    <!-- Batch Edit Dialog -->
    <div v-if="showBatchEditDialog" class="dialog-overlay" @click="showBatchEditDialog = false">
      <div class="dialog" @click.stop>
        <h2>Batch Edit</h2>
        <form @submit.prevent="handleBatchEdit">
          <div class="form-group">
            <label>Category</label>
            <input v-model="batchEditForm.category" type="text" />
          </div>
          <div class="form-group">
            <label>Naming Rule</label>
            <input v-model="batchEditForm.nameRule" type="text" placeholder="e.g., Picture{index}" />
          </div>
          <div class="dialog-actions">
            <button type="button" @click="showBatchEditDialog = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="batchEditLoading">
              {{ batchEditLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import PictureCard from '../components/PictureCard.vue'
import { listPictureVoByPage, editPicture as editPictureApi, deletePicture as deletePictureApi, editPictureBatch, deletePictureBatch } from '../api/picture'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const pictures = ref([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(12)
const total = ref(0)
const searchText = ref('')
const categories = ref([])
const selectedPictures = ref([])

const filters = ref({
  category: ''
})

const showEditDialog = ref(false)
const editLoading = ref(false)
const editForm = ref({
  id: '',
  name: '',
  introduction: '',
  category: ''
})

const showBatchEditDialog = ref(false)
const batchEditLoading = ref(false)
const batchEditForm = ref({
  category: '',
  nameRule: ''
})

let searchTimer = null

const loadPictures = async () => {
  loading.value = true
  try {
    const params = {
      current: current.value,
      pageSize: pageSize.value,
      userId: userStore.user?.uid,
      searchText: searchText.value || undefined,
      category: filters.value.category || undefined,
      sortField: 'createTime',
      sortOrder: 'descend'
    }
    
    const result = await listPictureVoByPage(params)
    pictures.value = result.records || []
    total.value = result.total || 0
    
    // Extract categories
    const catSet = new Set()
    pictures.value.forEach(pic => {
      if (pic.tag) catSet.add(pic.tag)
    })
    categories.value = Array.from(catSet).sort()
  } catch (error) {
    console.error('Failed to load pictures:', error)
    alert('Failed to load pictures')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    current.value = 1
    loadPictures()
  }, 500)
}

const changePage = (page) => {
  current.value = page
  loadPictures()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToDetail = (id) => {
  router.push(`/picture/${id}`)
}

const toggleSelect = (id) => {
  const index = selectedPictures.value.indexOf(id)
  if (index > -1) {
    selectedPictures.value.splice(index, 1)
  } else {
    selectedPictures.value.push(id)
  }
}

const editPictureItem = (picture) => {
  editForm.value = {
    id: picture.picId,
    name: picture.title || '',
    introduction: picture.desc || '',
    category: picture.tag || ''
  }
  showEditDialog.value = true
}

const handleEdit = async () => {
  editLoading.value = true
  try {
    await editPictureApi(editForm.value)
    alert('Saved successfully')
    showEditDialog.value = false
    loadPictures()
  } catch (error) {
    alert(error.message || 'Save failed')
  } finally {
    editLoading.value = false
  }
}

const deletePicture = async (id) => {
  if (!confirm('Are you sure you want to delete this picture?')) return
  
  try {
    await deletePictureApi({ id })
    alert('Deleted successfully')
    loadPictures()
  } catch (error) {
    alert(error.message || 'Delete failed')
  }
}

const handleBatchDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedPictures.value.length} selected picture(s)?`)) return
  
  try {
    await deletePictureBatch({ pictureIdList: selectedPictures.value })
    alert('Deleted successfully')
    selectedPictures.value = []
    loadPictures()
  } catch (error) {
    alert(error.message || 'Delete failed')
  }
}

const handleBatchEdit = async () => {
  batchEditLoading.value = true
  try {
    await editPictureBatch({
      pictureIdList: selectedPictures.value,
      category: batchEditForm.value.category || undefined,
      nameRule: batchEditForm.value.nameRule || undefined
    })
    alert('Saved successfully')
    showBatchEditDialog.value = false
    selectedPictures.value = []
    loadPictures()
  } catch (error) {
    alert(error.message || 'Save failed')
  } finally {
    batchEditLoading.value = false
  }
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    try {
      await userStore.fetchUser()
    } catch (error) {
      router.push('/login')
      return
    }
  }
  loadPictures()
})
</script>

<style scoped>
.my-pictures-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
}

.upload-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  transition: opacity 0.3s;
}

.upload-link:hover {
  opacity: 0.9;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 24px;
}

.batch-buttons {
  display: flex;
  gap: 12px;
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.pictures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.picture-item {
  position: relative;
}

.picture-item.selected {
  outline: 3px solid #667eea;
  border-radius: 8px;
}

.select-checkbox {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.item-actions {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.action-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.action-btn:hover {
  background: white;
}

.action-btn.danger {
  color: #f56565;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
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

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
}

.btn-danger {
  background: #f56565;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .pictures-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>

