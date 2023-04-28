<script setup lang="ts">
import {computed, ref} from "vue";
import BrokerSelector from "@/broker/components/BrokerSelector.vue";
import WeatherSelector from "@/weather/components/WeatherSelector.vue";
import ParameterEditor from "@/simulation/components/ParameterEditor.vue";
import {GameValidator} from "@/game/domain/GameValidator";
import {Broker} from "@/broker/domain/Broker";
import {WeatherConfig} from "@/weather/domain/WeatherConfig";
import {api} from "@/api";
import type {NewBaselineData} from "@/baseline/domain/Baseline";
import ValidationBadge from "@/form/ValidationBadge.vue";
import BaselinesHeader from "@/baseline/components/BaselinesHeader.vue";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useRouter} from "vue-router";

const name = ref("" as string);
const size = ref(0);
const brokers = ref([] as Broker[]);
const weatherConfig = ref({} as Partial<WeatherConfig>);
const parameters = ref({} as {[key: string]: string});
const nameElement = ref<HTMLElement>();
const sizeElement = ref<HTMLElement>();
const brokersElement = ref<HTMLElement>();
const weatherElement = ref<HTMLElement>();
const parametersElement = ref<HTMLElement>();

const config = computed((): Partial<NewBaselineData> => ({
    name: name.value,
    size: size.value,
    brokerIds: brokers.value.map(b => b.id),
    parameters: parameters.value,
    weather: weatherConfig.value.data
}));

function createBaseline(): void {
    if (isValid()) {
        const baselineStore = useBaselineStore();
        const router = useRouter();
        api.orchestrator.baselines.create(config.value as NewBaselineData)
            .then(baseline => baselineStore.fetchOnceById(baseline.id)
                .then(() => router.push("/baselines/table"))
                .catch(error => console.error("unable to load newly created baseline", baseline, error)))
            .catch(error => console.error("unable to create baseline", error));
    } else {
        console.error("game data not valid");
    }
}

function isValid(): boolean {
    // TODO : validate parameters
    return config.value.name !== undefined && GameValidator.gameName(config.value.name)
        && config.value.size !== undefined && config.value.size >= 2
        && config.value.weather !== undefined && GameValidator.weather(config.value.weather)
        && config.value.brokerIds !== undefined && GameValidator.brokers(brokers.value);
}
</script>

<template>
    <div class="form" @keyup.ctrl.enter="createBaseline">
        <BaselinesHeader />
        <div class="form-content">
            <div class="form-group mt-3" ref="nameElement">
                <h2 class="form-group-title">Name</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" :class="{'valid': name !== null && GameValidator.gameName(name)}" v-model="name" />
                    <p class="mt-5 text-slate-500">A baseline's name must consist of at least 5 characters.</p>
                </div>
            </div>
            <div class="form-group" ref="sizeElement">
                <h2 class="form-group-title">Baseline Size</h2>
                <div class="form-group-content">
                    <input type="number" class="default w-[32rem] text-center" :class="{'valid': size >= 2}" v-model="size" />
                    <p class="mt-5 text-slate-500">The baseline size refers to the number of games that make up the baseline.</p>
                </div>
            </div>
            <div class="form-group" ref="brokersElement">
                <h2 class="form-group-title">Brokers</h2>
                <div class="form-group-content">
                    <BrokerSelector @selected="(newBrokers) => brokers = newBrokers" />
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
        <div class="form-footer">
            <div class="form-group !pt-7 !pb-10">
                <h2 class="form-group-title"></h2>
                <div class="form-group-content">
                    <div class="flex gap-1.5 w-full mb-3">
                        <ValidationBadge :valid="GameValidator.gameName(name)" label="Name" @click="nameElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="size >= 2" label="Baseline Size" @click="sizeElement?.scrollIntoView()" class="cursor-pointer"  />
                        <ValidationBadge :valid="GameValidator.brokers(brokers)" label="Brokers" @click="brokersElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="config.weather !== undefined && GameValidator.weather(config.weather)" label="Weather" @click="weatherElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="true" label="Parameters" @click="parametersElement?.scrollIntoView()" class="cursor-pointer" />
                    </div>
                    <button type="submit" class="button form-submit button-lg self-start" :disabled="!isValid()" @click="createBaseline">Create Baseline</button>
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
