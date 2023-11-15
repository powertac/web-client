<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {api} from "@/api";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import type {Game} from "@/game/domain/Game";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import TreatmentLogProcessors from "@/treatment/components/TreatmentLogProcessors.vue";
import TreatmentPageHeader from "@/treatment/components/TreatmentPageHeader.vue";
import TreatmentAnalyzers from "@/treatment/components/TreatmentAnalyzers.vue";
import type {Treatment} from "@/treatment/domain/Treatment";

const treatmentStore = useTreatmentStore();
const treatmentId = useRouter().currentRoute.value.params.id as string;
const treatment = ref<Treatment>();
const artifacts = ref<Map<Game, LogProcessorArtifact[]>>();

onMounted(() => treatmentStore.fetchOnceById(treatmentId)
    .then(() => treatment.value = treatmentStore.findById(treatmentId))
    .catch((error) => console.error(error)));
watch(treatment, () =>
    api.orchestrator.processors.getTreatmentArtifacts(treatmentId)
        .then(a => {
            console.log("load")
            const artifactMap = new Map();
            treatment.value?.games.map(g => artifactMap.set(g.id, a[g.id]))
            artifacts.value = artifactMap
        })
        .catch(e => console.error("unable to load log processor artifacts for treatment", e))
)
</script>


<template>
    <div v-if="treatment !== undefined && artifacts !== undefined">
        <TreatmentPageHeader :treatment="treatment" />
        <div class="max-w-screen-md mx-auto pb-20">
            <TreatmentLogProcessors :treatment="treatment" :artifacts="artifacts" />
            <TreatmentAnalyzers :treatment="treatment" :artifacts="artifacts" />
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>