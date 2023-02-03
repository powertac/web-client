<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {GameValidator} from "@/game/domain/GameValidator";
import {api} from "@/api";
import ValidationBadge from "@/form/ValidationBadge.vue";
import {Baseline} from "@/baseline/domain/Baseline";
import type {NewTreatmentData} from "@/treatment/domain/Treatment";
import type {NewModifierData} from "@/treatment/domain/Modifier";
import Autocomplete from "@/util/components/Autocomplete.vue";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {capitalize} from "@/util/String";
import {date, datetime} from "@/util/DateTimeFormat";
import {Game} from "@/game/domain/Game";
import ModifierForm from "@/treatment/components/ModifierForm.vue";

const baselineStore = useBaselineStore();
const loading = ref(true);

const name = ref("" as string);
const baseline = ref<Baseline>();
const modifier = ref<NewModifierData>();
const nameElement = ref<HTMLElement>();
const baselineElement = ref<HTMLElement>();
const modifierElement = ref<HTMLElement>();

const baselineSearch = ref("");

const treatment = computed((): Partial<NewTreatmentData> => ({
    name: name.value,
    baselineId: baseline.value?.id,
    modifier: modifier.value !== undefined ? modifier.value : undefined,
}));

function createTreatment(): void {
    if (isValid()) {
        api.orchestrator.treatments.create(treatment.value as NewTreatmentData)
            .then(() => console.log("ROUTER PUSH ")) // FIXME : add routing (disabled for HMR)
            .catch((error) => console.error(error));
    } else {
        console.error("treatment data not valid");
    }
}

function isValid(): boolean {
    return false;
}

function selectBaseline(baselineName: string): void {
    baseline.value = baselineStore.findAll()
        .filter(b => b.name === baselineName)
        .shift();
}

const gamePartitions = computed(() => {
    if (baseline.value !== undefined) {
        const buckets: Game[][] = [];
        let bucketIndex = -1;
        for (let i=0; i < baseline.value.games.length; i++) {
            if (i % 4 === 0) buckets[++bucketIndex] = [];
            buckets[bucketIndex].push(baseline.value.games[i]);
        }
        return buckets;
    }
    return [];
});

onMounted(() => baselineStore.fetchAllOnce()
    .then(() => loading.value = false)
    .catch(error => console.error(error)));
</script>

<template>
    <div class="form" @submit="createTreatment" @keyup.ctrl.enter="createTreatment">
        <div class="form-header">
            <h1 class="mx-auto max-w-7xl form-title pl-44">New Treatment</h1>
        </div>
        <div class="form-content" v-if="!loading">
            <div class="form-group mt-3" ref="nameElement">
                <h2 class="form-group-title">Name</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" :class="{'valid': name !== null && GameValidator.gameName(name)}" v-model="name" />
                    <p class="mt-5 text-slate-500">A treatment's name must consist of at least 5 characters.</p>
                </div>
            </div>
            <div class="form-group mt-3" ref="baselineElement">
                <h2 class="form-group-title">Baseline</h2>
                <div class="form-group-content">
                    <div v-if="baseline !== undefined" class="card !p-0.5">
                        <h2 class="card-title p-1.5 pb-0.5 pl-4 text-lg flex justify-between items-center">
                            {{baseline.name}}
                            <button class="button" type="button" @click="baseline = undefined">
                                <icon icon="times" />
                            </button>
                        </h2>
                        <div class="grid grid-cols-2 gap-1.5 p-1.5">
                            <div class="tuple-group">
                                <div class="tuple-header">Metadata</div>
                                <div class="tuple">
                                    <div class="header mr-16">Status</div>
                                    <div class="uppercase text-xs !py-3">{{baseline.status}}</div>
                                </div>
                                <div class="tuple">
                                    <div class="header mr-8">ID</div>
                                    <div class="font-mono">{{baseline.id}}</div>
                                </div>
                                <div class="tuple">
                                    <div class="header">Created at</div>
                                    <div class="font-mono">{{datetime(baseline.createdAt)}}</div>
                                </div>
                            </div>
                            <div class="tuple-group">
                                <div class="tuple-header">Brokers</div>
                                <div class="tuple" v-for="broker in baseline.config.brokers">
                                    <div class="grow mr-16">
                                        {{broker.name}}
                                    </div>
                                    <div class="uppercase text-xs !text-slate-700">
                                        {{broker.version}}
                                    </div>
                                </div>
                            </div>
                            <div class="tuple-group">
                                <div class="tuple-header">Weather</div>
                                <div class="tuple">
                                    <div class="header mr-16">Location</div>
                                    <div>{{capitalize(baseline.config.weather.location.name)}}</div>
                                </div>
                                <div class="tuple">
                                    <div class="header">Start Date</div>
                                    <div class="font-mono text-lg">{{date(baseline.config.weather.startDate)}}</div>
                                </div>
                            </div>
                            <div class="tuple-group" v-if="Object.keys(baseline.config.parameters).length > 0">
                                <div class="tuple-header">Parameters</div>
                                <div class="tuple" v-for="parameter in Object.keys(baseline.config.parameters)" :key="parameter">
                                    <div class="grow font-mono">{{parameter}}</div>
                                    <div>=</div>
                                    <div class="font-mono">{{baseline.config.parameters[parameter]}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Autocomplete  :value="baseline !== undefined ? baseline.name : ''"
                                   :items="baselineStore.findAll().map(b => b.name).sort((a, b) => a.localeCompare(b))"
                                   :valid="baseline !== undefined"
                                   @selected="(baselineName) => selectBaseline(baselineName)" v-else />
                    <p class="mt-5 text-slate-500">Select a baseline to continue.</p>
                </div>
            </div>
            <div class="form-group mt-3" ref="modifierElement">
                <h2 class="form-group-title" :class="{'!text-slate-400': baseline === undefined}">Modifier</h2>
                <div class="form-group-content">
                    <ModifierForm :baseline="baseline" v-if="baseline !== undefined" />
                    <div class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500" v-else>
                        A baseline must first be selected to define the modifier function.
                    </div>
                </div>
            </div>
        </div>
        <div class="form-footer">
            <div class="form-group !pt-7 !pb-10">
                <h2 class="form-group-title"></h2>
                <div class="form-group-content">
                    <div class="flex gap-1.5 w-full mb-3">
                        <ValidationBadge :valid="GameValidator.gameName(name)" label="Name" @click="nameElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="baseline !== undefined" label="Baseline" @click="baselineElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="modifier !== undefined" label="Modifier" @click="modifierElement?.scrollIntoView()" class="cursor-pointer" />
                    </div>
                    <button type="submit" class="button form-submit button-lg self-start" :disabled="!isValid()" @click="createTreatment">Create Game</button>
                </div>
            </div>
        </div>
    </div>
</template>
