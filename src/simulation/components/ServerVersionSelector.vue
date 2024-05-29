<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {useServerStore} from "@/simulation/domain/SimulationServerStore";
import Autocomplete from "@/util/components/Autocomplete.vue";
import type {SimulationServerVersion} from "@/simulation/domain/SimulationServerVersion";

const emit = defineEmits<{
    (e: "selected", version: SimulationServerVersion|null): void
}>();

const serverStore = useServerStore();
const serverVersions = computed(() => serverStore.isReady ? serverStore.findAllVersions() : []);
const serverVersionNames = computed(() => serverVersions.value.map((v:SimulationServerVersion) => versionToString(v)));
const storeLoading = computed(() => !serverStore.isReady);
const selectedVersion = ref<SimulationServerVersion|null>(null);
const defaultVersion = computed(() => serverVersions.value.filter(v => v.name === "default").shift());

function select(identifier: string): void {
    if (selectedVersion.value === null || selectedVersion.value.name !== identifier) {
        const version = serverVersions.value.filter(v => versionToString(v) === identifier).shift();
        if (version !== undefined) {
            selectedVersion.value = version;
            emit("selected", version);
        } else {
            emit("selected", null);
        }
    }
}

function versionToString(version: SimulationServerVersion): string {
    return version.name + " - " + version.imageTag;
}

onMounted(() => serverStore.fetchAll().catch(e => console.error("unable to fetch simulation server versions", e)));
</script>

<template>
    <div>
        <div class="w-[32rem] h-[3.2rem] border border-slate-300 bg-slate-100 rounded-sm animate-pulse" v-if="storeLoading">&nbsp;</div>
        <Autocomplete class="w-[32rem]" value="" :items="serverVersionNames" @selected="select" v-else />
    </div>
</template>