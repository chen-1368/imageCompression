<template>
  <div class="image-uploader" :class="{ 'is-dragover': isDragover, 'has-image': !!modelValue }"
    @dragover.prevent="isDragover = true" @dragleave="isDragover = false" @drop.prevent="handleDrop"
    @click="triggerInput">
    <input ref="inputRef" type="file" accept="image/jpeg,image/png,image/webp,image/bmp" class="file-input"
      @change="handleFileChange" />

    <div v-if="!modelValue" class="upload-placeholder">
      <el-icon :size="64" color="#3b82f6">
        <UploadFilled />
      </el-icon>
      <p class="upload-title">拖拽图片到此处或点击上传</p>
      <p class="upload-hint">支持 JPG / PNG / WebP / BMP，最大 20MB</p>
    </div>

    <div v-else class="upload-preview">
      <img :src="previewUrl" alt="preview" class="preview-img" />
      <div class="preview-overlay">
        <el-icon :size="32">
          <RefreshRight />
        </el-icon>
        <span>点击更换图片</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, RefreshRight } from '@element-plus/icons-vue'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']

const props = defineProps<{
  modelValue: File | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragover = ref(false)

const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  return URL.createObjectURL(props.modelValue)
})

function triggerInput() {
  inputRef.value?.click()
}

function validateFile(file: File): boolean {
  if (!ACCEPT_TYPES.includes(file.type)) {
    ElMessage.error('不支持的图片格式，请上传 JPG/PNG/WebP/BMP')
    return false
  }
  if (file.size > MAX_SIZE) {
    ElMessage.error('图片大小不能超过 20MB')
    return false
  }
  return true
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && validateFile(file)) {
    emit('update:modelValue', file)
  }
  input.value = ''
}

function handleDrop(e: DragEvent) {
  isDragover.value = false
  const file = e.dataTransfer?.files[0]
  if (file && validateFile(file)) {
    emit('update:modelValue', file)
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  width: 100%;
  height: 100%;
  min-height: 280px;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
  position: relative;
  background: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
  }

  &.is-dragover {
    border-color: #3b82f6;
    background: #dbeafe;
    transform: scale(1.01);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
  }

  &.has-image {
    min-height: 200px;
    border-style: solid;
    border-color: #e2e8f0;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
}

.file-input {
  display: none;
}

.upload-placeholder {
  text-align: center;
  padding: 40px 24px;

  .upload-title {
    margin-top: 18px;
    font-size: 16px;
    color: #334155;
    font-weight: 600;
  }

  .upload-hint {
    margin-top: 8px;
    font-size: 13px;
    color: #94a3b8;
  }
}

.upload-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 200px;
  padding: 16px;

  .preview-img {
    max-width: 100%;
    max-height: 320px;
    object-fit: contain;
    border-radius: 10px;
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.25s ease;
    border-radius: 12px;
  }

  &:hover .preview-overlay {
    opacity: 1;
  }
}
</style>
