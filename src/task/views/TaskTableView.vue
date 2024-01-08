<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useTaskStore} from "@/task/domain/TaskStore";
import type {Task, TaskConfig} from "@/task/domain/Task";
import TasksHeader from "@/task/components/TasksHeader.vue";
import {Align, Compare, Format, View} from "@/util/datatable/View";
import Datatable from "@/util/datatable/Datatable.vue";
import {datetime} from "@/util/DateTimeFormat";
import TaskStatus from "@/task/components/TaskStatus.vue";

const taskStore = useTaskStore();
const tasks = ref<Task<TaskConfig>[]>();

const view = new View<Task<TaskConfig>>()
    .field("ID", t => t.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Status", t => t.status, Compare.number, {align: Align.CENTER})
    .field("Priority", t => t.priority, Compare.number, {align: Align.CENTER, classes: ['font-mono']})
    .field("Type", t => t.type, Compare.string, {align: Align.CENTER, classes: ["uppercase", "text-sm"]})
    .field("Created at", t => t.createdAt, Compare.date, {align: Align.RIGHT, formatFn: datetime, classes: ['font-mono']})
    .field("Start", t => t.start, Compare.date, {align: Align.RIGHT, formatFn: Format.defaultTo(datetime, "-"), classes: ['font-mono']})
    .field("End", t => t.end, Compare.date, {align: Align.RIGHT, formatFn: Format.defaultTo(datetime, "-"), classes: ['font-mono']})
    .orderBy("Status")
    .orderBy("End", true)
    .orderBy("Start", true)
    .orderBy("Created at", true);

onMounted(() => taskStore.fetchAll()
    .then(() => tasks.value = taskStore.findAll())
    .catch((e) => console.error("unable to load tasks", e)));
</script>

<template>
    <div class="flex grow flex-col" ref="root">
        <TasksHeader />
        <div class="grow">
            <Datatable :view="view" :items="tasks">
                <template #Status="props">
                    <td class="text-center">
                        <TaskStatus :status="props.item.status" class="text-xs w-9" />
                    </td>
                </template>
            </Datatable>
        </div>
    </div>
</template>

<style lang="scss" scoped>
span.failed { @apply text-pink-500}
span.completed { @apply text-emerald-500}
</style>
