<script lang="ts" setup>
import {date, datetime} from "@/util/DateTimeFormat";
import {capitalize} from "@/util/String";
import GameStatusBadge from "@/game/components/GameStatusBadge.vue";
import {computed} from "vue";
import {Game} from "@/game/domain/Game";
import {Treatment} from "@/treatment/domain/Treatment";
import {ModifierType} from "@/treatment/domain/Modifier";
import {useBrokerStore} from "@/broker/domain/BrokerStore";

const props = defineProps<{
    treatment: Treatment
}>();
const emit = defineEmits<{
    (e: 'close-self', parameter: void): void
}>();

const brokerStore = useBrokerStore();

const gamePartitions = computed(() => {
    const buckets: Game[][] = [];
    let bucketIndex = -1;
    for (let i=0; i < props.treatment.games.length; i++) {
        if (i % 4 === 0) buckets[++bucketIndex] = [];
        buckets[bucketIndex].push(props.treatment.games[i]);
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
            <h1 class="text-lg font-semibold text-slate-800 pt-3 pb-2 pl-6">{{props.treatment.name}}</h1>
        </div>
        <div class="flex gap-5 mt-5 mx-7 mb-16 flex-wrap">
            <div class="tuple-group">
                <div class="tuple-header">Metadata</div>
                <div class="tuple">
                    <div class="header mr-16">Status</div>
                    <div class="uppercase text-xs !py-3">{{props.treatment.status}}</div>
                </div>
                <div class="tuple">
                    <div class="header mr-8">ID</div>
                    <div class="font-mono">{{props.treatment.id}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Created at</div>
                    <div class="font-mono">{{datetime(props.treatment.createdAt)}}</div>
                </div>
                <div class="tuple">
                    <div class="header">
                        Baseline
                    </div>
                    <div>
                        <router-link :to="'/baselines/' + props.treatment.baseline.id">
                            {{props.treatment.baseline.name}}
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="tuple-group">
                <div class="tuple-header">Games ({{props.treatment.games.length}})</div>
                <div class="grid gap-1 p-1.5 grid-flow-col" :class="['grid-cols-' + gamePartitions.length]">
                    <div class="grid grid-cols-1 gap-1 place-content-start" v-for="partition in gamePartitions">
                        <GameStatusBadge :index="props.treatment.games.indexOf(game)" :status="game.status" v-for="game in partition" :key="game.id" />
                    </div>
                </div>
            </div>
            <div class="tuple-group" v-if="props.treatment.modifier.type === ModifierType.ParameterSet">
                <div class="tuple-header">Parameter Set Modifier</div>
                <div class="tuple" v-for="parameter in Object.keys(props.treatment.modifier.config.parameters)" :key="parameter">
                    <div class="grow font-mono">{{parameter}}</div>
                    <div>=</div>
                    <div class="font-mono">{{props.treatment.modifier.config.parameters[parameter]}}</div>
                </div>
            </div>
            <div class="tuple-group" v-else-if="props.treatment.modifier.type === ModifierType.ReplaceBroker">
                <div class="tuple-header">Broker Replacement Modifier</div>
                <div class="tuple" v-for="originalId in Object.keys(props.treatment.modifier.config.brokerMapping)" :key="originalId">
                    <div class="grow font-mono">{{brokerStore.findById(originalId).name}}</div>
                    <div><icon icon="arrow-right" /></div>
                    <div class="font-mono">{{brokerStore.findById(props.treatment.modifier.config.brokerMapping[originalId]).name}}</div>
                </div>
            </div>
            <div class="tuple-group">
                <div class="tuple-header">Brokers</div>
                <div class="tuple" v-for="broker in props.treatment.config.brokers">
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
                    <div>{{capitalize(props.treatment.config.weather.location.name)}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Start Date</div>
                    <div class="font-mono text-lg">{{date(props.treatment.config.weather.startDate)}}</div>
                </div>
            </div>
            <div class="tuple-group" v-if="Object.keys(props.treatment.config.parameters).length > 0">
                <div class="tuple-header">Parameters</div>
                <div class="tuple" v-for="parameter in Object.keys(props.treatment.config.parameters)" :key="parameter">
                    <div class="grow font-mono">{{parameter}}</div>
                    <div>=</div>
                    <div class="font-mono">{{props.treatment.config.parameters[parameter]}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

