<script lang="ts" setup>
import DatatableHeader from "@/datatable/DatatableHeader.vue";
import GameGroupProgressBar from "@/game/components/GameGroupProgressBar.vue";
import {onMounted, ref} from "vue";
import {Baseline} from "@/baseline/domain/Baseline";
import {Dataset, SortOrder} from "@/util/Dataset";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {Treatment} from "@/treatment/domain/Treatment";
import {datetime} from "@/util/DateTimeFormat";

const treatmentStore = useTreatmentStore();
const selectedTreatment = ref<Treatment>();
const treatments = ref(null as Dataset<Treatment>|null);
const columns: { [name: string]: (a: Treatment, b: Treatment) => number } = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Name": (a, b) => a.name.localeCompare(b.name),
    "Progress": (a, b) => a.progress - b.progress,
    "Created at": (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis(),
};

function isSelected(game: Baseline): boolean {
    return selectedTreatment.value !== undefined
        && selectedTreatment.value.id === game.id;
}

function createDataset(): Dataset<Treatment> {
    return Dataset.create(columns, treatmentStore.findAll())
        .orderBy("Created at", SortOrder.DESC);
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (treatments.value !== null) {
        if (event.ctrlKey) {
            treatments.value.toggle(column)
        } else {
            const currentIndex = treatments.value.index(column);
            const currentOrder = treatments.value.order(column);
            treatments.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                treatments.value.orderBy(column, currentOrder);
            }
            treatments.value.toggle(column);
        }
    }
}

onMounted(() => treatmentStore.fetchAllOnce()
    .then(() => treatments.value = createDataset())
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex flex-col h-full bg-slate-50" ref="root">
        <div class="grow overflow-scroll">
            <table class="datatable bg-white" v-if="treatments">
                <thead>
                <tr>
                    <DatatableHeader v-for="column in Object.keys(columns)"
                                     :class="{'left-aligned': (column === 'Name' || column === 'Progress' || column === 'ID')}"
                                     :name="column" :index="treatments.index(column)" :order="treatments.order(column)"
                                     @click="(event) => toggleSorting(column, event)" />
                </tr>
                </thead>
                <tbody>
                <tr v-for="treatment in treatments.items" :key="treatment.id" @click="selectedTreatment = treatment" class="selectable" :class="{'selected': isSelected(treatment)}">
                    <td class="!text-left font-mono w-96">{{treatment.id}}</td>
                    <td class="!text-left">{{treatment.name}}</td>
                    <td class="font-mono">
                        <GameGroupProgressBar :group="treatment" />
                    </td>
                    <td class="font-mono">{{datetime(treatment.createdAt)}}</td>
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
    </div>
</template>
