<template>
  <div class="preview-compare" v-if="originalUrl && compressedUrl">
    <div class="side-by-side">
      <div class="compare-item">
        <div class="compare-label">原图</div>
        <div class="compare-img-wrap">
          <img :src="originalUrl" alt="original" />
        </div>
        <div class="compare-meta">
          <span>{{ originalWidth }} x {{ originalHeight }} · {{ originalFormat }}</span>
          <span>{{ formatSize(originalSize) }}</span>
        </div>
      </div>
      <div class="compare-item">
        <div class="compare-label">压缩后</div>
        <div class="compare-img-wrap">
          <img :src="compressedUrl" alt="compressed" />
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
</template>

<script setup lang="ts">
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

      img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 6px;
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
