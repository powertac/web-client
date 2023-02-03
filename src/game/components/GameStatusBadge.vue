<script lang="ts" setup>
import {GameStatus} from "@/game/domain/GameStatus";
import GameStatusIcon from "@/game/components/GameStatusIcon.vue";

const props = defineProps<{
    index: number,
    status: GameStatus
}>();
</script>

<template>
    <div class="game-status-badge py-1 px-2 border border-slate-300 rounded-sm bg-slate-50 min-w-[12rem] text-slate-500 flex flex-row justify-between items-stretch"
         :class="[status]">
        <div class="text-xs text-center uppercase font-semibold flex items-end"><span>Game {{ index + 1 }}</span></div>
        <div class="flex flex-row items-center justify-center mt-0.5 text-xs">
            <GameStatusIcon :status="status" class="mr-1.5 game-status-badge-icon" />
            <span class="uppercase">{{status}}</span>
        </div>
    </div>
</template>

<style lang="scss">
.game-status-badge {
    &.queued {
        .game-status-badge-icon { @apply text-slate-400 }
    }
    &.running {
        @apply bg-indigo-100 text-indigo-800 border-indigo-400;
        .game-status-badge-icon { @apply text-indigo-700 }
    }
    &.completed {
        @apply bg-emerald-100 text-emerald-800 border-emerald-400;
        .game-status-badge-icon { @apply text-emerald-800 }
    }
    &.failed {
        @apply bg-pink-100 text-pink-800 border-pink-400;
        .game-status-badge-icon { @apply text-pink-700 }
    }
}
</style>
