<template>
  <div class="image-info" v-if="hasInfo">
    <div class="panel-header">
      <el-icon><InfoFilled /></el-icon>
      <span>图片信息</span>
    </div>

    <div class="info-grid">
      <div class="info-section">
        <h4>原始图片</h4>
        <div class="info-item">
          <span class="label">文件名</span>
          <span class="value text-ellipsis">{{ fileName }}</span>
        </div>
        <div class="info-item">
          <span class="label">尺寸</span>
          <span class="value">{{ originalWidth }} x {{ originalHeight }}</span>
        </div>
        <div class="info-item">
          <span class="label">大小</span>
          <span class="value">{{ formatSize(originalSize) }}</span>
        </div>
      </div>

      <div class="info-section" v-if="compressed">
        <h4>压缩后</h4>
        <div class="info-item">
          <span class="label">尺寸</span>
          <span class="value">{{ compressed.width }} x {{ compressed.height }}</span>
        </div>
        <div class="info-item">
          <span class="label">大小</span>
          <span class="value">{{ formatSize(compressed.compressedSize) }}</span>
        </div>
        <div class="info-item">
          <span class="label">压缩率</span>
          <span class="value ratio" :class="compressed.compressionRatio > 0 ? 'good' : 'bad'">
            {{ compressed.compressionRatio > 0 ? '-' : '+' }}{{ Math.abs(compressed.compressionRatio).toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import type { CompressResult } from '../composables/useImageCompress'

const props = defineProps<{
  fileName: string
  originalWidth: number
  originalHeight: number
  originalSize: number
  compressed: CompressResult | null
}>()

const hasInfo = computed(() => !!props.fileName)

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style lang="scss" scoped>
.image-info {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #ebeef5;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-section {
  h4 {
    font-size: 13px;
    color: #909399;
    font-weight: 500;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f0f2f5;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;

    .label {
      font-size: 12px;
      color: #909399;
    }

    .value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .text-ellipsis {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ratio {
      &.good { color: #67c23a; }
      &.bad { color: #f56c6c; }
    }
  }
}
</style>
