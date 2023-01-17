<script lang="ts" setup>
const props = defineProps<{
    valid: boolean,
    label: string
}>();
</script>

<template>
    <div class="pb-1 pt-1.5 pl-3.5 pr-4 bg-slate-200 text-slate-500 rounded-sm col border border-slate-300 flex items-center"
         :class="props.valid ? ['text-emerald-700', 'bg-emerald-200', 'border-emerald-400'] : []">
        <icon icon="check" class="text-sm mr-2.5" v-if="props.valid" />
        <icon icon="circle" class="text-sm mr-2.5" v-else />
        {{label}}
    </div>
</template>
