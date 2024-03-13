<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {onMounted, ref} from "vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";
import GameLogProcessors from "@/game/components/GameLogProcessors.vue";
import {api} from "@/api";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import GameJupyterNotebook from "@/game/components/GameJupyterNotebook.vue";

const gameStore = useGameStore();
const gameId = useRouter().currentRoute.value.params.id as string;
const game = ref<Game>();
const artifacts = ref<LogProcessorArtifact[]|null>(null);

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
onMounted(() => api.orchestrator.processors.getGameArtifacts(gameId)
    .then(a => artifacts.value = a)
    .catch(e => console.error("unable to load log processor artifacts for game", e)));
</script>


<template>
    <div v-if="game !== undefined && artifacts !== null">
        <GamePageHeader :game="game" />
        <div class="max-w-screen-md mx-auto">
            <GameLogProcessors :game="game" :artifacts="artifacts" />
            <GameJupyterNotebook class="mt-10" :game="game" />
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>