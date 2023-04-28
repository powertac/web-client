<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import GameTable from "@/game/components/GameTable.vue";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {Treatment} from "@/treatment/domain/Treatment";
import TreatmentPageHeader from "@/treatment/components/TreatmentPageHeader.vue";

const treatmentStore = useTreatmentStore();
const treatmentId = useRouter().currentRoute.value.params.id as string;
const treatment = ref<Treatment>();

onMounted(() => treatmentStore.fetchOnceById(treatmentId)
    .then(() => treatment.value = treatmentStore.findById(treatmentId))
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex grow flex-col" v-if="treatment !== undefined">
        <TreatmentPageHeader :treatment="treatment" />
        <GameTable :games="treatment.games" :exclude-columns="['Baseline / Treatment']" />
    </div>
    <div v-else>
        <!-- TODO : add loader -->
        LOADING...
    </div>
</template>
