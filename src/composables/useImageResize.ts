import { ref, watch } from 'vue'

export function useImageResize(originalWidth: number, originalHeight: number) {
  const width = ref(originalWidth)
  const height = ref(originalHeight)
  const lockRatio = ref(true)

  const aspectRatio = originalWidth / originalHeight

  watch(width, (newVal) => {
    if (lockRatio.value && newVal > 0) {
      height.value = Math.round(newVal / aspectRatio)
    }
  })

  watch(height, (newVal) => {
    if (lockRatio.value && newVal > 0) {
      width.value = Math.round(newVal * aspectRatio)
    }
  })

  function resetSize() {
    width.value = originalWidth
    height.value = originalHeight
  }

  function updateOriginal(w: number, h: number) {
    width.value = w
    height.value = h
  }

  return {
    width,
    height,
    lockRatio,
    aspectRatio,
    resetSize,
    updateOriginal
  }
}
