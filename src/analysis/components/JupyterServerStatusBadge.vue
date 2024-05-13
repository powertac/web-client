<script lang="ts" setup>
import {JupyterServerStatus} from "@/analysis/domain/JupyterInstance";
import {computed} from "vue";

const props = defineProps<{ status: JupyterServerStatus }>();
const styles = computed(() => {
    switch (props.status) {
        case JupyterServerStatus.NONE:
            return ["bg-slate-200", "text-slate-600", "border-slate-300"];
        case JupyterServerStatus.RUNNING:
            return ["bg-emerald-200", "text-emerald-800", "border-emerald-400"];
        case JupyterServerStatus.STARTING:
        case JupyterServerStatus.STOPPING:
            return ["bg-sky-200", "text-sky-700", "border-sky-400"];
    }
});
const label = computed(() => {
    switch (props.status) {
        case JupyterServerStatus.NONE:
            return "Offline";
        case JupyterServerStatus.RUNNING:
            return "Running";
        case JupyterServerStatus.STARTING:
            return "Starting ...";
        case JupyterServerStatus.STOPPING:
            return "Stopping ...";
    }
});
</script>

<template>
    <span class="rounded-sm font-semibold border w-32 h-9 text-center flex items-center justify-center" :class="styles">
        {{ label }}
    </span>
</template>