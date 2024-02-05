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
    <div class="bg-white flex w-full justify-between items-stretch border-b border-slate-300">
        <div class="flex">
            <router-link class="block text-blue-800 uppercase font-extrabold py-4 pl-9 pr-7 self-center" to="/">Power TAC</router-link>
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
        <div class="flex" v-if="user">
            <div class="border-x border-slate-300 pl-7 pr-4 flex items-center bg-slate-50" v-if="user.isAdmin">
                <span class="text-slate-500 font-semibold uppercase text-sm mr-6">System</span>
                <router-link class="mr-2 darker" to="/users/table" :class="{'nav-item': true, 'active': activeGroup('/users')}">
                    <icon icon="users" class="mr-2 text-sm" />
                    Users
                </router-link>
                <!--
                <router-link class="darker" to="/users/table" :class="{'nav-item': true, 'active': activeGroup('/system')}">
                    <icon icon="gear" class="mr-2 text-sm" />
                    Config
                </router-link>
                -->
            </div>
            <div class="text-white items-center flex mx-3">
                <div class="block text-slate-600 py-1.5 my-2.5 px-4">
                    <icon icon="user" class="mr-2 text-sm" />
                    {{user.username}}
                </div>
                <div class="nav-item cursor-pointer" @click="logout">
                    <icon icon="power-off" class="mr-2 text-sm" />
                    Logout
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    @apply block rounded border border-transparent mr-1 text-slate-600 py-1.5 my-2.5 px-4 hover:text-slate-900 hover:border-slate-300;
    &.darker { @apply hover:border-slate-400}
    &.active {
        @apply text-slate-800 border-slate-300 bg-slate-50;
        &.darker {
            @apply bg-slate-200 border-slate-400;
        }
    }
}
</style>
