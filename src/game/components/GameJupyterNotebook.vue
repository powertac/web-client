<script lang="ts" setup>
import type {Game} from "@/game/domain/Game";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "@/api";
import type {JupyterInstance} from "@/analysis/domain/JupyterInstance";

const props = defineProps<{
    game: Game
}>();

const JUPYTER_OPEN_DELAY = 1500;

const loading = ref(true);
const instance = ref<JupyterInstance|null>(null);
const toggling = ref<boolean>(false);
const running = computed(() => instance.value !== null && instance.value.isRunning);
const url = computed(() => instance.value !== null? "http://localhost:" + instance.value.port + "/lab?token=" + instance.value.token : null)

function start(): void {
    toggling.value = true;
    api.orchestrator.jupyter.startGameNotebook(props.game.id)
        .then(i => {
            setTimeout(() => { // give jupyter some time to start up (application, not container)
                toggling.value = false;
                instance.value = i;
                window.open(url.value as string, "_blank")
            }, JUPYTER_OPEN_DELAY);
        })
        .catch(e => (toggling.value = false) && (console.error(e)));
}

function stop(): void {
    toggling.value = true;
    api.orchestrator.jupyter.stop(props.game.id)
        .then(() => {
            toggling.value = false;
            instance.value = null;
        })
        .catch(e => console.error(e));
}

onMounted(() => api.orchestrator.jupyter.getInstance(props.game.id)
    .then(i => {
        instance.value = i;
        loading.value = false;
    })
    .catch(e => null));
</script>

<template>
    <div>
        <h2 class="text-2xl">Jupyter Server</h2>
        <div class="mt-4">
            <div>
                <div class="status-badge" v-if="loading">Jupyter status unknown</div>
                <div class="status-badge border-emerald-400 text-emerald-600 bg-emerald-50" v-else-if="running">Jupyter running</div>
                <div class="status-badge border-slate-300 text-slate-500 bg-slate-50" v-else>Jupyter not running</div>
            </div>
            <div class="border-x border-b rounded-b border-slate-300">
                <div class="px-4 py-3">
                    <icon icon="circle-notch" class="animate-spin text-2xl text-blue-600" v-if="toggling" />
                    <button type="button" class="button" @click="stop" v-else-if="running">Stop Jupyter server</button>
                    <button type="button" class="button" @click="start" v-else>Start Jupyter server</button>

                    <a class="button" v-if="!toggling && running && instance !== null" target="_blank"
                       :href="url">Open in new tab</a>
                </div>
                <table class="tuples w-full" v-if="!toggling && instance !== null">
                    <tr>
                        <th>Port</th>
                        <td>{{ instance.port }}</td>
                    </tr>
                    <tr>
                        <th>Token</th>
                        <td>{{ instance.token }}</td>
                    </tr>
                    <tr>
                        <th>URL</th>
                        <td>{{ url }}</td>
                    </tr>
                </table>
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