<script setup lang="ts">
import {computed, ref} from "vue";
import BrokerSelector from "@/broker/components/BrokerSelector.vue";
import WeatherSelector from "@/weather/components/WeatherSelector.vue";
import ParameterEditor from "@/simulation/components/ParameterEditor.vue";
import {GameValidator} from "@/game/domain/GameValidator";
import type {NewGameData} from "@/game/domain/Game";
import {Broker} from "@/broker/domain/Broker";
import {WeatherConfig} from "@/weather/domain/WeatherConfig";
import {api} from "@/api";
import router from "@/router";

const name = ref("" as string);
const brokers = ref([] as Broker[]);
const weatherConfig = ref({} as Partial<WeatherConfig>);
const parameters = ref({} as {[key: string]: string});

const game = computed((): Partial<NewGameData> => ({
    name: name.value,
    brokerIds: brokers.value.map(b => b.id),
    parameters: parameters.value,
    weather: weatherConfig.value.data
}));

function createGame(): void {
    console.log("creating game")
    if (isValid()) {
        api.orchestrator.games.create(game.value as NewGameData)
            .then(() => router.push("/"))
            .catch((error) => console.error(error));
    } else {
        console.error("game data not valid");
    }
}

function isValid(): boolean {
    return game.value.name !== undefined && GameValidator.gameName(game.value.name)
        && game.value.weather !== undefined && GameValidator.weather(game.value.weather)
        && game.value.brokerIds !== undefined && GameValidator.brokers(brokers.value);
}
</script>

<template>
    <div class="form" @submit="createGame" @keyup.ctrl.enter="createGame">
        <h1 class="form-title">New Game</h1>
        <div class="form-group">
            <h2 class="form-group-title">Name</h2>
            <div class="form-group-content">
                <input type="text" class="default w-[32rem]" :class="{'valid': name !== null && GameValidator.gameName(name)}" v-model="name" />
                <p class="mt-3 text-slate-500">A game's name must consist of at least 5 characters.</p>
            </div>
        </div>
        <div class="form-group">
            <h2 class="form-group-title">Brokers</h2>
            <BrokerSelector @selected="(newBrokers) => brokers = newBrokers" class="form-group-content" />
        </div>
        <div class="form-group">
            <h2 class="form-group-title">Weather</h2>
            <WeatherSelector @selected="(newConfig) => weatherConfig = newConfig" class="form-group-content" />
        </div>
        <div class="form-group">
            <h2 class="form-group-title">Parameters</h2>
            <ParameterEditor @selected="(newParameters) => parameters = newParameters" class="form-group-content max-w-7xl" />
        </div>
        <div class="form-group">
            <h2 class="form-group-title"></h2>
            <div class="form-group-content flex">
                <button type="submit" class="button button-lg self-start" :disabled="!isValid()" @click="createGame">Create Game</button>
                <ul class="verification-list list-['-'] px-6 ml-20">
                    <li :class="{'text-emerald-600': GameValidator.gameName(name)}">The game requires a <em>valid name</em>.</li>
                    <li :class="{'text-emerald-600': GameValidator.brokers(brokers)}">The game requires <em>at least one selected broker</em>.</li>
                    <li :class="{'text-emerald-600': game.weather !== undefined && GameValidator.weather(game.weather)}">The game requires a <em>weather location and start date</em>.</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .verification-list li {
        @apply m-2 pl-3;
        em {
            @apply font-semibold;
            font-style: normal;
        }
    }
</style>
