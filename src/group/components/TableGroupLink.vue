<script lang="ts" setup>
import {computed} from "vue";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Treatment} from "@/treatment/domain/Treatment";
import {GameGroupType} from "@/game/domain/GameGroup";

const props = defineProps<{
    group: Baseline|Treatment|null,
    muted: boolean,
    selected: boolean
}>();

const name = computed(() => props.group !== null ? props.group.name : "");
const groupType = computed(() => props.group !== null ? props.group.type : null);
const routeName = computed(() => {
    switch (groupType.value) {
        case GameGroupType.Baseline: return "baseline-details";
        case GameGroupType.Treatment: return "treatment-details";
        default: return null;
    }
});
const route = computed(() => props.group !== null ? {name: routeName.value, params: { id: props.group.id }} : null);
const badgeStyles = computed(() => props.muted
    ? ['bg-slate-200', 'border-slate-300']
    : props.selected
        ? ['bg-white', 'border-blue-300', 'text-blue-800']
        : ['bg-slate-50', 'border-slate-200', 'text-slate-600']);
</script>

<template>
    <div v-if="group !== null">
        <div class="inline-block px-2.5 rounded-sm border mr-2 -m-[1px]" :class="badgeStyles">
            {{groupType}}
        </div>
        <router-link :class="!muted ? ['link'] : []" :to="route">{{name}}</router-link>
    </div>
    <div v-else>&mdash;</div>
</template>