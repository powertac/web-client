<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {api} from "@/api";
import Autocomplete from "@/util/components/Autocomplete.vue";

const availableImageTags = ref<string[]>([]);
const creatingNewVersion = ref(false);

const name = ref("");
const imageTag = ref("");

function addServerVersion(): void {
    creatingNewVersion.value = true;
    api.orchestrator.servers.addNewVersion({name: name.value, imageTag: imageTag.value})
        .then(newTag => {
            availableImageTags.value.push(newTag);
            creatingNewVersion.value = false;
        })
        .catch(e => console.error("unable to create new simulation server version", e));
}

onMounted(() => api.orchestrator.docker.getImageTags()
    .then(tags => availableImageTags.value = tags)
    .catch(e => console.error("unable to fetch available image tags", e)));
</script>

<template>
    <div class="p-10 border-b border-slate-300">
        <h1 class="text-xl">Add Server Version</h1>
        <div class="flex mt-3 gap-10 flex-row items-stretch">
            <div class="flex flex-col">
                <label for="simulation-server-version-name" class="mb-2">Name</label>
                <input type="text" class="w-[22rem] h-12 px-4 border border-slate-300 rounded-sm" v-model="name" />
            </div>
            <div class="flex flex-col">
                <label for="simulation-server-version-name" class="mb-2">Image Tag</label>
                <Autocomplete class="w-[26rem] h-12 border border-slate-300 rounded-sm font-mono"
                              :items="availableImageTags" value="" v-if="availableImageTags.length > 0" @selected="tag => imageTag = tag" />
            </div>
            <div class="flex flex-row items-end pb-0.5">
                <button class="button" type="button" @click="addServerVersion">
                    <icon icon="plus" class="mr-2" />
                    Add server version
                </button>
            </div>
        </div>
    </div>
</template>