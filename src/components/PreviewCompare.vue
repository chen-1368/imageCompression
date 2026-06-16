<template>
  <div class="preview-compare" v-if="originalUrl && compressedUrl">
    <div class="compare-header">
      <div class="compare-tabs">
        <el-radio-group v-model="mode" size="small">
          <el-radio-button value="side">并排对比</el-radio-button>
          <el-radio-button value="slider">滑块对比</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 并排对比模式 -->
    <div v-if="mode === 'side'" class="side-by-side">
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

    <!-- 滑块对比模式 -->
    <div v-else class="slider-compare" ref="sliderContainerRef" @mousedown="startDrag" @touchstart="startDrag">
      <img :src="compressedUrl" alt="compressed" class="slider-bg" />
      <div class="slider-clip" :style="{ width: sliderPosition + '%' }">
        <img :src="originalUrl" alt="original" class="slider-fg" />
      </div>
      <div class="slider-line" :style="{ left: sliderPosition + '%' }">
        <div class="slider-handle">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="slider-labels">
        <span class="label-left">原图</span>
        <span class="label-right">压缩后</span>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="preview-empty">
    <el-empty description="压缩完成后在此预览对比效果" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

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

const mode = ref<'side' | 'slider'>('side')
const sliderPosition = ref(50)
const sliderContainerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  updateSlider(e)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  updateSlider(e)
}

function stopDrag() {
  isDragging.value = false
}

function updateSlider(e: MouseEvent | TouchEvent) {
  if (!sliderContainerRef.value) return
  const rect = sliderContainerRef.value.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const pos = ((clientX - rect.left) / rect.width) * 100
  sliderPosition.value = Math.min(100, Math.max(0, pos))
}

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<style lang="scss" scoped>
.preview-compare {
  width: 100%;
}

.compare-header {
  margin-bottom: 16px;

  .compare-tabs {
    display: flex;
    justify-content: center;
  }
}

.side-by-side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .compare-item {
    .compare-label {
      font-size: 13px;
      font-weight: 600;
      color: #606266;
      margin-bottom: 8px;
      text-align: center;
    }

    .compare-img-wrap {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;

      img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 4px;
      }
    }

    .compare-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.slider-compare {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  cursor: ew-resize;
  user-select: none;
  background: #f5f7fa;

  .slider-bg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
  }

  .slider-clip {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;

    .slider-fg {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 500px;
      object-fit: contain;
      // match the bg size
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .slider-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #fff;
    transform: translateX(-50%);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);

    .slider-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      color: #409eff;
    }
  }

  .slider-labels {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    pointer-events: none;

    span {
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 12px;
    }
  }
}

.preview-empty {
  background: #fafafa;
  border-radius: 12px;
  padding: 60px 20px;
  border: 1px dashed #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
