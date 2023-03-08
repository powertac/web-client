<script lang="ts" setup>
import ApplicationNavigationGroup from "@/application/components/ApplicationNavigationGroup.vue";

const gamesItems: {routeName: string, label: string}[] = [
    {routeName: "new-game", label: "New Game"},
    {routeName: "game-table", label: "Game Table"},
];
const baselinesItems: {routeName: string, label: string}[] = [
    {routeName: "new-baseline", label: "New Baseline"},
    {routeName: "baseline-table", label: "Baseline Table"},
];
const treatmentsItems: {routeName: string, label: string}[] = [
    {routeName: "new-treatment", label: "New Treatment"},
];
const brokersItems: {routeName: string, label: string}[] = [
    {routeName: "broker-table", label: "Broker Table"},
    {routeName: "add-broker", label: "Add Broker"},
];
</script>

<template>
    <div class="relative w-64 h-full">
        <div class="h-full bg-slate-100 border-r border-slate-300 w-64 fixed overflow-scroll">
            <router-link class="logo  px-[3.33rem] pt-[1.9rem]" to="/">POWER TAC</router-link>
            <ApplicationNavigationGroup icon="dice-d6" label="Games" path-prefix="/games" :items="gamesItems" />
            <ApplicationNavigationGroup icon="seedling" label="Baselines" path-prefix="/baselines" :items="baselinesItems" />
            <ApplicationNavigationGroup icon="code-branch" label="Treatments" path-prefix="/treatments" :items="treatmentsItems" />
            <ApplicationNavigationGroup icon="chess" label="Brokers" path-prefix="/brokers" :items="brokersItems" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.logo {
    @apply block pb-3;
    @apply text-blue-800 uppercase font-extrabold;
}
</style>
