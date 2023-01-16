<script lang="ts" setup>
import {SortOrder} from "@/util/Dataset";
const props = defineProps<{
    name: string,
    order: SortOrder|null,
    index: number|null
}>();

</script>

<template>
    <th class="cursor-pointer outline-0 hover:text-blue-700 hover:!bg-blue-100 select-none">
        <div class="flex justify-center items-center gap-1.5">{{props.name}}
            <div class="flex flex-row gap-1 items-center bg-slate-50 py-1 px-2 border border-blue-400 rounded-full" v-if="order !== null">
                <icon icon="angle-up" v-if="props.order === SortOrder.ASC" />
                <icon icon="angle-down" v-if="props.order === SortOrder.DESC" />
                <div v-if="index !== null">{{index + 1}}</div>
            </div>
        </div>
    </th>
</template>

<style lang="scss">
th.left-aligned > div { @apply justify-start; }
th.right-aligned > div { @apply justify-end; }
</style>
