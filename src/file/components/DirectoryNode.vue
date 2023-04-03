<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import {computed} from "vue";
import {formatBytes} from "@/util/File";
import FilePath from "@/file/components/FilePath.vue";

const props = defineProps<{
    directory: FileNode
}>();

const emit = defineEmits<{
    (e: "select", node: FileNode): void
}>();

const children = computed(() => props.directory.children !== undefined
    ? props.directory.children.sort((a,b) => {
        if (a.directory === b.directory) {
            return a.name.localeCompare(b.name);
        } else if (a.directory && !b.directory) {
            return -1;
        } else {
            return 1;
        }
    })
    : []);
</script>

<template>
    <div v-if="directory.parent !== undefined"
         @click="$emit('select', directory.parent)"
         class="cursor-pointer hover:text-blue-700 flex border-b border-slate-200">
        <div class="cell"><icon icon="turn-up" flip="horizontal" /></div>
        <div class="grow cell">..</div>
        <div class="cell"></div>
    </div>
    <div v-for="child in children" @click="$emit('select', child)" class="cursor-pointer hover:text-blue-700 flex border-b border-slate-200">
        <div class="cell"><icon :icon="child.directory ? 'folder' : ['far', 'file']"></icon></div>
        <div class="grow cell">{{child.name}}</div>
        <div class="cell">{{ !child.directory ? formatBytes(child.byteCount) : ''}}</div>
    </div>
</template>

<style lang="scss" scoped>
.cell {
    @apply px-4 py-1.5;
}
</style>
