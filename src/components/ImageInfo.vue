<template>
  <div class="image-info" v-if="hasInfo">
    <div class="panel-header">
      <el-icon>
        <InfoFilled />
      </el-icon>
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
          <span class="label">格式</span>
          <span class="value">{{ originalFormat }}</span>
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
          <span class="label">格式</span>
          <span class="value">{{ compressedFormat }}</span>
        </div>
        <div class="info-item">
          <span class="label">大小</span>
          <span class="value">{{ formatSize(compressed.compressedSize) }}</span>
        </div>
        <div class="info-item">
          <span class="label">压缩率</span>
          <span class="value ratio" :class="compressed.compressionRatio > 0 ? 'good' : 'bad'">
            <template v-if="compressed.compressionRatio > 0">-{{ compressed.compressionRatio.toFixed(1) }}%</template>
            <template v-else>+{{ Math.abs(compressed.compressionRatio).toFixed(1) }}%</template>
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
  originalFormat: string
  compressed: CompressResult | null
  compressedFormat: string
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
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  flex: 1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-section {
  h4 {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;

    .label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .value {
      font-size: 13px;
      color: #1e293b;
      font-weight: 600;
    }

    .text-ellipsis {
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ratio {
      font-weight: 700;
      font-size: 14px;

      &.good {
        color: #22c55e;
        background: #f0fdf4;
        padding: 2px 8px;
        border-radius: 6px;
      }

      &.bad {
        color: #ef4444;
        background: #fef2f2;
        padding: 2px 8px;
        border-radius: 6px;
      }
    }
  }
}
</style>
