<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {buildBaselineExportTask, ExportBaselineGameFilesTask} from "@/baseline/domain/ExportBaselineGameFilesTask";
import {datetime} from "@/util/DateTimeFormat";
import {api} from "@/api";
import {LoadingState} from "@/util/LoadingState";
import {statusText} from "@/task/domain/Task";

const props = defineProps<{
    baselineId: string
}>();
const exportRoot = ref<string>();
const target = ref(props.baselineId);
const baseUri = ref("");
const tasks = ref<ExportBaselineGameFilesTask[]>([]);
const addingTask = ref(false);
const loadingTasks = ref(LoadingState.Pending);

function addExportTask(): void {
    addingTask.value = true;
    api.orchestrator.baselines.exportFiles(props.baselineId, {target: target.value, baseUri: baseUri.value})
        .then(() => addingTask.value = false)
        .catch(e => addingTask.value = false); // FIXME : add error logging
}

onMounted(() => api.orchestrator.paths.exportRoot()
    .then(p => exportRoot.value = p)
    .catch(e => console.log("unable to load export root path", e)));
onMounted(() => api.orchestrator.baselines.getExportTasks(props.baselineId)
    .then(data => {
        data.map(buildBaselineExportTask).forEach(t => tasks.value.push(t));
        loadingTasks.value = LoadingState.Successful;
    })
    .catch(e => {
        console.log("unable to load existing tasks for baseline with id=" + props.baselineId, e);
        loadingTasks.value = LoadingState.Failed;
    }));
</script>

<template>
    <div class="border border-slate-300 rounded">
        <div>
            <h2 class="font-semibold px-6 mt-4 pb-2.5 border-b">Existing export tasks</h2>
            <div v-for="task in tasks" :key="task.id" v-if="loadingTasks === LoadingState.Successful" class="px-6 py-2.5 border-b">
                <div>
                    <span class="font-semibold">{{datetime(task.createdAt)}}</span> - <span class="uppercase text-sm">{{statusText(task.status)}}</span>
                </div>
                <table>
                    <tr>
                        <th class="font-normal text-left pr-2">Export Path:</th>
                        <td><span class="bg-slate-100 text-slate-800 rounded-sm inline-block py-0.5 px-2 font-mono border border-slate-300">{{exportRoot + task.target}}</span></td>
                    </tr>
                    <tr>
                        <th class="font-normal text-left pr-2">Base URI:</th>
                        <td><span class="bg-slate-100 text-slate-800 rounded-sm inline-block py-0.5 px-2 font-mono mt-[1px] border border-slate-300">{{task.baseUri}}</span></td>
                    </tr>
                </table>
            </div>
            <div v-if="loadingTasks === LoadingState.Pending" class="mt-2">
                <div class="animate-pulse h-8 bg-slate-200 rounded-sm my-0.5"></div>
                <div class="animate-pulse h-8 bg-slate-200 rounded-sm my-0.5"></div>
            </div>
            <div v-if="loadingTasks === LoadingState.Failed" class="border rounded-sm border-pink-300 bg-pink-50 text-pink-700 italic px-4 py-2 text-center mt-2">
                Unable to load existing tasks.
            </div>
        </div>
        <div class="flex flex-col px-6 py-4">
            <label for="export-target" class="font-semibold mb-2">Export Path</label>
            <div class="flex items-stretch">
                <div class="border border-slate-300 bg-slate-50 border-r-0 flex items-center rounded-l-sm px-2">{{exportRoot}}</div>
                <input class="flex-grow border border-slate-300 px-2 py-1.5 rounded-r-sm focus:outline-none focus:border-blue-500 focus:text-slate-900" type="text" id="export-target" v-model="target" />
            </div>
        </div>
        <div class="flex flex-col px-6 pb-4">
            <label for="export-base-uri" class="font-semibold mb-2">Base URI</label>
            <input type="text" id="export-target" v-model="baseUri"
                   class="border border-slate-300 px-2 py-1.5 rounded-sm focus:outline-none focus:border-blue-500 focus:text-slate-900"
                   placeholder="https://example.com/data/" />
        </div>
        <div class="flex justify-end px-6 pb-4">
            <div v-if="addingTask">EXPORTING...</div>
            <button class="button" @click="addExportTask">
                <icon icon="rotate" class="mr-2" />
                Export
            </button>
        </div>
    </div>
</template>