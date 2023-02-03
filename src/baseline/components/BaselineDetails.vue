<script lang="ts" setup>
import {date, datetime} from "@/util/DateTimeFormat";
import {Baseline} from "@/baseline/domain/Baseline";
import {capitalize} from "@/util/String";
import GameStatusBadge from "@/game/components/GameStatusBadge.vue";
import {computed} from "vue";
import {Game} from "@/game/domain/Game";

const props = defineProps<{
    baseline: Baseline
}>();
const emit = defineEmits<{
    (e: 'close-self', parameter: void): void
}>();
const gamePartitions = computed(() => {
    const buckets: Game[][] = [];
    let bucketIndex = -1;
    for (let i=0; i < props.baseline.games.length; i++) {
        if (i % 4 === 0) buckets[++bucketIndex] = [];
        buckets[bucketIndex].push(props.baseline.games[i]);
    }
    return buckets;
});
</script>

<template>
    <div class="w-full bg-slate-100">
        <div class="flex items-center border-t border-slate-300">
            <button class="block uppercase text-xs px-6 text-slate-700 bg-slate-200 border-slate-300 self-stretch pt-0.5 border -mt-[1px] border-l-0 rounded-br-sm hover:bg-slate-300 hover-text-slate-900"
                    type="button" @click="emit('close-self')">
                <icon class="mr-2" icon="times" />
                Close
            </button>
            <h1 class="text-lg font-semibold text-slate-800 pt-3 pb-2 pl-6">{{props.baseline.name}}</h1>
        </div>
        <div class="flex gap-5 mt-5 mx-7 mb-16">
            <div class="tuple-group">
                <div class="tuple-header">Metadata</div>
                <div class="tuple">
                    <div class="header mr-16">Status</div>
                    <div class="uppercase text-xs !py-3">{{props.baseline.status}}</div>
                </div>
                <div class="tuple">
                    <div class="header mr-8">ID</div>
                    <div class="font-mono">{{props.baseline.id}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Created at</div>
                    <div class="font-mono">{{datetime(props.baseline.createdAt)}}</div>
                </div>
            </div>
            <div class="tuple-group">
                <div class="tuple-header">Games ({{props.baseline.games.length}})</div>
                <div class="grid gap-1 p-1.5 grid-flow-col" :class="['grid-cols-' + gamePartitions.length]">
                    <div class="grid grid-cols-1 gap-1 place-content-start" v-for="partition in gamePartitions">
                        <GameStatusBadge :index="props.baseline.games.indexOf(game)" :status="game.status" v-for="game in partition" :key="game.id" />
                    </div>
                </div>
            </div>
            <div class="tuple-group">
                <div class="tuple-header">Brokers</div>
                <div class="tuple" v-for="broker in props.baseline.config.brokers">
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
                    <div>{{capitalize(props.baseline.config.weather.location.name)}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Start Date</div>
                    <div class="font-mono text-lg">{{date(props.baseline.config.weather.startDate)}}</div>
                </div>
            </div>
            <div class="tuple-group" v-if="Object.keys(props.baseline.config.parameters).length > 0">
                <div class="tuple-header">Parameters</div>
                <div class="tuple" v-for="parameter in Object.keys(props.baseline.config.parameters)" :key="parameter">
                    <div class="grow font-mono">{{parameter}}</div>
                    <div>=</div>
                    <div class="font-mono">{{props.baseline.config.parameters[parameter]}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

