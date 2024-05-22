<script lang="ts" setup>
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {computed, onMounted, ref} from "vue";
import type {Broker} from "@/broker/domain/Broker";
import {Align, Compare, View} from "@/util/datatable/View";
import BrokersHeader from "@/broker/components/BrokersHeader.vue";
import Datatable from "@/util/datatable/Datatable.vue";

const brokerStore = useBrokerStore();
const brokers = computed(() => brokerStore.isReady ? brokerStore.findAll() : []);
const brokersLoading = computed(() => !brokerStore.isReady);
const brokerTable = ref(null);

const view = new View<Broker>()
    .field("ID", b => b.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Status", b => b.enabled, Compare.boolean, {align: Align.CENTER})
    .field("Name", b => b.name, Compare.string, {align: Align.LEFT})
    .field("Version", b => b.version, Compare.string)
    .field("Image Tag", b => b.imageTag, Compare.string, {align: Align.LEFT, classes: ['font-mono']})
    .orderBy("Name")
    .orderBy("Version");

onMounted(() => brokerStore.fetchAll().catch(e => console.error("unable to fetch brokers", e)));
</script>

<template>
    <div class="flex grow flex-col">
        <BrokersHeader />
        <div class="grow">
            <Datatable :view="view" :items="brokers" :loading="brokersLoading" :selectable="false" ref="brokerTable">
                <template #Status="props">
                    <td class="text-center uppercase text-xs">
                        {{(props.item as Broker).enabled ? 'available' : 'disabled'}}
                    </td>
                </template>
            </Datatable>
        </div>
    </div>
</template>