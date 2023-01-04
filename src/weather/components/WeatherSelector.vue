<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import {capitalize} from "@/util/String";
import {WeatherLocation} from "@/weather/domain/WeatherLocation";
import {WeatherConfig} from "@/weather/domain/WeatherConfig";
import {DateTime} from "luxon";

const emit = defineEmits<{
    (e: 'selected', parameter: WeatherConfig): void
}>();

const weatherStore = useWeatherStore();
const loading = ref(true);
const locations = computed(() => weatherStore.findAllLocations().slice().sort((a, b) => a.name.localeCompare(b.name)));
const selectedLocation = ref<WeatherLocation>();
const selectedDate = ref<string>();
const weatherConfig = computed(() => ({
    location: selectedLocation.value,
    startDate: selectedDate.value !== undefined ? DateTime.fromISO(selectedDate.value) : undefined
} as Partial<WeatherConfig>));

function isValid(): boolean {
    return weatherConfig.value.location instanceof WeatherLocation
        && weatherConfig.value.startDate instanceof DateTime;
}

function emitIfValid(): void {
    if (isValid())
        emit("selected", new WeatherConfig(
            selectedLocation.value as WeatherLocation,
            DateTime.fromISO(selectedDate.value as string)));
}

onMounted(() => {
    weatherStore.fetchAllLocations()
        .then(() => loading.value = false)
        .catch((error) => console.error(error));
});
watch(weatherConfig, emitIfValid);
</script>

<template>
    <div v-if="loading" class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500 animate-pulse">
        Loading...
    </div>
    <div v-else>
        <div class="flex flex-row gap-2">
            <div @click="selectedLocation = location" class="card" :class="{'selected': selectedLocation?.name === location.name}" v-for="location in locations" :key="location.name">
                <h6 class="card-title">{{capitalize(location.name)}}</h6>
                {{location.minTime.toLocaleString()}} - {{location.maxTime.toLocaleString()}}
            </div>
        </div>
        <div>
            <div class="input-group mt-2 flex">
                <label class="attached-label" for="weather-start-date">Start Date</label>
                <input type="date" id="weather-start-date" class="grow default w-52 text-center"
                       v-model="selectedDate"
                       :disabled="!selectedLocation"
                       :min="selectedLocation?.minTime.toISODate()"
                       :max="selectedLocation?.maxTime.toISODate()" />
            </div>
        </div>
    </div>
</template>
