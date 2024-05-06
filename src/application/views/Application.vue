<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/security/domain/AuthStore";
import {useApplicationStore} from "@/application/domain/ApplicationStore";
import AuthorizedView from "@/application/views/AuthorizedView.vue";
import PublicView from "@/application/views/PublicView.vue";
import {useMessageStore} from "@/application/domain/MessageStore";

const authStore = useAuthStore();
const route = useRoute();
const isPublic = computed(() => route.meta.public != undefined ? route.meta.public : false);

onMounted(() => useApplicationStore().startClock());
</script>

<template>
    <div class="min-h-full flex flex-col">
        <PublicView v-if="isPublic" />
        <div v-else-if="authStore.findAuthState === undefined">Loading auth state</div>
        <AuthorizedView v-else-if="authStore.isAuthenticated" />
        <div v-else>ERROR: unauthorized</div>
    </div>
</template>
