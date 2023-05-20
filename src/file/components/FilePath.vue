<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import {computed} from "vue";
import RootPath from "@/file/components/RootPath.vue";

const props = defineProps<{
    file: FileNode;
    fullPath?: boolean;
}>();

const emit = defineEmits<{
    (e: "selected", node: FileNode): void
}>();

const pathNodes = computed(() => {
    const nodes = [];
    let currentNode = props.file;
    while (currentNode.parent !== undefined) {
        currentNode = currentNode.parent;
        nodes.push(currentNode);
    }
    return nodes.reverse();
});
</script>

<template>
    <div class="font-mono">
        <div class="inline-block" v-for="(node, index) in pathNodes">
            <RootPath :file="node" v-if="index === 0" :full-path="props.fullPath" />
            <span v-else>/</span>
            <span class="node-link" @click="$emit('selected', node)">{{node.name}}</span>
        </div>
        <div class="inline-block">
            <RootPath :file="file" v-if="pathNodes.length === 0" :full-path="props.fullPath" />
            <span v-else>/</span>
            <span class="mx-0.5">{{file.name}}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.node-link {
    @apply hover:text-blue-700 hover:underline cursor-pointer mx-0.5;
}
</style>
