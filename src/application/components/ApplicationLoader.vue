<script lang="ts" setup>
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import {api} from "@/api";
import {computed, ref, watch} from "vue";
import {LoadingState} from "@/util/LoadingState";
import LoadingStateIndicator from "@/util/components/LoadingStateIndicator.vue";
import {useParameterStore} from "@/simulation/domain/ParameterStore";

const emit = defineEmits<{
    (e: "updated", parameter: LoadingState): void
}>();

const brokersLoaded = ref<LoadingState>(LoadingState.Pending);
const weatherLocationsLoaded = ref<LoadingState>(LoadingState.Pending);
const parametersLoaded = ref<LoadingState>(LoadingState.Pending);
const login = ref<LoadingState>(LoadingState.Pending);

const state = computed(() => {
   if (brokersLoaded.value === LoadingState.Successful
       && weatherLocationsLoaded.value === LoadingState.Successful
       && parametersLoaded.value === LoadingState.Successful
       && login.value === LoadingState.Successful) {
       return LoadingState.Successful
   } else if (brokersLoaded.value === LoadingState.Failed
       && weatherLocationsLoaded.value === LoadingState.Failed
       && parametersLoaded.value === LoadingState.Failed
       && login.value === LoadingState.Failed) {
       return LoadingState.Failed
   } else {
       return LoadingState.Pending;
   }
});
watch(state, () => emit("updated", state.value))
</script>

<template>
    <div class="flex justify-center items-center flex-col h-full w-full bg-slate-50">
        <div class="w-72 text-center uppercase pb-5 mb-6 border-b border-slate-200 text-slate-400 text-xs">
            Loading resources
        </div>
        <LoadingStateIndicator class="loading-state-indicator"
                               label="Brokers"
                               :loader="() => useBrokerStore().fetchAll()"
                               @updated="(loaded) => brokersLoaded = loaded" />
        <LoadingStateIndicator class="loading-state-indicator"
                               label="Weather Data"
                               :loader="() => useWeatherStore().fetchAllLocations()"
                               @updated="(loaded) => weatherLocationsLoaded = loaded" />
        <LoadingStateIndicator class="loading-state-indicator"
                               label="Parameters"
                               :loader="() => useParameterStore().fetchAllOnce()"
                               @updated="(loaded) => parametersLoaded = loaded" />
        <LoadingStateIndicator class="loading-state-indicator"
                               label="Login"
                               :loader="() => api.orchestrator.auth.login({username: 'admin', password: 'supersecure'})"
                               @updated="(loaded) => login = loaded" />
    </div>
</template>

<style lang="scss">
.loading-state-indicator {
    @apply flex w-72 justify-between my-1 text-slate-500
}
div.loading-state-label {
    @apply font-semibold;
}
div.loading-state-spacer {
    @apply border-b border-slate-200 grow self-center mx-5;
}
div.loading-state-status {
    @apply uppercase text-xs self-center font-semibold;
    &.pending { @apply animate-pulse }

}
</style>
