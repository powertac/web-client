<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import GameGroupStatusBlock from "@/game/components/GameGroupStatusBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {Treatment} from "@/treatment/domain/Treatment";
import TreatmentPageHeader from "@/treatment/components/TreatmentPageHeader.vue";
import TreatmentMetaBlock from "@/treatment/components/TreatmentMetaBlock.vue";

const treatmentStore = useTreatmentStore();
const treatmentId = useRouter().currentRoute.value.params.id as string;
const treatment = ref<Treatment>();

onMounted(() => treatmentStore.fetchOnceById(treatmentId)
    .then(() => treatment.value = treatmentStore.findById(treatmentId))
    .catch((error) => console.error(error)));
</script>

<template>
    <div v-if="treatment !== undefined">
        <TreatmentPageHeader :treatment="treatment" />
        <div class="max-w-screen-lg mx-auto mb-20">
            <div class="flex gap-2 mx-5 flex-wrap mt-10">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Meta</h2>
                <TreatmentMetaBlock :treatment="treatment" />
                <GameGroupStatusBlock :games="treatment.games" />
            </div>
            <div class="flex gap-2 mx-5 mt-10 flex-wrap">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Configuration</h2>
                <BrokersBlock :brokers="treatment.config.brokers" />
                <WeatherBlock :weather="treatment.config.weather" />
                <ParametersBlock :parameters="treatment.config.parameters" />
            </div>
        </div>
    </div>
    <div v-else>
        <!-- TODO : add loader -->
        LOADING...
    </div>
</template>
