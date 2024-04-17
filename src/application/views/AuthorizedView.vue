<script setup lang="ts">
import {LoadingState} from "@/util/LoadingState";
import ApplicationLoader from "@/application/components/ApplicationLoader.vue";
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {RouterView} from "vue-router";
import {ref} from "vue";

const loading = ref(true);
</script>

<template>
    <div class="h-full flex flex-col">
        <ApplicationLoader class="absolute top-0 left-0 z-50"
                           v-if="loading"
                           @updated="(state) => loading = state !== LoadingState.Successful" />
        <div v-else-if="!loading">
            <ApplicationNavigation />
            <RouterView />
        </div>
    </div>
</template>