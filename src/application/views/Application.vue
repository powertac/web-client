<script setup lang="ts">
import {RouterView} from 'vue-router'
import ApplicationNavigation from "@/application/components/ApplicationNavigation.vue";
import {api} from "@/api/api";
import {computed, ref} from "vue";

// FIXME : when implementing real
api.orchestrator.auth
    .login({username: "admin", password: "supersecure"})
    .then(() => console.log("logged in"))
    .catch((error) => console.error(error))

// FIXME : move to store
const size = ref(10);
const increaseDefaultFontSize = () => size.value = size.value + 1;
const defaultStyle = computed(() => ({ fontSize: size.value + "px" }));
</script>

<template>
    <div class="flex flex-auto flex-row h-full">
        <ApplicationNavigation/>
        <div class="flex-grow">
            <RouterView/>
        </div>
    </div>
</template>
