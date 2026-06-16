<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <el-icon :size="28" color="#409eff">
            <PictureFilled />
          </el-icon>
          <h1>在线图片压缩工具</h1>
        </div>
        <p class="header-desc">纯浏览器端处理，图片不会上传到服务器</p>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="app-main">
      <!-- 初始状态：上传组件居中 -->
      <div v-if="!sourceFile" class="upload-center">
        <div class="upload-wrap">
          <ImageUploader v-model="sourceFile" @update:modelValue="handleFileChange" />
        </div>
      </div>

      <!-- 上传图片后的布局 -->
      <div v-else class="content-flow">
        <!-- 第一行：上传 + 压缩 -->
        <div class="row row-upload">
          <div class="uploader-col">
            <ImageUploader v-model="sourceFile" @update:modelValue="handleFileChange" />
          </div>
          <div class="compress-col">
            <CompressionPanel :is-compressing="isCompressing" :can-compress="!!sourceFile" @compress="handleCompress" />
          </div>
        </div>

        <!-- 第二行：尺寸+格式 | 图片信息+下载 -->
        <div class="row row-settings">
          <div class="settings-group">
            <ResizePanel :original-width="originalDimensions.width" :original-height="originalDimensions.height"
              @update:width="(v) => (targetWidth = v)" @update:height="(v) => (targetHeight = v)" @reset="resetSize" />
            <FormatConverter :original-format="originalFormat" @update:format="(v) => (outputFormat = v)" />
          </div>
          <div class="info-col">
            <ImageInfo :file-name="sourceFile?.name ?? ''" :original-width="originalDimensions.width"
              :original-height="originalDimensions.height" :original-size="sourceFile?.size ?? 0"
              :compressed="compressResult" />
            <el-button type="success" size="large" class="download-btn" :disabled="!compressResult"
              @click="handleDownload">
              <el-icon :size="18" class="download-btn-icon">
                <Download />
              </el-icon>
              <span>下载压缩后的图片</span>
            </el-button>
          </div>
        </div>

        <!-- 对比模块：压缩后才显示 -->
        <section v-if="compressResult" class="preview-area">
          <PreviewCompare :original-url="originalPreviewUrl" :compressed-url="compressResult?.url ?? ''"
            :original-width="originalDimensions.width" :original-height="originalDimensions.height"
            :original-size="sourceFile?.size ?? 0"
            :original-format="originalFormat ? getFormatLabel(originalFormat) : ''"
            :compressed-width="compressResult?.width ?? 0" :compressed-height="compressResult?.height ?? 0"
            :compressed-size="compressResult?.compressedSize ?? 0"
            :compressed-format="getFormatLabel(outputFormat)" />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PictureFilled, Download } from '@element-plus/icons-vue'
import ImageUploader from './components/ImageUploader.vue'
import CompressionPanel from './components/CompressionPanel.vue'
import ResizePanel from './components/ResizePanel.vue'
import FormatConverter from './components/FormatConverter.vue'
import ImageInfo from './components/ImageInfo.vue'
import PreviewCompare from './components/PreviewCompare.vue'
import { useImageCompress, type CompressResult } from './composables/useImageCompress'
import { useFormatConvert, type OutputFormat } from './composables/useFormatConvert'

const { compress, isCompressing } = useImageCompress()
const { detectFormat, getFormatExt, getFormatLabel } = useFormatConvert()

// 状态
const sourceFile = ref<File | null>(null)
const compressResult = ref<CompressResult | null>(null)
const originalPreviewUrl = ref('')
const originalDimensions = ref({ width: 0, height: 0 })
const originalFormat = ref<OutputFormat | null>(null)
const outputFormat = ref<OutputFormat>('image/jpeg')
const targetWidth = ref(0)
const targetHeight = ref(0)

// 读取图片尺寸
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

async function handleFileChange(file: File | null) {
  // 清理旧数据
  if (originalPreviewUrl.value) URL.revokeObjectURL(originalPreviewUrl.value)
  if (compressResult.value) URL.revokeObjectURL(compressResult.value.url)
  compressResult.value = null

  if (!file) {
    sourceFile.value = null
    originalPreviewUrl.value = ''
    originalDimensions.value = { width: 0, height: 0 }
    originalFormat.value = null
    return
  }

  sourceFile.value = file
  originalPreviewUrl.value = URL.createObjectURL(file)
  const dims = await getImageDimensions(file)
  originalDimensions.value = dims
  targetWidth.value = dims.width
  targetHeight.value = dims.height
  originalFormat.value = detectFormat(file)
  outputFormat.value = detectFormat(file)
}

function resetSize() {
  targetWidth.value = originalDimensions.value.width
  targetHeight.value = originalDimensions.value.height
}

async function handleCompress(quality: number) {
  if (!sourceFile.value) return

  const result = await compress(
    sourceFile.value,
    quality,
    outputFormat.value,
    targetWidth.value !== originalDimensions.value.width ? targetWidth.value : undefined,
    targetHeight.value !== originalDimensions.value.height ? targetHeight.value : undefined
  )

  if (result) {
    compressResult.value = result
    ElMessage.success(
      result.compressionRatio > 0
        ? `压缩完成！节省 ${result.compressionRatio.toFixed(1)}%`
        : `压缩完成，文件增大了 ${Math.abs(result.compressionRatio).toFixed(1)}%`
    )
  }
}

function handleDownload() {
  if (!compressResult.value) return

  const ext = getFormatExt(outputFormat.value)
  const baseName = sourceFile.value?.name.replace(/\.[^.]+$/, '') ?? 'compressed'
  const link = document.createElement('a')
  link.href = compressResult.value.url
  link.download = `${baseName}_compressed${ext}`
  link.click()
}

onUnmounted(() => {
  if (originalPreviewUrl.value) URL.revokeObjectURL(originalPreviewUrl.value)
  if (compressResult.value) URL.revokeObjectURL(compressResult.value.url)
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 16px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      h1 {
        font-size: 20px;
        font-weight: 700;
        color: #303133;
        margin: 0;
      }
    }

    .header-desc {
      font-size: 13px;
      color: #909399;
    }
  }
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

// 初始上传居中
.upload-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  .upload-wrap {
    width: 520px;
    max-width: 100%;
  }
}

// 上传后的流式布局
.content-flow {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

// 第一行：上传 + 压缩
.row-upload {
  align-items: stretch;

  .uploader-col {
    flex: 1 1 320px;
    min-width: 280px;
    display: flex;
  }

  .compress-col {
    flex: 1 1 300px;
    min-width: 260px;
    display: flex;
  }
}

// 第二行：设置组 + 图片信息
.row-settings {
  .settings-group {
    flex: 1 1 320px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-col {
    flex: 1 1 300px;
    min-width: 260px;
  }
}

.download-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  border-radius: 10px;
  margin-top: 16px;

  .download-btn-icon {
    margin-right: 8px;
  }
}

.preview-area {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #ebeef5;
}

// 响应式
@media (max-width: 700px) {
  .row-upload,
  .row-settings {
    flex-direction: column;
  }

  .app-header .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
