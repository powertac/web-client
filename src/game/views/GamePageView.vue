<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {onMounted, ref} from "vue";
import {api} from "@/api";
import type FileNode from "@/file/domain/FileNode";
import FileTreeViewer from "@/file/components/FileTreeViewer.vue";
import GameMetaBlock from "@/game/components/GameMetaBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";
import {hydrateParents} from "@/file/domain/FileNode";
import GameRunsBlock from "@/game/components/GameRunsBlock.vue";

const gameStore = useGameStore();
const gameId = useRouter().currentRoute.value.params.id as string;
const game = ref<Game>();
const root = ref<FileNode>();

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
onMounted(() => api.orchestrator.games.getRootNode(gameId)
    .then((node) => root.value = hydrateParents(node))
    .catch((error) => console.error(error)));
</script>

<template>
<div v-if="game !== undefined">
    <h1 class="text-4xl mx-5 mt-10 mb-7">{{game.name}}</h1>
    <div class="flex gap-2 mx-5 flex-wrap">
        <h2 class="w-full uppercase font-semibold text-sm ml-2">Meta</h2>
        <GameMetaBlock :game="game" />
        <GameRunsBlock :runs="game.runs" />
    </div>
    <div class="flex gap-2 mx-5 mt-7 flex-wrap">
        <h2 class="w-full uppercase font-semibold text-sm ml-2">Configuration</h2>
        <BrokersBlock :brokers="game.config.brokers" />
        <WeatherBlock :weather="game.config.weather" />
        <ParametersBlock :parameters="game.config.parameters" />
    </div>
    <div class="flex gap-2 mx-5 mt-7 mb-20 flex-wrap">
        <h2 class="w-full uppercase font-semibold text-sm ml-2">Files</h2>
        <FileTreeViewer :root="root" v-if="root !== undefined" />
    </div>
</div>
<div v-else>
    LOADING
</div>
</template>
