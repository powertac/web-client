<script lang="ts" setup>
import type {Game} from "@/game/domain/Game";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "@/api";
import {type JupyterInstance, JupyterServerStatus} from "@/analysis/domain/JupyterInstance";
import {GameStatus} from "@/game/domain/GameStatus";
import {useMessageStore} from "@/application/domain/MessageStore";
import JupyterServerStatusBar from "@/analysis/components/JupyterServerStatusBatch.vue";
import CopyToClipboard from "@/util/components/CopyToClipboard.vue";
import {FontAwesomeIcon as Icon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{ game: Game }>();

const messages = useMessageStore();
const instance = ref<JupyterInstance|null>(null);
const url = computed(() => instance.value !== null? "http://localhost:" + instance.value.port + "/lab?token=" + instance.value.token : null);

const loading = ref(true);
const running = computed(() => instance.value !== null && (instance.value as JupyterInstance).isRunning);
const reachable = computed(() => instance.value !== null && (instance.value as JupyterInstance).isReachable);
const starting = ref<boolean>(false);
const stopping = ref<boolean>(false);
const openOnReachableOption = ref<boolean>(true);
const status = computed(() => {
    if (starting.value) { // -> adding first to represent state change in UI immediately
        return JupyterServerStatus.STARTING
    } else if (instance.value === null) {
        return JupyterServerStatus.NONE;
    } else if (stopping.value) {
      return JupyterServerStatus.STOPPING;
    } else if (running.value && !reachable.value) {
        return JupyterServerStatus.STARTING;
    } else if (reachable.value) {
        return JupyterServerStatus.RUNNING;
    }
});
let updateId: number|undefined;
let openOnReachable: boolean = false;

function start(): void {
    starting.value = true;
    api.orchestrator.jupyter.startGameNotebook(props.game.id)
        .then(i => {
            starting.value = false;
            instance.value = i;
            openOnReachable = openOnReachableOption.value;
        })
        .catch(e => (toggling.value = false) && (console.error(e)));
}

function stop(): void {
    stopping.value = true;
    api.orchestrator.jupyter.stop(props.game.id)
        .then(() => {
            stopping.value = false;
            instance.value = null;
        })
        .catch(e => console.error(e));
}

function updateInstance(): void {
    api.orchestrator.jupyter.getInstance(props.game.id)
        .then(i => {
            loading.value = false;
            instance.value = i;
            updateId = setTimeout(updateInstance, 1000);
            if (i != null && i.isReachable && openOnReachable) {
                window.open(url.value as string, "_blank");
                openOnReachable = false;
            }
        })
        .catch(e => {
            instance.value = null;
            messages.error(e);
            updateId = setTimeout(updateInstance, 1000);
        });
}

onMounted(updateInstance);
onUnmounted(() => clearTimeout(updateId));
</script>

<template>
    <div>
        <h2 class="text-2xl mb-4">Jupyter Server</h2>
        <div class="border border-slate-300 rounded">
            <div class="flex px-4 py-3 h-20 items-center">
                <button type="button" class="button font-semibold flex items-center" v-if="status === JupyterServerStatus.RUNNING" @click="stop">
                    <icon icon="stop" class="-mt-[1px] mr-2.5 text-lg" />
                    Stop server
                </button>
                <div v-else-if="status === JupyterServerStatus.NONE" class="flex items-center">
                    <button type="button" class="button font-semibold flex items-center" @click="start">
                        <icon icon="play" class="-mt-[1px] mr-2.5 text-lg" />
                        Start server
                    </button>
                    <div class="ml-6 mt-[1px] cursor-default" @click="openOnReachableOption = !openOnReachableOption">
                        <input type="checkbox" :checked="openOnReachableOption" class="mr-1" /> Open in new tab when ready
                    </div>
                </div>
                <div class="p-2.5" v-else>
                    <icon icon="circle-notch" class="animate-spin text-2xl text-blue-600" />
                </div>
            </div>
            <div class="bg-slate-50 border-t border-slate-200 py-3">
                <div class="flex items-center px-4 h-11">
                    <div class="w-24 font-semibold uppercase text-sm text-slate-600">Status</div>
                    <div class="grow"><JupyterServerStatusBar :status="status" /></div>
                </div>
                <div class="flex items-center px-4 h-11">
                    <div class="w-24 font-semibold uppercase text-sm text-slate-600">URL</div>
                    <div class="grow">
                        <div v-if="status === JupyterServerStatus.RUNNING && url !== null" class="flex items-center">
                            <div class="block grow font-mono">{{url}}</div>
                            <CopyToClipboard :value="url" class="button-sm mr-0.5" />
                            <a :href="url" target="_blank" class="button button-sm" type="button">
                                <icon icon="arrow-up-right-from-square" />
                            </a>
                        </div>
                        <div class="text-slate-400" v-else>&mdash;</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
div.status-badge {
    @apply border rounded-t px-5 uppercase text-center font-semibold py-3;
}
table.tuples {
    @apply border-t border-slate-300;
    tr {
        &:last-child > th, &:last-child > td { @apply pb-2.5 border-0 }
        & > th, & td { @apply py-2 border-b border-slate-100 }
        & > th { @apply font-normal text-left px-4 text-slate-600 }
    }
}
</style>