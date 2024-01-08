<script lang="ts" setup>
import {Align} from "@/util/datatable/View";
import {computed} from "vue";

const props = defineProps<{
    name: string,
    index: number|undefined,
    reverse: boolean|undefined,
    additive?: boolean
    align?: Align
}>();

const classes = computed(() => ({
    "!text-blue-700": props.reverse !== undefined,
    "left-aligned": props.align !== Align.CENTER && props.align !== Align.RIGHT,
    "center-aligned": props.align === Align.CENTER,
    "right-aligned": props.align === Align.RIGHT,
}));
</script>

<template>
    <th class="cursor-pointer outline-0 select-none hover:text-slate-700" :class="classes">
        <div class="flex">
            <div class="relative" :class="{
                'mr-8': props.align === Align.RIGHT && reverse !== undefined && index !== undefined,
                'mr-[1.375rem]': props.align === Align.RIGHT && reverse !== undefined && !additive,
                'ml-8': props.align === Align.RIGHT && reverse === undefined
            }">
                {{props.name}}
                <div class="absolute top-0 -right-7 flex flex-row items-center gap-0.5 text-blue-700" :class="{'text-transparent': reverse === undefined}">
                    <icon :icon="reverse ? 'angle-down' : 'angle-up'" />
                    <div class="text-xs" :class="{'text-transparent': index === undefined || !additive}">{{index + 1}}</div>
                </div>
            </div>
        </div>
    </th>
</template>

<style lang="scss">
th.left-aligned > div { @apply justify-start; }
th.center-aligned > div { @apply justify-center; }
th.right-aligned > div { @apply justify-end; }
</style>
