<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {api} from "@/api";

const props = defineProps<{
    baselineId: string
}>();

const manifestExists = ref(false);
const generatingManifest = ref(false);
const manifestPath = ref(undefined as string|undefined);

function generateManifest(): void {
    generatingManifest.value = true;
    api.orchestrator.baselines.createManifest(props.baselineId)
        .then(() => manifestExists.value = true)
        .catch(error => console.error("unable to generate manifest", error));
}

onMounted(() => api.orchestrator.baselines.getManifest(props.baselineId)
    .then(() => manifestExists.value = true));
onMounted(() => api.orchestrator.paths.baselineManifest(props.baselineId)
    .then((path) => manifestPath.value = path)
    .catch(error => console.error("unable to load manifest path", error)));
</script>

<template>
    <div class="rounded border border-slate-300 px-6 py-3 flex justify-between items-center my-4">
        <div>
            <span class="font-semibold">Baseline manifest</span><br>
            <span class="text-slate-600" v-if="manifestExists">{{ baselineId }}.games.csv</span>
            <span class="text-slate-500 italic" v-else>Not yet generated</span>
        </div>
        <div class="flex items-center" v-if="manifestExists">
            <button type="button" class="button">
                <icon icon="download" class="mr-2" />
                Download manifest
            </button>
        </div>
        <div class="flex items-center" v-else>
            <button type="button" class="button" v-if="!generatingManifest" @click="generateManifest">
                <icon icon="rotate" class="mr-2" />
                Generate manifest
            </button>
            <div v-else>
                <icon class="text-2xl text-blue-600" icon="circle-notch" :spin="true" />
            </div>
        </div>
    </div>
</template>
