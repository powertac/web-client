<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "@/api";
import type FileNode from "@/file/domain/FileNode";
import {findNode, hydrateParents, relativePath} from "@/file/domain/FileNode";
import FileTreeViewer from "@/file/components/FileTreeViewer.vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";

const gameStore = useGameStore();
const router = useRouter();
const gameId = router.currentRoute.value.params.id as string;
const path = computed(() => router.currentRoute.value.params.relativePath as string[]|string|undefined);
const game = ref<Game>();
const root = ref<FileNode>();
const node = ref<FileNode>();

function selectNode(newNode: FileNode): void {
    const newPath = relativePath(newNode);

    router.push('/games/' + gameId + '/files' + newPath);
}

function setNode(newRoot: FileNode|undefined, newPath: string[]|string|undefined): void {
    if (newRoot !== undefined) {
        if (newPath instanceof Array) {
            if (newPath[0] === gameId) {
                newPath.shift();
            }
            node.value = findNode(newRoot, newPath);
        } else {
            node.value = newRoot;
        }
    }
}

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
onMounted(() => api.orchestrator.games.getRootNode(gameId)
    .then((r) => root.value = hydrateParents(r))
    .catch((error) => console.error(error)));
watch(root, (r) => setNode(r, path.value));
watch(path, (p) => setNode(root.value, p));
</script>

<template>
    <div v-if="game !== undefined">
        <GamePageHeader :game="game" />
        <FileTreeViewer :node="node"
                        v-if="node !== undefined"
                        @selected="selectNode"
                        class="max-w-screen-lg mx-auto mt-10" />
    </div>
    <div v-else>
        LOADING
    </div>
</template>
