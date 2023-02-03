<script setup lang="ts">
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {ref} from "vue";
import type {Broker} from "@/broker/domain/Broker";
import {Selection} from "@/util/Selection";

const emit = defineEmits<{
    (e: 'selected', parameter: Broker[]): void
}>();

const brokerStore = useBrokerStore();
const loading = ref(true);
const selection = ref(new Selection<Broker>());
const brokers = () => brokerStore.findAll()
    .slice()
    .sort((a, b) => {
        const primary = a.name.localeCompare(b.name);
        return primary !== 0 ? primary : a.version.localeCompare(b.version)
    });

function select(broker: Broker): void {
    selection.value.toggle(broker);
    emit('selected', selection.value.entities);
}
</script>

<template>
    <div v-if="loading" class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500 animate-pulse">
        Loading...
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2" v-else>
        <div class="card" :class="{'selected': selection.includes(broker)}"
             v-for="broker in brokers()" :key="broker.id"
             @click="select(broker)">
            <h6 class="card-title">
                {{broker.name}}
                <icon icon="check" class="text-xs ml-1.5 mb-0.5" v-if="selection.includes(broker)" />
            </h6>
            <span class="uppercase text-xs">{{broker.version}}</span>
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
