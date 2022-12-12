<script setup lang="ts">
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {onMounted, ref} from "vue";

const brokerStore = useBrokerStore();
const loading = ref(true);

onMounted(() => {
    console.log("fetching brokers")
    brokerStore.fetchAll()
        .then(() => loading.value = false)
        .catch((error) => console.error(error));
});
</script>

<template>
    <div v-if="loading">Loading...</div>
    <div v-else>
        <h1>Brokers</h1>
        <div class="selectable" v-for="broker in brokerStore.findAll()" :key="broker.id">
            {{broker.name}} - {{broker.version}} - {{broker.imageTag}}
        </div>
    </div>
</template>
