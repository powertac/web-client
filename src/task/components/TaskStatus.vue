<script lang="ts" setup>
import {TaskStatus} from "@/task/domain/Task";
import {statusText} from "@/task/domain/Task";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed} from "vue";

const props = defineProps<{
    status: TaskStatus
}>();

const icon = computed(() => {
    switch (props.status) {
        case TaskStatus.QUEUED: return ["far", "circle"];
        case TaskStatus.RUNNING: return "play";
        case TaskStatus.COMPLETED: return "check";
        case TaskStatus.FAILED: return "bolt";
    }
});

const clazz = computed(() => {
    switch (props.status) {
        case TaskStatus.QUEUED: return {"text-slate-600": true};
        case TaskStatus.RUNNING: return {"text-blue-700": true};
        case TaskStatus.COMPLETED: return {"text-emerald-700": true};
        case TaskStatus.FAILED: return {"text-pink-600": true};
    }
});
</script>

<template>
    <span class="uppercase" :class="clazz">
        <FontAwesomeIcon :icon="icon" class="mr-1" />
        {{statusText(status)}}
    </span>
</template>