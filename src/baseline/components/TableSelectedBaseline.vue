<script lang="ts" setup>
import {FontAwesomeIcon as Icon} from "@fortawesome/vue-fontawesome";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";
import type {Baseline} from "@/baseline/domain/Baseline";
import GameGroupStatusBlock from "@/game/components/GameGroupStatusBlock.vue";

const props = defineProps<{baseline: Baseline}>()
const emit = defineEmits<{
    (e: 'close-self'): void
}>();
</script>

<template>
    <div class="p-5 pb-8  flex">
        <div class="mr-16 mt-1.5">
            <button class="button button-sm" type="button" @click="emit('close-self')">
                <icon icon="angle-up" class="mr-1" />
                close
            </button>
        </div>
        <div>
            <div class="flex py-1.5 px-2 border border-slate-300 bg-slate-50 rounded-sm items-center w-fit">
                <icon icon="dice-d6" class="ml-2 mr-4 text-blue-700" />
                <h2 class="text-xl font-semibold">{{baseline.name}}</h2>
                <div class="flex items-center gap-1 ml-16">
                    <router-link :to="'/baselines/' + baseline.id" class="button button-sm block">
                        <icon icon="seedling" class="mr-1.5" />
                        Details
                    </router-link>
                    <router-link :to="'/baselines/' + baseline.id + '/games'" class="button button-sm block">
                        <icon icon="dice-d6" class="mr-1.5" />
                        Games
                    </router-link>
                    <router-link :to="'/baselines/' + baseline.id + '/analysis'" class="button button-sm block">
                        <icon icon="flask" class="mr-1.5" />
                        Analysis
                    </router-link>
                    <router-link :to="'/baselines/' + baseline.id + '/actions'" class="button button-sm block">
                        <icon icon="gears" class="mr-1.5" />
                        Actions
                    </router-link>
                </div>
            </div>
            <div class="flex mt-4 gap-4">
                <GameGroupStatusBlock class="compact" :games="baseline.games" />
                <BrokersBlock class="compact" :brokers="baseline.config.brokers" />
                <WeatherBlock class="compact" :weather="baseline.config.weather" />
                <ParametersBlock class="compact" :parameters="baseline.config.parameters" />
            </div>
        </div>
    </div>

</template>