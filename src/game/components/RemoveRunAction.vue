<script lang="ts" setup>
import {GameRun} from "@/game/domain/GameRun";
import {datetime} from "@/util/DateTimeFormat";
import {onMounted, ref} from "vue";
import {api} from "@/api";
import {formatBytes} from "@/util/File";

const props = defineProps<{
    run: GameRun
}>();

const storageBytes = ref(null as number|null);
const shouldConfirm = ref(false);
const removing = ref(false);
const removed = ref(false);

function remove(): void {
    removing.value = true;
    api.orchestrator.runs.removeFiles(props.run.id)
        .then(() => removed.value = true)
        .catch(error => console.error("failed to remove run files for ", props.run.id, error));
}

onMounted(() => api.orchestrator.runs.storageBytes(props.run.id)
    .then(bytes => {
        storageBytes.value = bytes
        removed.value = bytes === 0
    })
    .catch(error => console.error("unable to retrieve storage bytes for ", props.run.id, error)));
</script>

<template>
    <div class="rounded border border-slate-300 px-6 py-3 flex justify-between items-center my-2">
        <div>
            <span class="font-semibold">{{run.id}}</span><br>
            {{datetime(run.start)}} - {{datetime(run.end)}}
        </div>
        <div v-if="removed" class="uppercase text-sm text-slate-400 mr-3.5">
            <icon icon="check" class="mr-2" />
            Removed
        </div>
        <div class="flex items-center" v-else>
            <div class="mr-5" v-if="!shouldConfirm">
                {{formatBytes(storageBytes)}}
            </div>
            <button type="button" class="button" v-if="!shouldConfirm" @click="shouldConfirm = true">
                <icon icon="times" class="mr-2" />
                Remove
            </button>
            <div v-else-if="!removing">
                <button type="button" class="button button-danger mr-2" @click="remove">
                    <icon icon="check" class="mr-2" />
                    Confirm Removal
                </button>
                <button type="button" class="button" @click="shouldConfirm = false">
                    <icon icon="times" class="mr-2" />
                    Cancel
                </button>
            </div>
            <div v-else>
                <icon class="text-2xl text-blue-600" icon="circle-notch" :spin="true" />
            </div>
        </div>
    </div>
</template>
