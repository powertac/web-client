<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {onMounted, ref} from "vue";
import Duration from "@/util/components/Duration.vue";
import {time} from "@/util/DateTimeFormat";

const gameStore = useGameStore();
const loading = ref(true);

onMounted(() => gameStore.fetchRunning()
    .then(() => loading.value = false)
    .catch(error => console.error("unable to load running games", error)));
</script>

<template>
    <div class="w-[768px]">
        <h2 class="text-2xl text-slate-700 mb-5">Currently running</h2>
        <div v-for="game in gameStore.findRunning"
             class="border rounded border-indigo-300 bg-blue-50 px-7 py-5 flex items-center justify-between">
            <div>
            <h2 class="font-semibold mb-2">{{game.name}}</h2>
                <span class="text-xs uppercase text-slate-600 mr-1.5">Run</span>
                <span>#{{game.runs.length}}</span>
                <span class="text-xs uppercase text-slate-600 ml-10 mr-1.5">Started at</span>
                <span>{{time(game.activeRun.start)}}</span>
                <span class="text-xs uppercase text-slate-600 ml-10 mr-1.5">Duration</span>
                <Duration :start="game.activeRun.start" />
            </div>
            <router-link :to="'/games/' + game.id" class="button block">
                Game Details
            </router-link>
        </div>
        <div v-if="!loading && gameStore.findRunning.length === 0"
             class="border rounded py-5 flex justify-center italic text-slate-600 bg-slate-50 border-slate-300">
            There are currently no games running.
        </div>
        <div v-if="loading" class="justify-center flex border rounded py-5 bg-slate-50 border-slate-300">
            <icon icon="circle-notch" spin="spin" class="text-2xl text-slate-600" />
        </div>
    </div>
</template>
