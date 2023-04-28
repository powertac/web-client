<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import GameStatusBadge from "@/game/components/GameStatusBadge.vue";
import {computed} from "vue";

const props = defineProps<{
    games: Game[];
}>();

const gamePartitions = computed(() => {
    const buckets: Game[][] = [];
    let bucketIndex = -1;
    for (let i=0; i < props.games.length; i++) {
        if (i % 4 === 0) buckets[++bucketIndex] = [];
        buckets[bucketIndex].push(props.games[i]);
    }
    return buckets;
});
</script>

<template>
    <div class="tuple-group">
        <div class="tuple-header">Games ({{props.games.length}})</div>
        <div class="grid gap-1 p-1.5 grid-flow-col overflow-x-auto" :class="['grid-cols-' + gamePartitions.length]">
            <div class="grid grid-cols-1 gap-1 place-content-start" v-for="partition in gamePartitions">
                <GameStatusBadge :index="props.games.indexOf(game)" :status="game.status" v-for="game in partition" :key="game.id" />
            </div>
        </div>
    </div>
</template>
