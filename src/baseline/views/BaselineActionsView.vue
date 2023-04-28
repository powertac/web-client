<script lang="ts" setup>
import BaselinePageHeader from "@/baseline/components/BaselinePageHeader.vue";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {Baseline} from "@/baseline/domain/Baseline";
import GenerateBaselineManifestAction from "@/baseline/components/GenerateBaselineManifestAction.vue";

const baselineStore = useBaselineStore();
const baselineId = useRouter().currentRoute.value.params.id as string;
const baseline = ref<Baseline>();

const manifestHeader = computed(() =>
    "gameId,gameName,status,gameSize,gameLength,lastTick,weatherLocation,weatherDate,DOI,logUrl,"
    + baseline.value?.config.brokers.map(b => b.name).join(','));

onMounted(() => baselineStore.fetchOnceById(baselineId)
    .then(() => baseline.value = baselineStore.findById(baselineId))
    .catch((error) => console.error(error)));
</script>

<template>
    <div v-if="baseline !== undefined">
        <BaselinePageHeader :baseline="baseline" />
        <div class="max-w-screen-md mx-auto">
            <div class="mt-10 text-slate-700">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Generate manifest</h2>
                <p class="my-4 leading-relaxed">
                    Generates a CSV file containing metadata for all games included in this baseline.
                    The manifest can only be generated once all baseline games have completed successfully.
                </p>
                <p class="my-4 leading-relaxed">
                    The file is formatted with the following CSV header:
                </p>
                <pre class="bg-slate-100 border border-slate-300 rounded px-5 py-3">{{manifestHeader}}</pre>
                <GenerateBaselineManifestAction :baseline-id="baselineId" />
            </div>
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>
