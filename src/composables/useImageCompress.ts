import { ref } from 'vue'

export interface CompressResult {
  blob: Blob
  url: string
  width: number
  height: number
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export function useImageCompress() {
  const isCompressing = ref(false)
  const error = ref<string | null>(null)

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = src
    })
  }

  async function compress(
    file: File,
    quality: number,
    outputFormat: string = 'image/jpeg',
    targetWidth?: number,
    targetHeight?: number
  ): Promise<CompressResult | null> {
    isCompressing.value = true
    error.value = null

    try {
      const originalUrl = URL.createObjectURL(file)
      const img = await loadImage(originalUrl)

      const width = targetWidth ?? img.naturalWidth
      const height = targetHeight ?? img.naturalHeight

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 上下文创建失败')

      // 高质量缩放
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // 对于 JPEG 格式，需要白色背景（因为 JPEG 不支持透明）
      if (outputFormat === 'image/jpeg') {
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            const alpha = data[i] / 255
            data[i - 3] = Math.round(data[i - 3] * alpha + 255 * (1 - alpha))
            data[i - 2] = Math.round(data[i - 2] * alpha + 255 * (1 - alpha))
            data[i - 1] = Math.round(data[i - 1] * alpha + 255 * (1 - alpha))
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }

      const qualityValue = quality / 100

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('压缩失败'))
          },
          outputFormat,
          qualityValue
        )
      })

      const compressedUrl = URL.createObjectURL(blob)
      const originalSize = file.size
      const compressedSize = blob.size
      const compressionRatio = ((1 - compressedSize / originalSize) * 100)

      URL.revokeObjectURL(originalUrl)

      return {
        blob,
        url: compressedUrl,
        width,
        height,
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, compressionRatio)
      }
    } catch (e: any) {
      error.value = e.message || '压缩过程中出现错误'
      return null
    } finally {
      isCompressing.value = false
    }
  }

  return {
    compress,
    isCompressing,
    error
  }
}
