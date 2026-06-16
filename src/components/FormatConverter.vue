<template>
  <div class="format-converter">
    <div class="panel-header">
      <el-icon><Document /></el-icon>
      <span>输出格式</span>
    </div>

    <div class="format-content">
      <div class="current-format" v-if="originalFormat">
        <span class="format-label">原始格式</span>
        <el-tag size="small" type="info">{{ getFormatLabel(originalFormat) }}</el-tag>
      </div>

      <el-select
        v-model="selectedFormat"
        placeholder="选择输出格式"
        size="default"
        class="format-select"
        @change="handleChange"
      >
        <el-option
          v-for="opt in FORMAT_OPTIONS"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        >
          <div class="format-option">
            <span>{{ opt.label }}</span>
            <span class="format-ext">{{ opt.ext }}</span>
          </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { FORMAT_OPTIONS, type OutputFormat } from '../composables/useFormatConvert'

const props = defineProps<{
  originalFormat: OutputFormat | null
}>()

const emit = defineEmits<{
  (e: 'update:format', format: OutputFormat): void
}>()

const selectedFormat = ref<OutputFormat>('image/jpeg')

watch(() => props.originalFormat, (v) => {
  if (v) selectedFormat.value = v
}, { immediate: true })

function getFormatLabel(format: OutputFormat): string {
  const found = FORMAT_OPTIONS.find((f) => f.value === format)
  return found ? found.label : 'Unknown'
}

function handleChange(val: OutputFormat) {
  emit('update:format', val)
}
</script>

<style lang="scss" scoped>
.format-converter {
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

.format-content {
  .current-format {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .format-label {
      font-size: 13px;
      color: #909399;
    }
  }

  .format-select {
    width: 100%;
  }
}

.format-option {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .format-ext {
    color: #909399;
    font-size: 13px;
  }
}
</style>
