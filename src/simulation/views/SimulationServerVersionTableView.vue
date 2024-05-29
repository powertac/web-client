<script lang="ts" setup>
import {useServerStore} from "@/simulation/domain/SimulationServerStore";
import {computed, onMounted, ref} from "vue";
import {Compare, View} from "@/util/datatable/View";
import type {SimulationServerVersion} from "@/simulation/domain/SimulationServerVersion";
import {type User, UserRole} from "@/user/domain/User";
import ServersHeader from "@/simulation/components/ServersHeader.vue";
import Datatable from "@/util/datatable/Datatable.vue";
import AddServerVersionForm from "@/simulation/components/AddServerVersionForm.vue";

const serverStore = useServerStore();
const servers = computed(() => serverStore.isReady ? serverStore.findAllVersions() : []);
const serversLoading = computed(() => !serverStore.isReady);
const versionTable = ref(null);

const view = new View<SimulationServerVersion>()
    .field("ID", v => v.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Name", v => v.name, Compare.string)
    .field("Image Tag", v => v.imageTag, Compare.string, {classes: ['font-mono']})
    .orderBy("Name");

onMounted(() => serverStore.fetchAll().catch(e => console.error("unable to fetch server versions", e)));
</script>

<template>
    <div class="flex grow flex-col" ref="userTable">
        <ServersHeader />
        <div>
            <AddServerVersionForm />
        </div>
        <div class="grow">
            <Datatable :view="view" :items="servers" :loading="serversLoading" ref="versionTable"></Datatable>
        </div>
    </div>
</template>