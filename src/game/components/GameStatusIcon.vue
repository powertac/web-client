<script lang="ts" setup>
import {GameStatus} from "@/game/domain/GameStatus";
import {computed} from "vue";

const props = defineProps<{
    status: GameStatus
}>();

const iconName = computed(() => {
    switch (props.status) {
        case GameStatus.Queued:
            return "clock";
        case GameStatus.Running:
            return "play";
        case GameStatus.Completed:
            return "check";
        case GameStatus.Failed:
            return "bolt";
        case GameStatus.Cancelled:
            return "times";
        default:
            return "";
    }
});
</script>

<template>
    <icon :icon="iconName" />
</template>

