<script lang="ts" setup>
import Autocomplete from "@/util/components/Autocomplete.vue";
import {Baseline} from "@/baseline/domain/Baseline";
import {ref, watch} from "vue";
import {datetime, date} from "@/util/DateTimeFormat";
import {capitalize} from "@/util/String";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";

const emit = defineEmits<{
    (e: 'selected', baseline: Baseline|undefined): void
}>();

const baselineStore = useBaselineStore();
const baseline = ref<Baseline>();

function selectBaseline(baselineName: string): void {
    baseline.value = baselineStore.findAll()
        .filter(b => b.name === baselineName)
        .shift();
}

watch(baseline, (b) => emit("selected", b));
</script>

<template>
    <div>
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
</template>
