<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import {type LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import {computed} from "vue";

const props = defineProps<{
    artifacts: Map<Game, LogProcessorArtifact|undefined>
}>();
const games = computed<Game[]>(() => [...props.artifacts.keys()]);
</script>

<template>
    <div>
        <div class="bg-slate-50 flex flex-row">
            <div v-for="(game, index) of games" class="grow text-sm artifact-availability" :class="[artifacts.get(game) != undefined ? 'available' : 'missing']">
                {{index + 1}}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.artifact-availability {
    @apply border-t border-b border-slate-300 text-slate-600;

    &:first-child { @apply border-l rounded-l-sm }
    &:last-child { @apply border-r rounded-r-sm }

    &.missing {
        @apply border-slate-300;
    }
    &.available {
        @apply bg-emerald-100 text-emerald-800 border-emerald-400;
    }
}
</style>
