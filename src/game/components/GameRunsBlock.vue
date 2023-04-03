<script lang="ts" setup>
import {datetime} from "@/util/DateTimeFormat";
import {GameRun} from "@/game/domain/GameRun";
import {onDeactivated, onMounted, ref, watch} from "vue";

const props = defineProps<{
    runs: GameRun[]
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

onMounted(() => selectedRun.value = props.runs.length > 0 ? props.runs[0] : undefined);
onMounted(() => document.addEventListener('click', handleClickOutsideRunSelection));
watch(props, (p) => selectedRun.value = p.runs.length > 0 ? p.runs.sort((a, b) => a.start.toMillis() - b.start.toMillis())[0] : undefined);
watch(selectedRun, () => runSelectionOpen.value = false);
onDeactivated(() => document.removeEventListener('click', handleClickOutsideRunSelection));
</script>

<template>
    <div class="tuple-group" v-if="selectedRun !== undefined">
        <div class="tuple-header flex justify-between items-stretch !p-0 relative">
            <div class="py-3 px-5">
                Run {{props.runs.indexOf(selectedRun) + 1}} of {{props.runs.length}}
            </div>
            <div class="bg-slate-200 hover:bg-slate-300 border -m-[1px] border-slate-300 flex items-center rounded-tr-sm cursor-pointer"
                 ref="runSelectionElement"
                 v-if="props.runs.length > 1"
                 :class="{'border-slate-400': runSelectionOpen, 'bg-slate-300': runSelectionOpen, 'text-slate-600': runSelectionOpen}">
                <div class="py-3 px-5" @click="runSelectionOpen = !runSelectionOpen">
                    <icon icon="bars" />
                </div>
                <ul class="absolute top-full right-0 bg-slate-50 border border-slate-400 rounded-sm rounded-tr-none -mr-[1px]" v-if="runSelectionOpen">
                    <li v-for="run in props.runs" :key="run.id" @click="(e) => {selectedRun = run; closeRunSelection(e)}"
                        class="w-full py-1.5 px-3 cursor-pointer hover:bg-slate-200 border-b border-slate-300 last-of-type:border-b-0"
                        :class="{'bg-slate-200': run.id === selectedRun.id, 'text-slate-800': run.id === selectedRun.id}">
                        Run {{props.runs.indexOf(run) + 1}} - <span class="normal-case font-mono text-base font-normal">{{run.id}}</span>
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
</template>
