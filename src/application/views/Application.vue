<script setup lang="ts">
import {RouterView} from 'vue-router'
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {api} from "@/api";
import {computed, onMounted, ref, watch} from "vue";
import {SyncGroup} from "@/util/SyncGroup";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import {LoadingState} from "@/util/LoadingState";
import {useAuthStore} from "@/security/domain/AuthStore";
import LoginForm from "@/security/components/LoginForm.vue";

const loading = ref(true);
const authStore = useAuthStore();
const authenticated = computed(() => authStore.isAuthenticated)

// FIXME : move to store
const size = ref(10);
const increaseDefaultFontSize = () => size.value = size.value + 1;
const defaultStyle = computed(() => ({ fontSize: size.value + "px" }));

onMounted(() => {
    api.orchestrator.auth.verify().then(() => authStore.setAuthenticated(true));
})
</script>

<template>
    <Transition class="h-full flex flex-col" v-if="authenticated">
        <ApplicationLoader class="absolute top-0 left-0 z-50"
                           @updated="(state) => loading = (state !== LoadingState.Successful)"
                           v-if="loading" />
        <div v-else-if="!loading">
            <ApplicationNavigation />
            <RouterView />
        </div>
    </Transition>
    <LoginForm v-else />
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
