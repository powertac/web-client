<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {computed, onMounted, ref} from "vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";
import RemoveRunAction from "@/game/components/RemoveRunAction.vue";

const gameStore = useGameStore();
const gameId = useRouter().currentRoute.value.params.id as string;
const game = ref<Game>();
const failedRuns = computed(() => game.value?.runs.filter(r => r.failed));

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
</script>

<template>
<div v-if="game !== undefined">
    <GamePageHeader :game="game" />
    <div class="max-w-screen-md mx-auto">
        <div class="mt-10 text-slate-700">
            <h2 class="text-2xl">Remove failed run data</h2>
            <p class="mt-4 mb-6 leading-relaxed">
                Remove data created by failed runs to open up storage space.
                Successful runs can only be removed by deleting the game itself.
                Removing a run will delete all log files associated with it.
            </p>
            <RemoveRunAction :run="run" v-for="run in failedRuns" />
            <div class="rounded bg-slate-100 border border-slate-300 px-5 py-3 text-slate-600 italic text-center"
                 v-if="failedRuns?.length === 0">
                There are no failed runs for this game.
            </div>
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
