<script setup lang="ts">
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {ref} from "vue";
import type {Broker} from "@/broker/domain/Broker";
import type {BrokerConfigData} from "@/broker/domain/BrokerConfig";
import BrokerPill from "@/broker/components/BrokerPill.vue";
import BrokerConfigModal from "@/broker/components/BrokerConfigModal.vue";

const emit = defineEmits<{
    (e: 'updated', configs: BrokerConfigData[]): void
}>();

const brokerStore = useBrokerStore();
const loading = ref(false);
const brokerConfigs = ref([] as BrokerConfigData[]);
const selectedBroker = ref<Broker|undefined>();
const brokers = () => brokerStore.findAll()
    .slice()
    .sort((a, b) => {
        const primary = a.name.localeCompare(b.name);
        return primary !== 0 ? primary : a.version.localeCompare(b.version)
    });

const addBrokerConfig = (config: BrokerConfigData): void => {
    brokerConfigs.value.push(config);
    selectedBroker.value = undefined;
}
const createConfigCopy = (config: BrokerConfigData): void => {

}
const removeBrokerConfig = (config: BrokerConfigData): void => {
    const index = brokerConfigs.value.indexOf(config);
    if (index >= 0) {
        brokerConfigs.value.splice(index, 1);
    }
}
</script>

<template>
    <div v-if="loading" class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500 animate-pulse">
        Loading...
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2" v-else>
        <div class="card flex" v-for="broker in brokers()" :key="broker.id" @click="selectedBroker = broker">
            <div class="flex items-center mr-2.5 -ml-1">
                <icon icon="plus-circle" class="text-lg" />
            </div>
            <div>
                <h6 class="font-semibold leading-4 mt-1">
                    {{broker.name}}
                </h6>
                <span class="uppercase text-xs leading-4">{{broker.version}}</span>
            </div>
        </div>
    </div>
    <hr class="mt-2 border-slate-200" />
    <div class="flex flex-col">
        <div v-for="config in brokerConfigs" :key="config.name"
             class="border border-slate-300 rounded bg-slate-50 py-3 px-4 mt-2">
            <div class="flex justify-between">
                <div class="flex items-center">
                    <BrokerPill :broker="brokerStore.findById(config.brokerId)" />
                    <span class="font-semibold ml-3">{{config.name}}</span>
                </div>
                <div>
                    <button type="button" class="button button-sm mr-1.5" @click="createConfigCopy(config)">
                        <icon icon="copy" class="mr-1" />
                        Copy
                    </button>
                    <button type="button" class="button button-sm" @click="removeBrokerConfig(config)">
                        <icon icon="times" class="mr-1" />
                        Remove
                    </button>
                </div>
            </div>
            <div class="mt-1">

            </div>
            <div class="mt-2">
                <pre class="bg-white py-2 px-3 rounded-sm border border-slate-300">{{config.parameters}}</pre>
            </div>
        </div>
    </div>
    <BrokerConfigModal :broker="selectedBroker" v-if="selectedBroker !== undefined"
                       @create="addBrokerConfig" @close="selectedBroker = undefined" />
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
