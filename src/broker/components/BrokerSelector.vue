<script setup lang="ts">
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {onMounted, ref} from "vue";
import type {Broker} from "@/broker/domain/Broker";

const emit = defineEmits<{
    (e: 'updated', brokers: Broker[]): void
}>();

const brokerStore = useBrokerStore();
const loading = ref(false);
const brokers = ref<Broker[]>([]);
const selectedBrokerIds = ref<Set<Broker>>(new Set<Broker>());

const toggleBroker = (broker: Broker): void => {
    if (selectedBrokerIds.value.has(broker)) {
        selectedBrokerIds.value.delete(broker);
    } else {
        selectedBrokerIds.value.add(broker);
    }
    emit('updated', Array.from(selectedBrokerIds.value));
}

onMounted(() => brokerStore.fetchAll()
    .then(() => brokers.value = brokerStore.findAll())
    .catch((e) => console.error("unable to load brokers", e)));
</script>

<template>
    <div v-if="loading" class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500 animate-pulse">
        Loading...
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2" v-else>
        <div class="card flex" v-for="broker in brokers" :key="broker.id" @click="toggleBroker(broker)" :class="{'selected': selectedBrokerIds.has(broker)}">
            <div>
                <h6 class="font-semibold leading-4 mt-1">
                    {{broker.name}}
                    <icon icon="check" v-if="selectedBrokerIds.has(broker)" />
                </h6>
                <span class="uppercase text-xs leading-4">{{broker.version}}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.broker-pill {
    @apply rounded-sm px-5 py-3 border border-stone-300 bg-stone-50 cursor-pointer m-[1px];
    h6 { @apply font-semibold; }
    &.selected {
        @apply border-emerald-400 bg-emerald-50 text-emerald-800 border-2 m-0;
    }
}
</style>
