<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {api} from "@/api";
import {computed, onMounted, ref} from "vue";
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import {useAuthStore} from "@/security/domain/AuthStore";
import LoginForm from "@/security/components/LoginForm.vue";
import {useApplicationStore} from "@/application/ApplicationStore";
import {LoadingState} from "@/util/LoadingState";

const loading = ref(true);
const authStore = useAuthStore();
const authenticated = computed(() => authStore.isAuthenticated);
const isPublic = computed(() => useRouter().currentRoute.value.meta.public as boolean);

onMounted(() => api.orchestrator.auth.verify().then(() => authStore.setAuthenticated(true)));
onMounted(() => useApplicationStore().startClock());
</script>

<template>
    <div class="h-full flex flex-col" v-if="authenticated && !isPublic">
        <ApplicationLoader class="absolute top-0 left-0 z-50"
                           @updated="(state) => loading = state !== LoadingState.Successful"
                           v-if="loading" />
        <div v-else-if="!loading">
            <ApplicationNavigation />
            <RouterView />
        </div>
    </div>
    <RouterView v-else-if="isPublic" />
    <LoginForm v-else />
</template>

<style lang="scss">
/* for transition */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.66s ease-out;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
