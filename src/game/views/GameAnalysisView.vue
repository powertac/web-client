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
import {GameStatus} from "@/game/domain/GameStatus";

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
        <div class="max-w-screen-md mx-auto mb-20">
            <div v-if="game.status === GameStatus.Failed || game.status === GameStatus.Cancelled" class="border border-fuchsia-300 rounded px-5 py-4 mt-10 bg-fuchsia-50 text-fuchsia-800">
                <span class="font-semibold">Game analysis not available</span>
                <ul class="list-disc mt-2">
                    <li class="mt-1 ml-5">Analysis Tools are only available for completed games.</li>
                    <li class="mt-1 ml-5">Please rerun the game to analyze its results.</li>
                </ul>
            </div>
            <div v-else-if="game.status !== GameStatus.Completed" class="border border-orange-300 rounded px-5 py-4 mt-10 bg-orange-50">
                <span class="font-semibold text-orange-700">Game not yet completed</span>
                <p class="text-orange-700 mt-1">The analysis tools for this game will be available once the game has completed successfully.</p>
            </div>
            <div v-else>
                <GameJupyterNotebook class="mt-10" :game="game" v-if="game.status === GameStatus.Completed" />
                <GameLogProcessors :game="game" :artifacts="artifacts" v-if="game.status === GameStatus.Completed" />
            </div>
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>