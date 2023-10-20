<script lang="ts" setup>
import DatatableHeader from "@/datatable/DatatableHeaderField.vue";
import {onMounted, ref} from "vue";
import {Dataset, SortOrder} from "@/util/Dataset";
import {datetime} from "@/util/DateTimeFormat";
import {useTaskStore} from "@/task/domain/TaskStore";
import type {Task} from "@/task/domain/Task";
import {dateComp} from "@/util/Dates";
import TasksHeader from "@/task/components/TasksHeader.vue";
import {statusText} from "@/task/domain/Task";

const taskStore = useTaskStore();
const tasks = ref(null as Dataset<Task>|null);
const columns: { [name: string]: (a: Task, b: Task) => number } = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Type": (a, b) => a.type.localeCompare(b.type),
    "Created at": (a, b) => dateComp(a.createdAt, b.createdAt),
    "Start": (a, b) => dateComp(a.start, b.start),
    "End": (a, b) => dateComp(a.end, b.end),
    "Priority": (a, b) => a.priority - b.priority,
    "Status": (a, b) => a.status - b.status
};

function createDataset(): Dataset<Task> {
    return Dataset.create(columns, taskStore.findAll())
        .orderBy("Status", SortOrder.DESC)
        .orderBy("Priority", SortOrder.DESC)
        .orderBy("End", SortOrder.DESC);
}

// TODO : move to Dataset class
function toggleSorting(column: string, event: MouseEvent): void {
    if (tasks.value !== null) {
        if (event.ctrlKey) {
            tasks.value.toggle(column)
        } else {
            const currentIndex = tasks.value.index(column);
            const currentOrder = tasks.value.order(column);
            tasks.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                tasks.value.orderBy(column, currentOrder);
            }
            tasks.value.toggle(column);
        }
    }
}

onMounted(() => taskStore.fetchAll()
    .then(() => tasks.value = createDataset())
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex grow flex-col" ref="root">
        <TasksHeader />
        <div class="flex relative grow">
            <div class="table-wrapper border-r border-slate-300 grow">
                <table class="datatable bg-white" v-if="tasks">
                    <thead>
                    <tr>
                        <DatatableHeader v-for="column in Object.keys(columns)"
                                         :name="column" :index="tasks.index(column)" :order="tasks.order(column)"
                                         @click="(event) => toggleSorting(column, event)" />
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="task in tasks.items" :key="task.id" class="selectable">
                        <td class="font-mono w-96">{{task.id}}</td>
                        <td class="uppercase text-sm">{{task.type}}</td>
                        <td>{{datetime(task.createdAt)}}</td>
                        <td>{{task.start !== null ? datetime(task.start) : '-'}}</td>
                        <td>{{task.end !== null ? datetime(task.end) : '-'}}</td>
                        <td>{{task.priority}}</td>
                        <td class="uppercase text-sm">{{statusText(task.status)}}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="datatable bg-white" v-else>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Created at</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Priority</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
