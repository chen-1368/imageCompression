<template>
  <div class="preview-compare" v-if="originalUrl && compressedUrl">
    <div class="side-by-side">
      <div class="compare-item">
        <div class="compare-label">原图</div>
        <div class="compare-img-wrap" @click="openPreview(originalUrl, '原图')">
          <img :src="originalUrl" alt="original" />
          <div class="zoom-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>点击放大</span>
          </div>
        </div>
        <div class="compare-meta">
          <span>{{ originalWidth }} x {{ originalHeight }} · {{ originalFormat }}</span>
          <span>{{ formatSize(originalSize) }}</span>
        </div>
      </div>
      <div class="compare-item">
        <div class="compare-label">压缩后</div>
        <div class="compare-img-wrap" @click="openPreview(compressedUrl, '压缩后')">
          <img :src="compressedUrl" alt="compressed" />
          <div class="zoom-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>点击放大</span>
          </div>
        </div>
        <div class="compare-meta">
          <span>{{ compressedWidth }} x {{ compressedHeight }} · {{ compressedFormat }}</span>
          <span>{{ formatSize(compressedSize) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="preview-empty">
    <el-empty description="压缩完成后在此预览对比效果" />
  </div>

  <!-- 图片预览弹窗 -->
  <ImagePreview
    :visible="previewVisible"
    :src="previewSrc"
    :label="previewLabel"
    @update:visible="previewVisible = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImagePreview from './ImagePreview.vue'

defineProps<{
  originalUrl: string
  compressedUrl: string
  originalWidth: number
  originalHeight: number
  originalSize: number
  originalFormat: string
  compressedWidth: number
  compressedHeight: number
  compressedSize: number
  compressedFormat: string
}>()

const previewVisible = ref(false)
const previewSrc = ref('')
const previewLabel = ref('')

function openPreview(src: string, label: string) {
  previewSrc.value = src
  previewLabel.value = label
  previewVisible.value = true
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style lang="scss" scoped>
.preview-compare {
  width: 100%;
}

.side-by-side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  .compare-item {
    .compare-label {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 10px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compare-img-wrap {
      background: #f8fafc;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      border: 1px solid #e2e8f0;
      cursor: zoom-in;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: #3b82f6;

        .zoom-hint {
          opacity: 1;
        }
      }

      img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 6px;
      }

      .zoom-hint {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }
    }

    .compare-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.preview-empty {
  background: #f8fafc;
  border-radius: 14px;
  padding: 60px 20px;
  border: 1px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
