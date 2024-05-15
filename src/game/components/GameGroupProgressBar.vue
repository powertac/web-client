<script lang="ts" setup>
import {GameGroup} from "@/game/domain/GameGroup";
import type {GameStatus} from "@/game/domain/GameStatus";

const props = defineProps<{
    group: GameGroup,
    muted?: boolean
}>()

function getStyles(gameStatus: GameStatus): string[] {
    return props.muted
        ? [gameStatus, 'muted']
        : [gameStatus];
}
</script>

<template>
    <div>
        <div class="bg-slate-50 flex flex-row">
            <div v-for="(game, index) of group.games" class="grow text-sm game-progress text-center"
                 :class="getStyles(game.status)">
                {{index + 1}}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.game-progress {
    @apply border-t border-b border-r border-slate-300 text-slate-600;

    &:first-child { @apply border-l rounded-l-sm }
    &:last-child { @apply border-r rounded-r-sm }

    &.queued { @apply border-stone-300 text-stone-700 bg-stone-50; }
    &.running { @apply bg-indigo-100 text-indigo-800 border-indigo-300; }
    &.completed { @apply bg-emerald-100 text-emerald-800 border-emerald-400; }
    &.failed { @apply bg-pink-100 text-pink-800 border-pink-300; }

    &.muted { @apply saturate-50 }
}
</style>
