<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {onMounted, ref} from "vue";
import {api} from "@/api";
import type FileNode from "@/file/domain/FileNode";
import {hydrateParents} from "@/file/domain/FileNode";
import GameMetaBlock from "@/game/components/GameMetaBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";
import GameRunsBlock from "@/game/components/GameRunsBlock.vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";

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
    <GamePageHeader :game="game" />
    <div class="max-w-screen-lg mx-auto">
        <div class="flex gap-2 mx-5 flex-wrap mt-10">
            <h2 class="text-2xl w-full mb-4">Meta</h2>
            <GameMetaBlock :game="game" />
            <GameRunsBlock :runs="game.runs" />
        </div>
        <div class="flex gap-2 mx-5 mt-10 flex-wrap">
            <h2 class="text-2xl w-full mb-4">Configuration</h2>
            <BrokersBlock :brokers="game.config.brokers" />
            <WeatherBlock :weather="game.config.weather" />
            <ParametersBlock :parameters="game.config.parameters" />
        </div>
    </div>
</div>
<div v-else>
    LOADING
</div>
</template>

<style lang="scss" scoped>
.table-header .nav-item {
    @apply px-4 py-3 block border-b -mb-[1px] border-transparent;
    &.router-link-active {
        @apply text-blue-700 border-b border-blue-700;
    }
}
</style>
