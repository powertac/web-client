<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import GameMeta from "@/game/components/GameMetaBlock.vue";
import GameRunsBlock from "@/game/components/GameRunsBlock.vue";
import WeatherBlock from "@/weather/components/WeatherBlock.vue";
import BrokersBlock from "@/broker/components/BrokersBlock.vue";
import ParametersBlock from "@/simulation/components/ParametersBlock.vue";

const props = defineProps<{
    game: Game
}>();

const emit = defineEmits<{
    (e: 'close-self', parameter: void): void
}>();
</script>

<template>
    <div>
        <div class="flex justify-between bg-slate-200 -mb-[1px]">
            <h1 class="text-lg font-semibold text-slate-700 py-2.5 pl-6">{{props.game.name}}</h1>
            <button class="button self-center mr-1.5"
                    type="button" @click="emit('close-self')">
                <icon icon="times" />
            </button>
        </div>
        <div class="p-3 flex border-t border-slate-300 gap-1">
            <router-link :to="'/games/' + game.id" class="button button-sm block">
                <icon icon="dice-d6" class="mr-1.5" />
                Details
            </router-link>
            <router-link :to="'/games/' + game.id + '/files'" class="button button-sm block">
                <icon :icon="['far', 'file']" class="mr-1.5" />
                Files
            </router-link>
            <router-link :to="'/games/' + game.id + '/actions'" class="button button-sm block">
                <icon icon="gears" class="mr-1.5" />
                Actions
            </router-link>
        </div>
        <div class="flex flex-col">
            <GameMeta :game="props.game" />
            <GameRunsBlock :runs="props.game.runs" />
            <BrokersBlock :brokers="props.game.config.brokers" />
            <WeatherBlock :weather="props.game.config.weather" />
            <ParametersBlock :parameters="props.game.config.parameters" />
        </div>
    </div>
</template>
