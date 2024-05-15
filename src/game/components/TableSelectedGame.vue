<script lang="ts" setup>
import type {Game} from "@/game/domain/Game";
import {FontAwesomeIcon as Icon} from "@fortawesome/vue-fontawesome";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";

const props = defineProps<{game: Game}>()
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
                <h2 class="text-xl font-semibold">{{game.name}}</h2>
                <div class="flex items-center gap-1 ml-16">
                    <router-link :to="'/games/' + game.id" class="button button-sm block">
                        <icon icon="dice-d6" class="mr-1.5" />
                        Details
                    </router-link>
                    <router-link :to="'/games/' + game.id + '/files'" class="button button-sm block">
                        <icon :icon="['far', 'file']" class="mr-1.5" />
                        Files
                    </router-link>
                    <router-link :to="'/games/' + game.id + '/analysis'" class="button button-sm block">
                        <icon icon="flask" class="mr-1.5" />
                        Analysis
                    </router-link>
                    <router-link :to="'/games/' + game.id + '/actions'" class="button button-sm block">
                        <icon icon="gears" class="mr-1.5" />
                        Actions
                    </router-link>
                </div>
            </div>
            <div class="flex mt-4 gap-4">
                <BrokersBlock class="compact" :brokers="game.config.brokers" />
                <WeatherBlock class="compact" :weather="game.config.weather" />
                <ParametersBlock class="compact" :parameters="game.config.parameters" />
            </div>
        </div>
    </div>

</template>