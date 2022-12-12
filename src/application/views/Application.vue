<script setup lang="ts">
import {RouterView} from 'vue-router'
import MainNavigation from "@/application/components/MainNavigation.vue";
import {api} from "@/api/api";

// FIXME : when implementing real
api.orchestrator.auth
    .login({username: "admin", password: "supersecure"})
    .then(() => console.log("logged in"))
    .catch((error) => console.error(error))

</script>

<template>
  <MainNavigation/>
  <RouterView/>
</template>
