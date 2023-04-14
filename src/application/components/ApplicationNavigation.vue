<script lang="ts" setup>
import {useRouter} from "vue-router";
const router = useRouter();
function activeGroup(prefix: string): boolean {
    return router.currentRoute.value.fullPath.startsWith(prefix);
}
</script>

<template>
    <div>
        <div class="bg-slate-800 border-r border-slate-300 flex w-full">
            <router-link class="block text-slate-400 uppercase font-extrabold py-4 pl-9 pr-7 self-center hover:text-white" to="/">Power TAC</router-link>
            <router-link to="/games/table" :class="{'nav-item': true, 'active': activeGroup('/games')}">
                <icon icon="dice-d6" class="mr-2 text-sm" />
                Games
            </router-link>
            <router-link to="/baselines/table" :class="{'nav-item': true, 'active': activeGroup('/baselines')}">
                <icon icon="seedling" class="mr-2 text-sm" />
                Baselines
            </router-link>
            <router-link to="/treatments/table" :class="{'nav-item': true, 'active': activeGroup('/treatments')}">
                <icon icon="code-branch" class="mr-2 text-sm" />
                Treatments
            </router-link>
            <router-link to="/brokers/table" :class="{'nav-item': true, 'active': activeGroup('/brokers')}">
                <icon icon="chess" class="mr-2 text-sm" />
                Brokers
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    @apply block rounded border border-transparent text-slate-200 font-semibold py-1.5 my-2.5 px-4 hover:text-slate-400;
    &.active {
        @apply text-white border-slate-500;
    }
}
</style>
