<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {Baseline} from "@/baseline/domain/Baseline";
import BaselinePageHeader from "@/baseline/components/BaselinePageHeader.vue";
import BaselineMetaBlock from "@/baseline/components/BaselineMetaBlock.vue";
import GameGroupStatusBlock from "@/game/components/GameGroupStatusBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";

const baselineStore = useBaselineStore();
const baselineId = useRouter().currentRoute.value.params.id as string;
const baseline = ref<Baseline>();

onMounted(() => baselineStore.fetchOnceById(baselineId)
    .then(() => baseline.value = baselineStore.findById(baselineId))
    .catch((error) => console.error(error)));
</script>

<template>
    <div v-if="baseline !== undefined">
        <BaselinePageHeader :baseline="baseline" />
        <div class="max-w-screen-lg mx-auto mb-20">
            <div class="flex gap-2 mx-5 flex-wrap mt-10">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Meta</h2>
                <BaselineMetaBlock :baseline="baseline" />
                <GameGroupStatusBlock :games="baseline.games" />
            </div>
            <div class="flex gap-2 mx-5 mt-10 flex-wrap">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Configuration</h2>
                <BrokersBlock :brokers="baseline.config.brokers" />
                <WeatherBlock :weather="baseline.config.weather" />
                <ParametersBlock :parameters="baseline.config.parameters" />
            </div>
        </div>
    </div>
    <div v-else>
        <!-- TODO : add loader -->
        LOADING...
    </div>
</template>
