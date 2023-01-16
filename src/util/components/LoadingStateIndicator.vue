<script lang="ts" setup>
import {ref, watch} from "vue";
import {LoadingState} from "@/util/LoadingState";

const props = defineProps<{
    label: string,
    loader: () => Promise<any>
}>();
const emit = defineEmits<{
    (e: 'updated', parameter: LoadingState): void
}>();

const state = ref<LoadingState>(LoadingState.Pending);
props.loader()
    .then(() => state.value = LoadingState.Successful)
    .catch((error) => {
        console.error(`loader '${props.label}' failed`, error);
        state.value = LoadingState.Failed;
    });
watch(state, () => emit("updated", state.value));
</script>

<template>
    <div>
        <div class="loading-state-label">{{props.label}}</div>
        <div class="loading-state-spacer"></div>
        <div class="loading-state-status successful" v-if="state === LoadingState.Successful">Loaded</div>
        <div class="loading-state-status failed" v-else-if="state === LoadingState.Failed">Failed</div>
        <div class="loading-state-status pending" v-else>Loading</div>

    </div>
</template>
