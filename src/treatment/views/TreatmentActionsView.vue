<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import TreatmentPageHeader from "@/treatment/components/TreatmentPageHeader.vue";
import type {Treatment} from "@/treatment/domain/Treatment";
import TreatmentGamesExport from "@/treatment/components/TreatmentGamesExport.vue";

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
        <div class="max-w-screen-md mx-auto mb-20">
            <div class="mt-10 text-slate-700">
                <h2 class="text-2xl w-full mb-4 pb-3 border-b border-slate-200 text-slate-700">Export game files</h2>
                <p class="my-4 leading-relaxed">
                    Exports game archives (as *.tar.gz) and a manifest (*.games.csv) to the specified target directory.
                </p>
                <TreatmentGamesExport :treatment-id="treatmentId" />
            </div>
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>
