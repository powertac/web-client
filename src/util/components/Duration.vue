<script lang="ts" setup>
import {DateTime, Duration} from "luxon";
import {computed} from "vue";
import {useApplicationStore} from "@/application/ApplicationStore";

const appStore = useApplicationStore();

const props = defineProps<{
    start?: DateTime,
    end?: DateTime
}>();

const duration = computed(() => {
    if (props.start === undefined) {
        return "&mdash;"
    }
    let duration: Duration;
    if (props.end === undefined) {
        duration = appStore.getTime.diff(props.start);
    } else {
        duration = props.end.diff(props.start);
    }
    const durationFormat = duration.as("hours") >= 1 ? "hh:mm:ss" : "mm:ss";
    return duration.toFormat(durationFormat);
});
</script>

<template>
    <span v-html="duration"></span>
</template>
