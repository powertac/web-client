<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
const props = defineProps<{
    game: Game
}>();
</script>

<template>
    <div class="bg-slate-50 border-b border-slate-300 table-header">
        <h2 class="text-2xl px-10 pt-5 text-slate-700">
            <router-link :to="{name: 'game-table'}" class="hover:text-blue-700 hover:underline">Games</router-link>
            /
            {{props.game.name}}
        </h2>
        <div class="pt-2 px-7 flex">
            <router-link class="nav-item" :to="{name: 'game-details', params:  {id: game.id}}">
                <icon icon="dice-d6" class="mr-1 text-sm" />
                Details
            </router-link>
            <router-link class="nav-item" :to="{name: 'game-files', params: {id: game.id, relativePath: ''}}">
                <icon :icon="['far', 'file']" class="mr-1 text-sm" />
                Files
            </router-link>
            <router-link class="nav-item" :to="{name: 'game-actions', params: {id: game.id}}">
                <icon icon="gears" class="mr-1 text-sm" />
                Actions
            </router-link>
        </div>
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
