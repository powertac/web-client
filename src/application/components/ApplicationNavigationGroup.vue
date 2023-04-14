<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const props = defineProps<{
    pathPrefix: string,
    icon: string,
    label: string,
    items: {routeName: string, label: string}[]
}>();
const router = useRouter();
const open = ref(false);
const activeGroup = computed(() => router.currentRoute.value.fullPath.startsWith(props.pathPrefix));
const root = ref<HTMLElement>();
const button = ref<HTMLElement>();
const dropdown = ref<HTMLElement>();

function activeRoute(name: string): boolean {
    return router.currentRoute.value.name === name;
}

function handleClickOutsideRunSelection(event: Event): void {
    if (root.value !== undefined && !(root.value as HTMLDivElement).contains(event.target as Node)) {
        open.value = false;
    }
}
onMounted(() => document.addEventListener('click', handleClickOutsideRunSelection));
</script>

<template>
    <div class="ml-6 py-3 text-slate-100 relative" ref="root">
        <h2 class="font-semibold flex items-center cursor-pointer rounded border border-slate-800 pl-2.5 pr-4 py-1.5 z-50" @click="open = !open"
            :class="{'!border-slate-300': activeGroup}"
            ref="button">
            <icon :icon="props.icon" class="mr-0.5 w-6 text-sm" />
            <span class="ml-1">{{props.label}}</span>
        </h2>
        <!--<div class="absolute border border-slate-300 bg-white top-full self-center -mt-2 rounded py-1 z-40 dropdown"
             :class="{'text-slate-600': activeGroup}"
             v-if="open"
             ref="dropdown"
             :style="{'margin-left': (button?.clientWidth - dropdown?.clientWidth) / 2 + 'px'}">
            <router-link class="nav-item" :to="{name: item.routeName}" v-for="item in props.items" :key="item.routeName" @click="open = false">
                {{item.label}}
            </router-link>
        </div>-->
    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    @apply block py-2 px-5 text-slate-600 break-keep;
    &.router-link-active {
        @apply text-slate-900 bg-slate-100;
    }
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
