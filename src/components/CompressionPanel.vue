<template>
  <div class="compression-panel">
    <div class="panel-header">
      <el-icon>
        <Setting />
      </el-icon>
      <span>压缩设置</span>
    </div>

    <div class="quality-section">
      <div class="quality-label">
        <span>压缩质量</span>
        <span class="quality-value">{{ quality }}%</span>
      </div>
      <el-slider v-model="quality" :min="1" :max="100" :step="1" :marks="qualityMarks" show-stops />
      <div class="quality-hints">
        <span>低质量 / 小文件</span>
        <span>高质量 / 大文件</span>
      </div>
    </div>

    <el-button type="primary" size="large" :loading="isCompressing" :disabled="!canCompress" class="compress-btn"
      @click="handleCompress">
      <el-icon v-if="!isCompressing" :size="18" class="compress-btn-icon">
        <PictureFilled />
      </el-icon>
      <span>{{ isCompressing ? '压缩中...' : '开始压缩' }}</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Setting, PictureFilled } from '@element-plus/icons-vue'

defineProps<{
  isCompressing: boolean
  canCompress: boolean
}>()

const emit = defineEmits<{
  (e: 'compress', quality: number): void
}>()

const quality = ref(75)

const qualityMarks = {
  25: '低',
  50: '中',
  75: '高',
  100: '最高'
}

function handleCompress() {
  emit('compress', quality.value)
}
</script>

<style lang="scss" scoped>
.compression-panel {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.quality-section {
  margin-bottom: 24px;
  flex: 1;

  .quality-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    font-size: 14px;
    color: #475569;
    font-weight: 500;

    .quality-value {
      font-size: 22px;
      font-weight: 800;
      color: #3b82f6;
      letter-spacing: -0.5px;
    }
  }

  .quality-hints {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #94a3b8;
    margin-top: 32px;
  }
}

.compress-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;

  .compress-btn-icon {
    margin-right: 8px;
  }
}
</style>
