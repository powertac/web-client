<script setup lang="ts">
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {onMounted, ref} from "vue";
import {SyncGroup} from "@/concurrency/SyncGroup";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import BrokerSelector from "@/broker/components/BrokerSelector.vue";

const brokerStore = useBrokerStore();
const weatherStore = useWeatherStore();
const loading = ref(true);

onMounted(() => {
    const sync = new SyncGroup();
    sync.add(weatherStore.fetchAllLocations());
    sync.wait().then(() => loading.value = false);
});
</script>

<template>
    <h1>Game Config</h1>
    <BrokerSelector />
</template>
