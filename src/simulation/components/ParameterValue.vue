<script lang="ts" setup>
import {ref, watch} from "vue";

const props = defineProps<{
    parameter: string,
    value: string
}>();
const emit = defineEmits<{
    (e: 'updated', parameter: string): void
}>();
const internalValue = ref(props.value);
watch(internalValue, (newValue) => emit("updated", newValue));
</script>

<template>
    <div class="col-span-7 self-stretch col flex items-center px-4 font-mono bg-slate-50 border border-slate-200 overflow-x-scroll border-r-0">{{parameter}}</div>
    <div class="col-span-3">
        <input type="text" class="default text-center font-mono w-full"
               :class="{'valid': internalValue.length > 0}"
               v-model="internalValue" />
    </div>
</template>
