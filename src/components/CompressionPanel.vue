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
  margin-bottom: 20px;
}

.quality-section {
  margin-bottom: 20px;

  .quality-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #606266;

    .quality-value {
      font-size: 18px;
      font-weight: 700;
      color: #409eff;
    }
  }

  .quality-hints {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
    margin-top: 30px;
  }
}

.compress-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  border-radius: 8px;

  .compress-btn-icon {
    margin-right: 4px;
  }
}
</style>
