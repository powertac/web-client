<script lang="ts" setup>
import {date, datetime} from "@/util/DateTimeFormat";
import {Baseline} from "@/baseline/domain/Baseline";
import {capitalize} from "@/util/String";
import GameStatusBadge from "@/game/components/GameStatusBadge.vue";
import {computed} from "vue";
import {Game} from "@/game/domain/Game";
import {Treatment} from "@/treatment/domain/Treatment";
import ModifierBlock from "@/treatment/components/ModifierBlock.vue";

const props = defineProps<{
    treatment: Treatment
}>();
const emit = defineEmits<{
    (e: 'close-self', parameter: void): void
}>();
const gamePartitions = computed(() => {
    const buckets: Game[][] = [];
    const cutoffset = Math.ceil(props.treatment.games.length / 2);
    buckets[0] = props.treatment.games.slice(0, cutoffset);
    buckets[1] = props.treatment.games.slice(cutoffset);
    return buckets
});
</script>

<template>
    <div>
        <div class="flex justify-between bg-slate-200 -mb-[1px]">
            <h1 class="text-lg font-semibold text-slate-700 py-2.5 pl-6">{{props.treatment.name}}</h1>
            <button class="button self-center mr-1.5"
                    type="button" @click="emit('close-self')">
                <icon icon="times" />
            </button>
        </div>
        <div class="p-3 flex border-t border-slate-300 gap-1">
            <router-link :to="'/treatments/' + props.treatment.id" class="button button-sm block">
                <icon icon="code-branch" class="mr-1.5" />
                Details
            </router-link>
            <router-link :to="'/treatments/' + props.treatment.id + '/games'" class="button button-sm block">
                <icon icon="dice-d6" class="mr-1.5" />
                Games
            </router-link>
            <!--
            <router-link :to="'/treatments/' + props.treatment.id + '/actions'" class="button button-sm block">
                <icon icon="gears" class="mr-1.5" />
                Actions
            </router-link>
            -->
        </div>
        <div class="flex flex-col">
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
                    <div class="header">Baseline</div>
                    <div>
                        <router-link :to="'/baselines/' + props.treatment.baseline.id" class="flex items-center">
                            <icon icon="seedling" class="text-sm mr-2 text-slate-500" />
                            {{props.treatment.baseline.name}}
                        </router-link>
                    </div>
                </div>
            </div>
            <ModifierBlock :modifier="props.treatment.modifier" />
            <div class="tuple-group">
                <div class="tuple-header">Games ({{props.treatment.games.length}})</div>
                <div class="grid gap-1 p-1.5 grid-flow-col max-h-48 overflow-y-auto" :class="['grid-cols-' + gamePartitions.length]">
                    <div class="grid grid-cols-1 gap-1 place-content-start" v-for="partition in gamePartitions">
                        <GameStatusBadge :index="props.treatment.games.indexOf(game)" :status="game.status" v-for="game in partition" :key="game.id" />
                    </div>
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

