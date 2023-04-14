<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import DirectoryNode from "@/file/components/DirectoryNode.vue";
import FileViewer from "@/file/components/FileViewer.vue";
import FilePath from "@/file/components/FilePath.vue";

const props = defineProps<{
    node: FileNode
}>();

const emit = defineEmits<{
    (e: "selected", node: FileNode): void
}>();
</script>

<template>
<div class="border rounded-sm border-slate-300">
    <div class="cell border-b border-slate-300 bg-slate-50 px-4 py-2">
        <FilePath :file="node" @selected="(n) => $emit('selected', n)" />
    </div>
    <DirectoryNode :directory="node"
                   @selected="(n) => $emit('selected', n)"
                   v-if="node.directory" />
    <FileViewer :file="node"
                @selected="(n) => $emit('selected', n)"
                v-else />
</div>
</template>
