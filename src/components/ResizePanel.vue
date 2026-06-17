<template>
  <div class="resize-panel">
    <div class="panel-header">
      <el-icon>
        <Crop />
      </el-icon>
      <span>尺寸调整</span>
    </div>

    <div class="resize-form">
      <div class="size-input-group">
        <div class="size-input">
          <label>宽度 (px)</label>
          <el-input-number v-model="resizeWidth" :min="1" :max="10000" size="default" controls-position="right" />
        </div>

        <div class="lock-ratio" @click="lockRatio = !lockRatio">
          <el-tooltip :content="lockRatio ? '已锁定比例' : '未锁定比例'" placement="top">
            <el-icon :size="20" :class="{ 'is-locked': lockRatio }">
              <Lock v-if="lockRatio" />
              <Unlock v-else />
            </el-icon>
          </el-tooltip>
        </div>

        <div class="size-input">
          <label>高度 (px)</label>
          <el-input-number v-model="resizeHeight" :min="1" :max="10000" size="default" controls-position="right" />
        </div>
      </div>

      <div class="size-info">
        <span class="original-info">原始: {{ originalWidth }} x {{ originalHeight }}</span>
        <el-button link type="primary" @click="resetToOriginal">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Crop, Lock, Unlock } from '@element-plus/icons-vue'

const props = defineProps<{
  originalWidth: number
  originalHeight: number
}>()

const emit = defineEmits<{
  (e: 'update:width', val: number): void
  (e: 'update:height', val: number): void
  (e: 'update:lockRatio', val: boolean): void
  (e: 'reset'): void
}>()

import { ref, watch } from 'vue'

const resizeWidth = ref(props.originalWidth)
const resizeHeight = ref(props.originalHeight)
const lockRatio = ref(true)

let internalUpdate = false

watch(() => props.originalWidth, (v) => {
  if (v > 0) resizeWidth.value = v
})

watch(() => props.originalHeight, (v) => {
  if (v > 0) resizeHeight.value = v
})

watch(resizeWidth, (newVal) => {
  if (internalUpdate) return
  internalUpdate = true
  if (lockRatio.value && newVal > 0 && props.originalWidth > 0) {
    const ratio = props.originalHeight / props.originalWidth
    resizeHeight.value = Math.round(newVal * ratio)
  }
  emit('update:width', newVal)
  internalUpdate = false
})

watch(resizeHeight, (newVal) => {
  if (internalUpdate) return
  internalUpdate = true
  if (lockRatio.value && newVal > 0 && props.originalHeight > 0) {
    const ratio = props.originalWidth / props.originalHeight
    resizeWidth.value = Math.round(newVal * ratio)
  }
  emit('update:height', newVal)
  internalUpdate = false
})

watch(lockRatio, (v) => {
  emit('update:lockRatio', v)
})

function resetToOriginal() {
  resizeWidth.value = props.originalWidth
  resizeHeight.value = props.originalHeight
  emit('reset')
}
</script>

<style lang="scss" scoped>
.resize-panel {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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

.resize-form {
  .size-input-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .size-input {
      flex: 1;

      label {
        display: block;
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      :deep(.el-input-number) {
        width: 100%;
      }
    }

    .lock-ratio {
      margin-top: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s;
      background: #f8fafc;
      border: 1px solid #e2e8f0;

      &:hover {
        background: #eff6ff;
        border-color: #bfdbfe;
      }

      .is-locked {
        color: #3b82f6;
      }
    }
  }

  .size-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;

    .original-info {
      font-size: 12px;
      color: #94a3b8;
    }
  }
}
</style>
