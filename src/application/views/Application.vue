<script setup lang="ts">
import {RouterView} from 'vue-router'
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {api} from "@/api";
import {computed, ref} from "vue";
import {SyncGroup} from "@/util/SyncGroup";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import {LoadingState} from "@/util/LoadingState";

const loading = ref(true);

const sync = new SyncGroup();
sync.add(useBrokerStore().fetchAll());
sync.add(useWeatherStore().fetchAllLocations());
sync.add(api.orchestrator.auth.login({username: "admin", password: "supersecure"}));
sync.wait()
    .then(() => loading.value = false)
    .catch((error) => console.error("unable to load base resources", error));

// FIXME : move to store
const size = ref(10);
const increaseDefaultFontSize = () => size.value = size.value + 1;
const defaultStyle = computed(() => ({ fontSize: size.value + "px" }));
</script>

<template>
    <Transition class="h-full flex flex-col">
        <ApplicationLoader class="absolute top-0 left-0 z-50"
                           @updated="(state) => loading = (state !== LoadingState.Successful)"
                           v-if="loading" />
        <div v-else-if="!loading">
            <ApplicationNavigation />
            <RouterView />
        </div>
    </Transition>
</template>

<style lang="scss">
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.66s ease-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
