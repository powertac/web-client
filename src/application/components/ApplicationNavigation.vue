<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import {useAuthStore} from "@/security/domain/AuthStore";
import {api} from "@/api";
import type {User} from "@/user/domain/User";

const router = useRouter();
const user = ref<User|undefined>(useAuthStore().findCurrentUser);

function activeGroup(prefix: string): boolean {
    return router.currentRoute.value.fullPath.startsWith(prefix);
}

function logout(): void {
    api.orchestrator.auth.logout()
        .then(() => router.push("/"))
}
</script>

<template>
    <div class="bg-slate-800 border-r border-slate-300 flex w-full justify-between items-stretch">
        <div class="flex">
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
            <router-link to="/tasks/table" :class="{'nav-item': true, 'active': activeGroup('/tasks')}">
                <icon icon="bars-progress" class="mr-2 text-sm" />
                Tasks
            </router-link>
        </div>
        <div class="text-white items-center flex mr-3">
            <div class="block text-slate-200 font-semibold py-1.5 my-2.5 px-4">
                <icon icon="user" class="mr-2 text-sm" />
                {{user.username}}
            </div>
            <div class="nav-item cursor-pointer hover:border hover:border-slate-200 hover:!text-white hover:bg-slate-600" @click="logout">
                <icon icon="power-off" class="mr-2 text-sm" />
                Logout
            </div>
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
