<script lang="ts" setup>
import {Baseline} from "@/baseline/domain/Baseline";
import {ModifierType} from "@/treatment/domain/Modifier";
import {computed, ref} from "vue";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import BrokerDropdownSelector from "@/broker/components/BrokerDropdownSelector.vue";
import {Broker} from "@/broker/domain/Broker";
import ParameterEditor from "@/simulation/components/ParameterEditor.vue";

const props = defineProps<{
    baseline: Baseline
}>();

const brokerStore = useBrokerStore();
const type = ref<ModifierType>();
const brokerReplacements = ref(new Map<Broker, Broker>());
const brokersReplaced = computed(() => Array.of(...brokerReplacements.value.entries())
    .filter(e => e[0].id !== e[1].id)
    .length > 0);

function replace(original: Broker, replacement: Broker|undefined): void {
    if (replacement !== undefined) {
        brokerReplacements.value.set(original, replacement);
    }
}

</script>

<template>
    <div>
        <div class="grid grid-cols-3 gap-2">
            <div class="card" @click="type = ModifierType.ReplaceBroker" :class="{'selected': type === ModifierType.ReplaceBroker}">
                <h2 class="card-title">
                    <span>Broker Replacement</span>
                    <icon icon="check" class="text-xs ml-1.5 mb-0.5" v-if="type === ModifierType.ReplaceBroker" />
                </h2>
                <p class="mt-0.5">Replace one (or more) broker(s) by another one.</p>
            </div>
            <div class="card" @click="type = ModifierType.ParameterSet" :class="{'selected': type === ModifierType.ParameterSet}">
                <h2 class="card-title">
                    <span>Parameter Set</span>
                    <icon icon="check" class="text-xs ml-1.5 mb-0.5" v-if="type === ModifierType.ParameterSet" />
                </h2>
                <p class="mt-0.5">Update the server parameter set to change or remove parameter values.</p>
            </div>
        </div>
        <div v-if="type === ModifierType.ReplaceBroker" class="bg-stone-50 px-2 py-1 border border-stone-300 rounded-sm mt-2">
            <div v-for="broker in props.baseline.config.brokers" class="grid grid-cols-12 items-center my-1">
                <div class="col-span-4 items-center flex pl-5">
                    <span class="font-semibold text-stone-700">{{broker.name}}</span>
                    <span class="uppercase text-xs ml-2">{{broker.version}}</span>
                </div>
                <div  class="col-span-2 text-center text-slate-600 text-sm"><icon icon="arrow-right" /></div>
                <div class="col-span-6 flex items-stretch">
                    <BrokerDropdownSelector :original="broker" @selected="replacement => replace(broker, replacement)" />
                </div>
            </div>
            <p v-if="!brokersReplaced">Please select a replacement for at least one broker. {{brokerReplacements.size}}</p>
        </div>
        <div v-else-if="type === ModifierType.ParameterSet" class="bg-stone-50 px-2 py-2 border border-stone-300 rounded-sm mt-2">
            <ParameterEditor />
        </div>
    </div>
</template>
