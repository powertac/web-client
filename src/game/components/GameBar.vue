<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import GameStatus from "@/game/components/GameStatus.vue";
import {date, datetime} from "@/util/DateTimeFormat";
import {capitalize} from "@/util/String";

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
            <div class="tuple-group">
                <div class="tuple-header">Metadata</div>
                <div class="tuple">
                    <div class="header mr-16">Status</div>
                    <GameStatus class="!py-3 !pl-6" :status="props.game.status" />
                </div>
                <div class="tuple">
                    <div class="header mr-8">ID</div>
                    <div class="font-mono">{{props.game.id}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Created at</div>
                    <div class="font-mono">{{datetime(props.game.createdAt)}}</div>
                </div>
                <div class="tuple" v-if="props.game.baseline !== null">
                    <div class="header">
                        Baseline
                    </div>
                    <div>
                        <router-link :to="'/baselines/' + props.game.baseline.id">
                            {{props.game.baseline.name}}
                        </router-link>
                    </div>
                </div>
                <div class="tuple" v-else-if="props.game.treatment !== null">
                    <div class="header">
                        Treatment
                    </div>
                    <div>
                        <router-link :to="'/treatments/' + props.game.treatment.id">
                            {{props.game.baseline.name}}
                        </router-link>
                    </div>
                </div>
                <div class="tuple" v-if="props.game.baseGame !== null">
                    <div class="header">
                        Base Game
                    </div>
                    <div>
                        <router-link :to="'/games/' + props.game.baseGame.id">
                            {{props.game.baseGame.name}}
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="tuple-group">
                <div class="tuple-header">Brokers</div>
                <div class="tuple" v-for="broker in props.game.config.brokers">
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
                    <div>{{capitalize(props.game.config.weather.location.name)}}</div>
                </div>
                <div class="tuple">
                    <div class="header">Start Date</div>
                    <div class="font-mono text-lg">{{date(props.game.config.weather.startDate)}}</div>
                </div>
            </div>
            <div class="tuple-group" v-if="Object.keys(props.game.config.parameters).length > 0">
                <div class="tuple-header">Parameters</div>
                <div class="tuple" v-for="parameter in Object.keys(props.game.config.parameters)" :key="parameter">
                    <div class="grow font-mono">{{parameter}}</div>
                    <div>=</div>
                    <div class="font-mono">{{props.game.config.parameters[parameter]}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
