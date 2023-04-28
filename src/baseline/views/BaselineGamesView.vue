<script lang="ts" setup>
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {Baseline} from "@/baseline/domain/Baseline";
import BaselinePageHeader from "@/baseline/components/BaselinePageHeader.vue";
import GameTable from "@/game/components/GameTable.vue";

const baselineStore = useBaselineStore();
const baselineId = useRouter().currentRoute.value.params.id as string;
const baseline = ref<Baseline>();

onMounted(() => baselineStore.fetchOnceById(baselineId)
    .then(() => baseline.value = baselineStore.findById(baselineId))
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex grow flex-col" v-if="baseline !== undefined">
        <BaselinePageHeader :baseline="baseline" />
        <GameTable :games="baseline.games" :exclude-columns="['Baseline / Treatment']" />
    </div>
    <div v-else>
        <!-- TODO : add loader -->
        LOADING...
    </div>
</template>
