<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'close'): void
}>();
</script>

<template>
    <Teleport to="body">
        <div class="h-full w-full fixed top-0 left-0 z-50 modal-backdrop flex justify-center items-center">
            <div class="bg-stone-50 border border-stone-300 drop-shadow-xl rounded py-10 px-14 flex flex-col">
                <div class="flex justify-between items-center">
                    <div class="text-2xl mr-2">
                        <slot name="title"></slot>
                    </div>
                    <button class="button" @click="emit('close')">
                        Close
                        <icon icon="times" class="ml-1.5" />
                    </button>
                </div>
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>
