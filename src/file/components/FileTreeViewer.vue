<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import {ref} from "vue";
import DirectoryNode from "@/file/components/DirectoryNode.vue";
import FileViewer from "@/file/components/FileViewer.vue";
import FilePath from "@/file/components/FilePath.vue";

const props = defineProps<{
    root: FileNode
}>();

const currentNode = ref<FileNode>(props.root);
</script>

<template>
<div class="border rounded-sm border-slate-300">
    <div class="cell border-b border-slate-300 bg-slate-50 px-4 py-2">
        <FilePath :file="currentNode" @selected="(node) => currentNode = node" />
    </div>
    <DirectoryNode :directory="currentNode"
                   :parent="undefined"
                   @select="(node) => currentNode = node"
                   v-if="currentNode.directory" />
    <FileViewer :file="currentNode"
                @select="(node) => currentNode = node"
                v-else />
</div>
</template>
