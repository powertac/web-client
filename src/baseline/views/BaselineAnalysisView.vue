<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {api} from "@/api";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import BaselinePageHeader from "@/baseline/components/BaselinePageHeader.vue";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import type {Baseline} from "@/baseline/domain/Baseline";
import BaselineLogProcessors from "@/baseline/components/BaselineLogProcessors.vue";
import type {Game} from "@/game/domain/Game";
import BaselineAnalyzers from "@/baseline/components/BaselineAnalyzers.vue";

const baselineStore = useBaselineStore();
const baselineId = useRouter().currentRoute.value.params.id as string;
const baseline = ref<Baseline>();
const artifacts = ref<Map<Game, LogProcessorArtifact[]>>();

onMounted(() => baselineStore.fetchOnceById(baselineId)
    .then(() => baseline.value = baselineStore.findById(baselineId))
    .catch((error) => console.error(error)));
watch(baseline, () =>
    api.orchestrator.processors.getBaselineArtifacts(baselineId)
        .then(a => {
            console.log("load")
            const artifactMap = new Map();
            baseline.value?.games.map(g => artifactMap.set(g.id, a[g.id]))
            artifacts.value = artifactMap
        })
        .catch(e => console.error("unable to load log processor artifacts for game", e))
)
</script>


<template>
    <div v-if="baseline !== undefined && artifacts !== undefined">
        <BaselinePageHeader :baseline="baseline" />
        <div class="max-w-screen-md mx-auto pb-20">
            <BaselineLogProcessors :baseline="baseline" :artifacts="artifacts" />
            <BaselineAnalyzers :baseline="baseline" :artifacts="artifacts" />
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>