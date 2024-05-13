<script setup lang="ts">
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {RouterView} from "vue-router";
import {onMounted, ref} from "vue";
import StatusBar from "@/application/components/StatusBar.vue";
import {updateManager} from "@/util/store/StoreUpdateManager";
import {LoadingState} from "@/util/LoadingState";

const loading = ref(true);

onMounted(() => updateManager.start());
</script>

<template>
    <div class="min-h-full">
        <ApplicationLoader class="absolute top-0 left-0 z-50"
                           v-if="loading"
                           @updated="(state) => loading = state !== LoadingState.Successful" />
        <div class="min-h-full flex flex-col relative mb-12" v-else-if="!loading">
            <ApplicationNavigation />
            <RouterView />
            <StatusBar class="fixed bottom-0" />
        </div>
    </div>
</template>