<script setup lang="ts">
import {useApplicationStore} from "@/application/ApplicationStore";
const app = useApplicationStore();
</script>

<template>
  <h1 v-if="app.authenticated">AUTHENTICATED :D</h1>
  <h1 v-else>Not authenticated :(</h1>
</template>
