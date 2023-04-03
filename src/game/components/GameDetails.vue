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
    <div class="w-full bg-slate-100">
        <div class="flex items-center border-t border-slate-300">
            <button class="block uppercase text-xs px-6 text-slate-700 bg-slate-200 border-slate-300 self-stretch pt-0.5 border -mt-[1px] border-l-0 rounded-br-sm hover:bg-slate-300 hover-text-slate-900"
                    type="button" @click="emit('close-self')">
                <icon class="mr-2" icon="times" />
                Close
            </button>
            <h1 class="text-lg font-semibold text-slate-800 pt-3 pb-2 pl-6">{{props.game.name}}</h1>
        </div>
        <div class="flex gap-5 mt-5 mx-7 mb-16">
            <GameMeta :game="props.game" />
            <GameRunsBlock :runs="props.game.runs" />
            <BrokersBlock :brokers="props.game.config.brokers" />
            <WeatherBlock :weather="props.game.config.weather" />
            <ParametersBlock :parameters="props.game.config.parameters" />
        </div>
    </div>
</template>
