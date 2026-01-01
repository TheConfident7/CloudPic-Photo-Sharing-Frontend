<template>
  <div class="picture-card" @click="$emit('click')">
    <div class="image-wrapper">
      <img
        :src="picture.thumbUrl || picture.imageUrl"
        :alt="picture.title"
        @error="handleImageError"
        class="picture-image"
      />
      <div class="overlay">
        <div class="overlay-content">
          <h3 class="picture-title">{{ picture.title || 'Untitled' }}</h3>
          <p v-if="picture.desc" class="picture-desc">{{ picture.desc }}</p>
          <div class="picture-meta">
            <span v-if="picture.tag" class="tag">{{ picture.tag }}</span>
            <span v-if="picture.size" class="size">{{ formatSize(picture.size) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  picture: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage load failed%3C/text%3E%3C/svg%3E'
}

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.picture-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.picture-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  overflow: hidden;
  background: #f0f0f0;
}

.picture-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.picture-card:hover .picture-image {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.picture-card:hover .overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  width: 100%;
}

.picture-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picture-desc {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picture-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.size {
  font-size: 12px;
  opacity: 0.8;
}
</style>

