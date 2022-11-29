<script setup lang="ts">
import {useAuthStore} from "@/security/domain/AuthStore";
import {onMounted} from "vue";
import {api} from "@/api/api";

const authStore = useAuthStore();

onMounted(() => api.orchestrator.auth
    .login({username: "admin", password: "supersecure"})
    .then(() => console.log("logged in"))
    .catch((error) => console.error(error)));
</script>

<template>
  <h1 v-if="authStore.isAuthenticated">AUTHENTICATED :D</h1>
  <h1 v-else>Not authenticated :(</h1>
</template>
