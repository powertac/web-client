<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import GameStatus from "@/game/components/GameStatus.vue";
import {date, datetime} from "@/util/DateTimeFormat";
import {capitalize} from "@/util/String";
import {GameRun} from "@/game/domain/GameRun";
import {onDeactivated, onMounted, ref, watch} from "vue";

const props = defineProps<{
    game: Game
}>();
const emit = defineEmits<{
    (e: 'close-self', parameter: void): void
}>();
const selectedRun = ref<GameRun>();
const runSelectionOpen = ref(false);
const runSelectionElement = ref<HTMLElement>();

function closeRunSelection(event: MouseEvent): void {
    event.stopPropagation();
    runSelectionOpen.value = false;
}

function handleClickOutsideRunSelection(event: Event): void {
    if (runSelectionElement.value !== undefined && runSelectionElement.value !== null && !(runSelectionElement.value as HTMLDivElement).contains(event.target as Node)) {
        runSelectionOpen.value = false;
    }
}

onMounted(() => selectedRun.value = props.game.runs.length > 0 ? props.game.runs[0] : undefined);
onMounted(() => document.addEventListener('click', handleClickOutsideRunSelection));
watch(props, (p) => selectedRun.value = p.game.runs.length > 0 ? p.game.runs.sort((a, b) => a.start.toMillis() - b.start.toMillis())[0] : undefined);
watch(selectedRun, () => runSelectionOpen.value = false);
onDeactivated(() => document.removeEventListener('click', handleClickOutsideRunSelection));
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
            <div class="tuple-group" v-if="selectedRun !== undefined">
                <div class="tuple-header flex justify-between items-stretch !p-0 relative">
                    <div class="py-3 px-5">
                        Run {{props.game.runs.indexOf(selectedRun) + 1}} of {{props.game.runs.length}}
                    </div>
                    <div class="bg-slate-200 hover:bg-slate-300 border -m-[1px] border-slate-300 flex items-center rounded-tr-sm cursor-pointer"
                         ref="runSelectionElement"
                         v-if="props.game.runs.length > 1"
                         :class="{'border-slate-400': runSelectionOpen, 'bg-slate-300': runSelectionOpen, 'text-slate-600': runSelectionOpen}">
                        <div class="py-3 px-5" @click="runSelectionOpen = !runSelectionOpen">
                            <icon icon="bars" />
                        </div>
                        <ul class="absolute top-full right-0 bg-slate-50 border border-slate-400 rounded-sm rounded-tr-none -mr-[1px]" v-if="runSelectionOpen">
                            <li v-for="run in props.game.runs" :key="run.id" @click="(e) => {selectedRun = run; closeRunSelection(e)}"
                                class="w-full py-1.5 px-3 cursor-pointer hover:bg-slate-200 border-b border-slate-300 last-of-type:border-b-0"
                                :class="{'bg-slate-200': run.id === selectedRun.id, 'text-slate-800': run.id === selectedRun.id}">
                                Run {{props.game.runs.indexOf(run) + 1}} - <span class="normal-case font-mono text-base font-normal">{{run.id}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tuple">
                    <div class="header mr-16">Status</div>
                    <div class="uppercase text-xs flex items-center" :class="{'!p-0': selectedRun.phase === ('DONE'), '!py-3': selectedRun.phase !== 'DONE'}">
                        {{selectedRun.phase}}
                        <div v-if="selectedRun.phase === ('DONE')"
                             class="py-3 px-4 ml-4"
                              :class="{'bg-rose-100': selectedRun.failed, 'text-rose-700': selectedRun.failed, 'text-emerald-700': !selectedRun.failed, 'bg-emerald-100': !selectedRun.failed}">
                            {{selectedRun.end !== null ? selectedRun.failed ? 'FAILED' : 'SUCCESS' : ''}}
                        </div>
                    </div>
                </div>
                <div class="tuple">
                    <div class="header mr-8">ID</div>
                    <div class="font-mono">{{selectedRun.id}}</div>
                </div>
                <div class="tuple">
                    <div class="header mr-16">Start</div>
                    <div class="font-mono">{{selectedRun.start !== null ? datetime(selectedRun.start) : '-'}}</div>
                </div>
                <div class="tuple">
                    <div class="header mr-16">End</div>
                    <div class="font-mono">{{selectedRun.end !== null ? datetime(selectedRun.end) : '-'}}</div>
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
