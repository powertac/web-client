<script lang="ts" setup>
import {computed, ref} from "vue";
import router from "@/router";

const props = defineProps<{
    pathPrefix: string,
    icon: string,
    label: string,
    items: {routeName: string, label: string}[]
}>();
const open = ref(true);
const activeGroup = computed(() => router.currentRoute.value.fullPath.startsWith(props.pathPrefix));

function activeRoute(name: string): boolean {
    return router.currentRoute.value.name === name;
}
</script>

<template>
    <div class="ml-6 px-5 py-3 text-slate-500 hover:text-slate-700">
        <h2 class="uppercase font-semibold mb-1 flex items-center cursor-pointer" @click="open = !open"
            :class="{'!text-blue-700': activeGroup}">
            <icon :icon="props.icon" class="mr-1.5 w-6 -mt-[1px]" />
            <span class="ml-1">{{props.label}}</span>
            <icon :icon="open ? 'angle-up' : 'angle-down'" class="text-sm ml-3.5 -mt-[1px]" />
        </h2>
        <div class="ml-2.5 border-l pl-2 border-blue-400 py-1"
             :class="{'border-slate-400': !activeGroup, 'text-slate-600': activeGroup}"
             v-if="open">
            <router-link class="nav-item" :to="{name: item.routeName}" v-for="item in props.items" :key="item.routeName">
                <icon icon="caret-right" v-if="activeRoute(item.routeName)" class="mr-1" />
                {{item.label}}
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    @apply block py-1 px-3 hover:text-black;
    &.router-link-active {
        @apply text-blue-700 font-semibold;
    }
}
</style>
