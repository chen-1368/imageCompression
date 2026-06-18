<template>
    <Teleport to="body">
        <Transition name="preview-fade">
            <div v-if="visible" class="image-preview-overlay" @click.self="close">
                <div class="preview-container">
                    <img :src="src" :alt="alt" class="preview-image" @click="close" />
                    <div v-if="label" class="preview-label">{{ label }}</div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps<{
    visible: boolean
    src: string
    alt?: string
    label?: string
}>()

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
}>()

function close() {
    emit('update:visible', false)
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.visible) {
        close()
    }
}

watch(() => props.visible, (val) => {
    if (val) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeydown)
    } else {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeydown)
    }
})

onUnmounted(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.image-preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
}

.preview-container {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
}

.preview-image {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
    cursor: zoom-out;
}

.preview-label {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
    white-space: nowrap;
}

// 过渡动画
.preview-fade-enter-active,
.preview-fade-leave-active {
    transition: opacity 0.25s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
    opacity: 0;
}
</style>
