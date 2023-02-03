<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {datetime} from "@/util/DateTimeFormat";
import {Dataset, SortOrder} from "@/util/Dataset";
import DatatableHeader from "@/datatable/DatatableHeader.vue";
import {Baseline} from "@/baseline/domain/Baseline";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import BaselineBar from "@/baseline/components/BaselineDetails.vue";
import GameGroupProgressBar from "@/util/components/GameGroupProgressBar.vue";

const baselineStore = useBaselineStore();
const selectedBaseline = ref<Baseline>();
const baselines = ref(null as Dataset<Baseline>|null);
const columns: { [name: string]: (a: Baseline, b: Baseline) => number } = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Name": (a, b) => a.name.localeCompare(b.name),
    "Progress": (a, b) => a.progress - b.progress,
    "Created at": (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis(),
};

function isSelected(game: Baseline): boolean {
    return selectedBaseline.value !== undefined
        && selectedBaseline.value.id === game.id;
}

function createDataset(): Dataset<Baseline> {
    return Dataset.create(columns, baselineStore.findAll())
        .orderBy("Created at", SortOrder.DESC);
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (baselines.value !== null) {
        if (event.ctrlKey) {
            baselines.value.toggle(column)
        } else {
            const currentIndex = baselines.value.index(column);
            const currentOrder = baselines.value.order(column);
            baselines.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                baselines.value.orderBy(column, currentOrder);
            }
            baselines.value.toggle(column);
        }
    }
}

onMounted(() => baselineStore.fetchAllOnce()
    .then(() => baselines.value = createDataset())
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex flex-col h-full bg-slate-50" ref="root">
        <div class="grow overflow-scroll">
            <table class="datatable bg-white" v-if="baselines">
                <thead>
                <tr>
                    <DatatableHeader v-for="column in Object.keys(columns)"
                                     :class="{'left-aligned': (column === 'Name' || column === 'Progress' || column === 'ID')}"
                                     :name="column" :index="baselines.index(column)" :order="baselines.order(column)"
                                     @click="(event) => toggleSorting(column, event)" />
                </tr>
                </thead>
                <tbody>
                <tr v-for="baseline in baselines.items" :key="baseline.id" @click="selectedBaseline = baseline" class="selectable" :class="{'selected': isSelected(baseline)}">
                    <td class="!text-left font-mono w-96">{{baseline.id}}</td>
                    <td class="!text-left">{{baseline.name}}</td>
                    <td class="font-mono">
                        <GameGroupProgressBar :group="baseline" />
                    </td>
                    <td class="font-mono">{{datetime(baseline.createdAt)}}</td>
                </tr>
                </tbody>
            </table>
            <table class="datatable bg-white" v-else>
                <thead>
                <tr>
                    <th>Status</th>
                    <th class="!text-left">ID</th>
                    <th class="!text-left">Baseline / Treatment</th>
                    <th class="!text-left">Name</th>
                    <th>Created at</th>
                    <th>Completed at</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                </tr>
                <tr>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                </tr>
                <tr>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                </tr>
                </tbody>
            </table>
        </div>
        <BaselineBar :baseline="selectedBaseline" v-if="selectedBaseline !== undefined" @close-self="() => selectedBaseline = undefined" />
    </div>
</template>
