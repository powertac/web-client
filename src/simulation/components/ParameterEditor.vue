<script setup lang="ts">
import {useParameterStore} from "@/simulation/domain/ParameterStore";
import {ref, watch} from "vue";
import Autocomplete from "@/util/components/Autocomplete.vue";
import ParameterValue from "@/simulation/components/ParameterValue.vue";

const emit = defineEmits<{
    (e: "updated", parameter: {[key: string]: string}): void
}>();

const search = ref("");
const parameterStore = useParameterStore();
const parameters = ref({} as {[key: string]: string});

function add(parameter: string): void {
    if (Object.keys(parameters.value).filter((key) => key === parameter).length === 0) {
        parameters.value[parameter] = "";
    }
    search.value = "";
}

function remove(parameter: string): void {
    delete parameters.value[parameter];
}

watch(parameters, () => emit("updated", parameters.value), {deep: true})
</script>

<template>
    <div>
        <div class="grid grid-cols-12 w-full mb-2" v-for="parameter in Object.keys(parameters).sort()" :key="parameter">
            <ParameterValue :parameter="parameter" :value="parameters[parameter]" @updated="(newValue) => parameters[parameter] = newValue" />
            <button type="button" class="button col-span-2 ml-2" @click="remove(parameter)">Remove</button>
        </div>
        <div>
            <Autocomplete placeholder="Parameter" :value="search" class="font-mono" :items="parameterStore.findAll()" @selected="add" />
        </div>
    </div>
</template>
