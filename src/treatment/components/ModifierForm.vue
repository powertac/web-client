<script lang="ts" setup>
import {Baseline} from "@/baseline/domain/Baseline";
import {ModifierType, type NewModifierData} from "@/treatment/domain/Modifier";
import {ref, watch} from "vue";
import ParameterEditor from "@/simulation/components/ParameterEditor.vue";
import ReplaceBrokerModifierEditor from "@/treatment/components/ReplaceBrokerModifierEditor.vue";
import {parametersValid} from "@/simulation/ParameterValidator";

const props = defineProps<{
    baseline: Baseline
}>();

const emit = defineEmits<{
    (e: "updated", modifier: NewModifierData|undefined): void
}>();

const type = ref<ModifierType>();
const parameters = ref({} as {[key: string]: string});

watch(parameters, (updatedParameters) => {
    if (type.value === ModifierType.ParameterSet) {
        const config = parametersValid(updatedParameters)
            ? {type: ModifierType.ParameterSet, config: {parameters: updatedParameters}}
            : undefined;
        emit("updated", config);
    }
}, {deep: true});
</script>

<template>
    <div>
        <div class="grid grid-cols-3 gap-2">
            <div class="card" @click="type = ModifierType.ReplaceBroker" :class="{'selected': type === ModifierType.ReplaceBroker}">
                <h2 class="card-title">
                    <span>Broker Replacement</span>
                    <icon icon="check" class="text-xs ml-1.5 mb-0.5" v-if="type === ModifierType.ReplaceBroker" />
                </h2>
                <p class="mt-0.5">Choose replacements for one or more brokers.</p>
            </div>
            <div class="card" @click="type = ModifierType.ParameterSet" :class="{'selected': type === ModifierType.ParameterSet}">
                <h2 class="card-title">
                    <span>Parameter Set</span>
                    <icon icon="check" class="text-xs ml-1.5 mb-0.5" v-if="type === ModifierType.ParameterSet" />
                </h2>
                <p class="mt-0.5">Update the server parameter set to change or remove parameter values.</p>
            </div>
        </div>
        <ReplaceBrokerModifierEditor v-if="type === ModifierType.ReplaceBroker"
                                     :brokers="props.baseline.config.brokers"
                                     @updated="(modifier) => emit('updated', modifier)" />
        <div v-else-if="type === ModifierType.ParameterSet" class="bg-stone-50 px-2 py-2 border border-stone-300 rounded-sm mt-2">
            <ParameterEditor @updated="newParams => parameters = newParams" />
            <p class="px-2 mt-3 mb-2 italic text-stone-600">Please define at least one parameter.</p>
        </div>
    </div>
</template>
