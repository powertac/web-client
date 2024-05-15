<script lang="ts" setup>
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {computed, onMounted, ref} from "vue";
import type {Baseline} from "@/baseline/domain/Baseline";
import {Align, Compare, View} from "@/util/datatable/View";
import {datetime} from "@/util/DateTimeFormat";
import BaselinesHeader from "@/baseline/components/BaselinesHeader.vue";
import Datatable from "@/util/datatable/Datatable.vue";
import GameGroupProgressBar from "@/game/components/GameGroupProgressBar.vue";
import TableSelectedBaseline from "@/baseline/components/TableSelectedBaseline.vue";

const baselineStore = useBaselineStore();
const baselines = computed(() => baselineStore.isReady ? baselineStore.findAll() : []);
const baselinesLoading = computed(() => !baselineStore.isReady);
const baselineTable = ref(null);

const view = new View<Baseline>()
    .field("ID", b => b.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Name", b => b.name, Compare.number, {align: Align.LEFT})
    .field("Progress", b => b.progress, Compare.number)
    .field("Created at", b => b.createdAt, Compare.date, {align: Align.RIGHT, formatFn: datetime, classes: ['font-mono']})
    .orderBy("Created at", true)
    .orderBy("Progress", true);

function toggleSelect(): void {
    if (baselineTable.value !== null) {
        baselineTable.value.toggleSelect();
    }
}

onMounted(() => baselineStore.fetchAll().catch(e => console.error("unable to fetch baselines", e)));
</script>

<template>
    <div class="flex grow flex-col">
        <BaselinesHeader />
        <div class="grow">
            <Datatable :view="view" :items="baselines" :loading="baselinesLoading" :selectable="true" ref="baselineTable">
                <template #Progress="props">
                    <td>
                        <GameGroupProgressBar :group="(props.item as Baseline)"
                                              :muted="props.selected !== undefined && props.selected?.id !== props.item.id" />
                    </td>
                </template>
                <template #selected-item="props">
                    <td>
                        <TableSelectedBaseline :baseline="(props.item as Baseline)" @close-self="toggleSelect" />
                    </td>
                </template>
            </Datatable>
        </div>
    </div>
</template>