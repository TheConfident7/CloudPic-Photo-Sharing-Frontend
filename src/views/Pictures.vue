<template>
  <div class="pictures-page">
    <NavBar />
    <div class="container">
      <div class="page-header">
        <h1>Picture Gallery</h1>
        <div class="search-bar">
          <input
            v-model="searchText"
            type="text"
            placeholder="Search by name, description, category..."
            @input="handleSearch"
            class="search-input"
          />
        </div>
      </div>
      
      <div class="filters">
        <select v-model="filters.category" @change="loadPictures" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="filters.sortField" @change="loadPictures" class="filter-select">
          <option value="">Default Sort</option>
          <option value="createTime">By Time</option>
          <option value="pictureSize">By Size</option>
        </select>
        <select v-model="filters.sortOrder" @change="loadPictures" class="filter-select">
          <option value="descend">Descending</option>
          <option value="ascend">Ascending</option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="pictures.length === 0" class="empty">No pictures found</div>
      <div v-else class="pictures-grid">
        <PictureCard
          v-for="picture in pictures"
          :key="picture.picId"
          :picture="picture"
          @click="goToDetail(picture.picId)"
        />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import PictureCard from '../components/PictureCard.vue'
import { listPictureVoByPage } from '../api/picture'

const router = useRouter()

const pictures = ref([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(12)
const total = ref(0)
const searchText = ref('')
const categories = ref([])

const filters = ref({
  category: '',
  sortField: '',
  sortOrder: 'descend'
})

let searchTimer = null

const loadPictures = async () => {
  loading.value = true
  try {
    const params = {
      current: current.value,
      pageSize: pageSize.value,
      searchText: searchText.value || undefined,
      category: filters.value.category || undefined,
      sortField: filters.value.sortField || undefined,
      sortOrder: filters.value.sortOrder
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

onMounted(() => {
  loadPictures()
})
</script>

<style scoped>
.pictures-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  border-color: #667eea;
  outline: none;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #667eea;
  outline: none;
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

@media (max-width: 768px) {
  .pictures-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>

