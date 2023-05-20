<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import DirectoryNode from "@/file/components/DirectoryNode.vue";
import FileViewer from "@/file/components/FileViewer.vue";
import FilePath from "@/file/components/FilePath.vue";
import {ref, watch} from "vue";

const props = defineProps<{
    node: FileNode
}>();

const emit = defineEmits<{
    (e: "selected", node: FileNode): void
}>();

const showFullPath = ref(false);

function copyPathToClipboard(): void {
    navigator.clipboard.writeText(props.node.path)
        .then(() => console.log("copied path to clipboard"))
        .catch(e => console.error("unable to copy path to clipboard", e));
}
</script>

<template>
<div class="border rounded-sm border-slate-300">
    <div class="cell border-b border-slate-300 bg-slate-50 px-4 py-2 flex justify-between items-center">
        <FilePath :file="node" @selected="(n) => $emit('selected', n)" :full-path="showFullPath" />
        <div class="flex gap-1">
            <button type="button" class="button button-sm" title="copy path to clipboard"
                    @click="copyPathToClipboard">
                <icon icon="copy"></icon>
            </button>
            <button type="button" class="button button-sm" :class="{'active': showFullPath}" title="toggle full path" @click="showFullPath = !showFullPath">
                <icon icon="eye-slash"></icon>
            </button>
        </div>
    </div>
    <DirectoryNode :directory="node"
                   @selected="(n) => $emit('selected', n)"
                   v-if="node.directory" />
    <FileViewer :file="node"
                @selected="(n) => $emit('selected', n)"
                v-else />
</div>
</template>
