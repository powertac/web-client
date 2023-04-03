<script lang="ts" setup>
import {WeatherConfig} from "@/weather/domain/WeatherConfig";
import {capitalize} from "@/util/String";
import {date} from "@/util/DateTimeFormat";

const props = defineProps<{
    weather: WeatherConfig
}>();
</script>


<template>
    <div class="tuple-group">
        <div class="tuple-header">Weather</div>
        <div class="tuple">
            <div class="header mr-16">Location</div>
            <div>{{capitalize(props.weather.location.name)}}</div>
        </div>
        <div class="tuple">
            <div class="header">Start Date</div>
            <div class="font-mono text-lg">{{date(props.weather.startDate)}}</div>
        </div>
    </div>
</template>
