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
import ValidationBadge from "@/form/ValidationBadge.vue";
import GamesHeader from "@/file/components/GamesHeader.vue";

const name = ref("" as string);
const brokers = ref([] as Broker[]);
const weatherConfig = ref({} as Partial<WeatherConfig>);
const parameters = ref({} as {[key: string]: string});
const nameElement = ref<HTMLElement>();
const brokersElement = ref<HTMLElement>();
const weatherElement = ref<HTMLElement>();
const parametersElement = ref<HTMLElement>();

const game = computed((): Partial<NewGameData> => ({
    name: name.value,
    brokerIds: brokers.value.map(b => b.id),
    parameters: parameters.value,
    weather: weatherConfig.value.data
}));

function createGame(): void {
    if (isValid()) {
        api.orchestrator.games.create(game.value as NewGameData)
            .then(() => router.push("/")) // TODO : add real route (deactivate to allow HMR)
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
        <GamesHeader />
        <div class="form-content">
            <div class="form-group mt-3" ref="nameElement">
                <h2 class="form-group-title">Name</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" :class="{'valid': name !== null && GameValidator.gameName(name)}" v-model="name" />
                    <p class="mt-5 text-slate-500">A game's name must consist of at least 5 characters.</p>
                </div>
            </div>
            <div class="form-group" ref="brokersElement">
                <h2 class="form-group-title">Brokers</h2>
                <div class="form-group-content">
                    <BrokerSelector @updated="(newBrokers) => brokers = newBrokers" />
                    <p class="mt-5 text-slate-500">Please choose at least one broker.</p>
                </div>
            </div>
            <div class="form-group" ref="weatherElement">
                <h2 class="form-group-title">Weather</h2>
                <div  class="form-group-content">
                    <WeatherSelector @selected="(newConfig) => weatherConfig = newConfig" />
                    <p class="mt-5 text-slate-500">Please choose a location and a start date to specify weather conditions. Please make sure the start date corresponds with your selected game length (default: two weeks).</p>
                </div>
            </div>
            <div class="form-group" ref="parametersElement">
                <h2 class="form-group-title">Parameters</h2>
                <div class="form-group-content">
                    <ParameterEditor @updated="(newParameters) => parameters = newParameters" class="max-w-7xl" />
                    <p class="mt-5 text-slate-500"></p>
                </div>
            </div>
        </div>
        <!-- TODO : move to sidebar (on high res) -->
        <div class="form-footer">
            <div class="form-group !pt-7 !pb-10">
                <h2 class="form-group-title"></h2>
                <div class="form-group-content">
                    <div class="flex gap-1.5 w-full mb-3">
                        <ValidationBadge :valid="GameValidator.gameName(name)" label="Name" @click="nameElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="GameValidator.brokers(brokers)" label="Brokers" @click="brokersElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="game.weather !== undefined && GameValidator.weather(game.weather)" label="Weather" @click="weatherElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="true" label="Parameters" @click="parametersElement?.scrollIntoView()" class="cursor-pointer" />
                    </div>
                    <button type="submit" class="button form-submit button-lg self-start" :disabled="!isValid()" @click="createGame">Create Game</button>
                </div>
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
