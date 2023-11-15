<script lang="ts" setup>
import {Baseline} from "@/baseline/domain/Baseline";

const props = defineProps<{
    baseline: Baseline
}>();
</script>

<template>
    <div class="bg-slate-50 border-b border-slate-300 table-header">
        <h2 class="text-2xl px-10 pt-5 text-slate-700">
            <router-link :to="{name: 'baseline-table'}" class="hover:text-blue-700 hover:underline">Baselines</router-link>
            /
            {{props.baseline.name}}
        </h2>
        <div class="pt-2 px-7 flex">
            <router-link class="nav-item" :to="{name: 'baseline-details', params:  {id: props.baseline.id}}">
                <icon icon="seedling" class="mr-1 text-sm" />
                Details
            </router-link>
            <router-link class="nav-item" :to="{name: 'baseline-games', params: {id: props.baseline.id, relativePath: ''}}">
                <icon icon="dice-d6" class="mr-1 text-sm" />
                Games
            </router-link>
            <router-link class="nav-item" :to="{name: 'baseline-analysis', params: {id: props.baseline.id}}">
                <icon icon="flask" class="mr-1 text-sm" />
                Analysis
            </router-link>
            <router-link class="nav-item" :to="{name: 'baseline-actions', params: {id: props.baseline.id}}">
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
