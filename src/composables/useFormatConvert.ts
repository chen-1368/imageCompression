import { ref } from 'vue'

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export interface FormatOption {
  label: string
  value: OutputFormat
  ext: string
}

export const FORMAT_OPTIONS: FormatOption[] = [
  { label: 'JPEG', value: 'image/jpeg', ext: '.jpg' },
  { label: 'PNG', value: 'image/png', ext: '.png' },
  { label: 'WebP', value: 'image/webp', ext: '.webp' }
]

export function useFormatConvert() {
  const selectedFormat = ref<OutputFormat>('image/jpeg')

  function getFormatLabel(format: OutputFormat): string {
    const found = FORMAT_OPTIONS.find((f) => f.value === format)
    return found ? found.label : 'Unknown'
  }

  function getFormatExt(format: OutputFormat): string {
    const found = FORMAT_OPTIONS.find((f) => f.value === format)
    return found ? found.ext : '.jpg'
  }

  function detectFormat(file: File): OutputFormat {
    const type = file.type
    if (type === 'image/png') return 'image/png'
    if (type === 'image/webp') return 'image/webp'
    return 'image/jpeg'
  }

  return {
    selectedFormat,
    getFormatLabel,
    getFormatExt,
    detectFormat,
    FORMAT_OPTIONS
  }
}
