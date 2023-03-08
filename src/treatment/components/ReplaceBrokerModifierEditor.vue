<script lang="ts" setup>
import BrokerDropdownSelector from "@/broker/components/BrokerDropdownSelector.vue";
import {Broker} from "@/broker/domain/Broker";
import {ModifierType, type NewModifierData, type ReplaceBrokerModifierConfig} from "@/treatment/domain/Modifier";
import {ref} from "vue";

const props = defineProps<{
    brokers: Broker[]
}>();
const emit = defineEmits<{
    (e: "updated", modifier: NewModifierData): void
}>();

const brokerMapping = ref({} as {[key: string]: string});

function replace(original: Broker, replacement: Broker|undefined): void {
    if (replacement !== undefined) {
        brokerMapping.value[original.id] = replacement.id;
        if (isValid(brokerMapping.value)) {
            const config: ReplaceBrokerModifierConfig = {brokerMapping: brokerMapping.value};
            emit("updated", { type: ModifierType.ReplaceBroker, config });
        }
    }
}

function isValid(mapping: {[key: string]: string}): boolean {
    const replacedIds = Object.keys(mapping)
        .filter((originalId) => originalId !== brokerMapping.value[originalId]);
    console.log(replacedIds);
    const atLeastOneReplaced = replacedIds.length > 0;
    console.log("at least one replaced", atLeastOneReplaced)
    // circular replacement: brokers should not be replaced with brokers from the original set
    const hasCircularReplacement = replacedIds.filter(id => Object.keys(props.brokers).includes(mapping[id])).length > 0;
    console.log("has circular", hasCircularReplacement);
    return atLeastOneReplaced && !hasCircularReplacement;
}
</script>

<template>
    <div class="bg-stone-50 px-2 py-1 border border-stone-300 rounded-sm mt-2">
        <div v-for="broker in props.brokers" class="grid grid-cols-12 items-center my-1">
            <div class="col-span-4 items-center flex pl-5">
                <span class="font-semibold text-stone-700">{{broker.name}}</span>
                <span class="uppercase text-xs ml-2">{{broker.version}}</span>
            </div>
            <div  class="col-span-2 text-center text-slate-600 text-sm"><icon icon="arrow-right" /></div>
            <div class="col-span-6 flex items-stretch">
                <BrokerDropdownSelector :original="broker" @selected="replacement => replace(broker, replacement)" />
            </div>
        </div>
        <p class="px-5 mb-4 italic text-stone-600">Please select at least one broker replacement.</p>
    </div>
</template>
