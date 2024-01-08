<script lang="ts" setup>
import {onMounted, ref} from "vue";
import ValidationBadge from "@/util/components/ValidationBadge.vue";
import {api} from "@/api";
import Autocomplete from "@/util/components/Autocomplete.vue";
import type {NewBrokerData} from "@/broker/domain/Broker";
import {useRouter} from "vue-router";
import BrokersHeader from "@/broker/components/BrokersHeader.vue";

const name = ref("");
const version = ref("");
const imageTag = ref("");

const nameElement = ref<HTMLElement>();
const versionElement = ref<HTMLElement>();
const imageTagElement = ref<HTMLElement>();

const router = useRouter();
const availableImageTags = ref([] as string[]);

function addBroker(): void {
    if (isValid()) {
        const newBroker: NewBrokerData = {
            name: name.value,
            version: version.value,
            imageTag: imageTag.value
        };
        api.orchestrator.brokers.create(newBroker)
            .then(() => router.push({name: "broker-table"}))
            .catch(error => console.error(error));
    }
}

function isValid(): boolean {
    return name.value.length >= 3
        && version.value.length >= 3
        && availableImageTags.value.filter(tag => imageTag.value === tag).length === 1;
}

onMounted(() => api.orchestrator.docker.getImageTags()
    .then(tags => availableImageTags.value = tags) // TODO : force reload brokers
    .catch(error => console.error(error)));
</script>

<template>
    <div class="form" @submit="addBroker" @keyup.ctrl.enter="addBroker">
        <BrokersHeader />
        <div class="form-content">
            <div class="form-group mt-3" ref="imageTagElement">
                <h2 class="form-group-title">Image</h2>
                <div class="form-group-content">
                    <Autocomplete class="w-[32rem]" :items="availableImageTags" value="" v-if="availableImageTags.length > 0" @selected="tag => imageTag = tag" />
                    <p class="mt-5 text-slate-500">Please select an existing broker image. Images must be built or downloaded before being available.</p>
                </div>
            </div>
            <div class="form-group mt-3" ref="nameElement">
                <h2 class="form-group-title">Name</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" v-model="name" />
                    <p class="mt-5 text-slate-500">A broker's name must consist of at least 3 characters. Only alphanumeric characters are allowed.</p>
                </div>
            </div>
            <div class="form-group mt-3" ref="versionElement">
                <h2 class="form-group-title">Version</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" v-model="version" />
                    <p class="mt-5 text-slate-500">The version identifier must consist of at least 3 characters. Only alphanumeric characters are allowed.</p>
                </div>
            </div>
        </div>
        <div class="form-footer">
            <div class="form-group !pt-7 !pb-10">
                <h2 class="form-group-title"></h2>
                <div class="form-group-content">
                    <div class="flex gap-1.5 w-full mb-3">
                        <ValidationBadge :valid="name.length >= 3" label="Name" @click="nameElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="version.length >= 3" label="Version" @click="versionElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="imageTag.length > 0" label="Image" @click="imageTagElement?.scrollIntoView()" class="cursor-pointer" />
                    </div>
                    <button type="submit" class="button form-submit button-lg self-start" :disabled="!isValid()" @click="addBroker">Add Broker</button>
                </div>
            </div>
        </div>
    </div>
</template>
