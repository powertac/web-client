<script lang="ts" setup>
import {GameStatus} from "@/game/domain/GameStatus";
import GameStatusIcon from "@/game/components/GameStatusIcon.vue";

const props = defineProps<{
    status: GameStatus
}>();
</script>

<template>
    <div class="game-status text-xs bg-white " :class="props.status" >
        <GameStatusIcon :status="props.status" />
        <span class="uppercase ml-2 mr-1">{{props.status}}</span>
    </div>
</template>

<style lang="scss" scoped>
div.game-status {
    &.queued {}
    &.running { @apply bg-indigo-100 text-indigo-800 border-indigo-300 }
    &.completed { @apply bg-emerald-100 text-emerald-800 border-emerald-300 }
    &.failed { @apply bg-rose-100 text-rose-800 border-rose-300 }
}
</style>
