<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import {onMounted, ref} from "vue";
import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import {api} from "@/api";
import {Task} from "@/task/domain/Task";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";

const props = defineProps<{
    game: Game,
    artifacts: LogProcessorArtifact[]
}>();
const availableProcessors = ref<LogProcessor[]>([]);
const tasks = ref<Task<LogProcessorTaskConfig>[]>([]);

onMounted(() => api.orchestrator.processors.availableProcessors()
    .then(p => availableProcessors.value = p.sort((a,b) => a.name.localeCompare(b.name)))
    .catch(e => console.error("unable to load available log processors", e)));
</script>

<template>
    <div class="mt-10 text-slate-700">
        <h2 class="text-2xl font-semibold">Analyzers</h2>
    </div>
</template>