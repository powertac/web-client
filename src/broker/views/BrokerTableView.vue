<script lang="ts" setup>
import {ref} from "vue";
import {Dataset, SortOrder} from "@/util/Dataset";
import DatatableHeader from "@/util/datatable/DatatableHeaderField.vue";
import {Broker} from "@/broker/domain/Broker";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import BrokersHeader from "@/broker/components/BrokersHeader.vue";

const brokerStore = useBrokerStore();
const selectedBroker = ref<Broker>();
const columns: {[name: string]: (a: Broker, b: Broker) => number} = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Status": (a, b) => Number(a.enabled) - Number(b.enabled),
    "Name": (a, b) => a.name.localeCompare(b.name),
    "Version": (a, b) => a.version.localeCompare(b.version),
    "Image Tag": (a, b) => a.imageTag.localeCompare(b.imageTag),
};
const brokers = ref(createDataset());

function isSelected(broker: Broker): boolean {
    return selectedBroker.value !== undefined
        && selectedBroker.value.id === broker.id;
}

function createDataset(): Dataset<Broker> {
    return Dataset.create(columns, brokerStore.findAll())
        .orderBy("Status", SortOrder.ASC)
        .orderBy("Name", SortOrder.ASC)
        .orderBy("Version", SortOrder.ASC);
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (event.ctrlKey) {
        brokers.value.toggle(column)
    } else {
        const currentIndex = brokers.value.index(column);
        const currentOrder = brokers.value.order(column);
        brokers.value.reset();
        if (currentIndex !== null && currentOrder !== null) {
            brokers.value.orderBy(column, currentOrder);
        }
        brokers.value.toggle(column);
    }
}
</script>

<template>
    <div class="flex grow flex-col" ref="root">
        <BrokersHeader />
        <div class="flex relative grow">
            <div class="table-wrapper border-r border-slate-300 grow">
                <table class="datatable bg-white" v-if="brokers">
                    <thead>
                    <tr>
                        <DatatableHeader v-for="column in Object.keys(columns)"
                                         :class="{'left-aligned': (column === 'Name' || column === 'Version' || column === 'Image Tag' || column === 'ID')}"
                                         :name="column" :index="brokers.index(column)" :order="brokers.order(column)"
                                         @click="(event) => toggleSorting(column, event)" />
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="broker in brokers.items" :key="broker.id" @click="selectedBroker = broker" class="selectable" :class="{'selected': isSelected(broker)}">
                        <td class="!text-left font-mono w-96">{{broker.id}}</td>
                        <td class="uppercase text-xs">{{broker.enabled ? 'AVAILABLE' : 'DISABLED'}}</td>
                        <td class="!text-left">{{broker.name}}</td>
                        <td class="!text-left uppercase text-xs">{{broker.version}}</td>
                        <td class="!text-left font-mono">{{broker.imageTag}}</td>

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
    </div>
</template>
