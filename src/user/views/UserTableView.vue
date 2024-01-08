<script lang="ts" setup>
import DatatableHeader from "@/util/datatable/DatatableHeaderField.vue";
import {onMounted, ref} from "vue";
import {Dataset, SortOrder} from "@/util/Dataset";
import {useUserStore} from "@/user/domain/UserStore";
import type {User} from "@/user/domain/User";
import UsersHeader from "@/user/components/UsersHeader.vue";

const userStore = useUserStore();
const users = ref(null as Dataset<User>|null);
const columns: { [name: string]: (a: User, b: User) => number } = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Username": (a, b) => a.username.localeCompare(b.username),
    "Roles": (a, b) => a.roles.length - b.roles.length,
    "Status": (a, b) => a.enabled && !b.enabled ? 1 : !a.enabled && b.enabled ? -1 : 0
};

function createDataset(): Dataset<User> {
    return Dataset.create(columns, userStore.findAll()).orderBy("Created at", SortOrder.DESC);
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (users.value !== null) {
        if (event.ctrlKey) {
            users.value.toggle(column)
        } else {
            const currentIndex = users.value.index(column);
            const currentOrder = users.value.order(column);
            users.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                users.value.orderBy(column, currentOrder);
            }
            users.value.toggle(column);
        }
    }
}

onMounted(() => userStore.fetchAll()
    .then(() => users.value = createDataset())
    .catch((e) => console.error(e)));
</script>

<template>
    <div class="flex grow flex-col" ref="root">
        <UsersHeader />
        <div class="flex relative grow">
            <div class="table-wrapper border-r border-slate-300 grow">
                <table class="datatable bg-white" v-if="users">
                    <thead>
                    <tr>
                        <DatatableHeader v-for="column in Object.keys(columns)"
                                         :class="{'left-aligned': ['ID', 'Username', 'Roles'].includes(column)}"
                                         :name="column" :index="users.index(column)" :order="users.order(column)"
                                         @click="(event) => toggleSorting(column, event)" />
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="user in users.items" :key="user.id">
                        <td class="!text-left font-mono w-96">{{user.id}}</td>
                        <td class="!text-left">{{user.username}}</td>
                        <td class="!text-left uppercase text-sm">{{user.roles.join(',')}}</td>
                        <td class="uppercase text-sm">{{user.enabled ? 'ACTIVE' : 'DISABLED'}}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="datatable bg-white" v-else>
                    <thead>
                    <tr>
                        <th>Status</th>
                        <th class="!text-left">ID</th>
                        <th class="!text-left">Baseline / Treatment</th>
                        <th class="!text-left">Name</th>
                        <th>Created at</th>
                        <th>Completed at</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    <tr>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                        <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>