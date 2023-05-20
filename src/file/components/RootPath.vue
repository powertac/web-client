<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import {computed, ref} from "vue";

const props = defineProps<{
    file: FileNode;
    fullPath?: boolean;
}>();
const root = computed(() => {
    let current: FileNode = props.file;
    while (current.parent !== undefined) {
        current = current.parent;
    }
    const pathNodes = current.path.split("/");
    return pathNodes.splice(0, pathNodes.length -1).join("/");
});
const showFullPath = computed(() =>props.fullPath !== undefined ? props.fullPath : false);
</script>

<template>
    <span v-if="showFullPath">{{root}}/</span>
    <span v-else>.../</span>
</template>
