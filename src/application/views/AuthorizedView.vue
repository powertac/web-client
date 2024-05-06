<script setup lang="ts">
import {LoadingState} from "@/util/LoadingState";
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {RouterView} from "vue-router";
import {ref} from "vue";
import StatusBar from "@/application/components/StatusBar.vue";

const loading = ref(true);
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