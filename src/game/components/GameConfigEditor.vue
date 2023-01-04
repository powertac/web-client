<script setup lang="ts">
import BrokerSelector from "@/broker/components/BrokerSelector.vue";
import WeatherSelector from "@/weather/components/WeatherSelector.vue";
import ParameterEditor from "@/simulation/components/ParameterEditor.vue";
</script>

<template>
    <div class="form-group">
        <h2 class="form-group-title">Brokers</h2>
        <BrokerSelector class="form-group-content" />
    </div>
    <div class="form-group">
        <h2 class="form-group-title">Weather</h2>
        <WeatherSelector class="form-group-content" />
    </div>
    <div class="form-group">
        <h2 class="form-group-title">Parameters</h2>
        <ParameterEditor class="form-group-content" />
    </div>
</template>
