<script lang="ts" setup>
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {computed, onMounted, ref} from "vue";
import {Align, Compare, View} from "@/util/datatable/View";
import type {Baseline} from "@/baseline/domain/Baseline";
import {datetime} from "@/util/DateTimeFormat";
import type {Treatment} from "@/treatment/domain/Treatment";
import GameGroupProgressBar from "@/game/components/GameGroupProgressBar.vue";
import Datatable from "@/util/datatable/Datatable.vue";
import TreatmentsHeader from "@/treatment/components/TreatmentsHeader.vue";
import TableSelectedTreatment from "@/treatment/components/TableSelectedTreatment.vue";

const treatmentStore = useTreatmentStore();
const treatments = computed(() => treatmentStore.isReady ? treatmentStore.findAll() : []);
const treatmentsLoading = computed(() => !treatmentStore.isReady);
const treatmentTable = ref(null);

const view = new View<Treatment>()
    .field("ID", t => t.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Name", t => t.name, Compare.string, {align: Align.LEFT})
    .field("Baseline", t => t.baseline.name, Compare.string, {align: Align.LEFT})
    .field("Modifier", t => t.modifier.type, Compare.string)
    .field("Progress", t => t.progress, Compare.number)
    .field("Created at", t => t.createdAt, Compare.date, {align: Align.RIGHT, formatFn: datetime, classes: ['font-mono']})
    .orderBy("Created at", true)
    .orderBy("Progress", true);

function toggleSelect(): void {
    if (treatmentTable.value !== null) {
        treatmentTable.value.toggleSelect();
    }
}

onMounted(() => treatmentStore.fetchAll().catch(e => console.error("unable to fetch treatments", e)));
</script>

<template>
    <div class="flex grow flex-col">
        <TreatmentsHeader />
        <div class="grow">
            <Datatable :view="view" :items="treatments" :loading="treatmentsLoading" :selectable="true" ref="treatmentTable">
                <template #Progress="props">
                    <td>
                        <GameGroupProgressBar :group="(props.item as Treatment)"
                                              :muted="props.selected !== undefined && props.selected?.id !== props.item.id" />
                    </td>
                </template>
                <template #selected-item="props">
                    <td>
                        <TableSelectedTreatment :treatment="(props.item as Treatment)" @close-self="toggleSelect" />
                    </td>
                </template>
            </Datatable>
        </div>
    </div>
</template>