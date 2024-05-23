<script lang="ts" setup>
import {useUserStore} from "@/user/domain/UserStore";
import {computed, onMounted, ref} from "vue";
import {Align, Compare, View} from "@/util/datatable/View";
import {type User, UserRole} from "@/user/domain/User";
import UsersHeader from "@/user/components/UsersHeader.vue";
import Datatable from "@/util/datatable/Datatable.vue";

const userStore = useUserStore()
const users = computed(() => userStore.isReady ? userStore.findAll() : []);
const usersLoading = computed(() => !userStore.isReady);
const userTable = ref(null)

const view = new View<User>()
    .field("ID", u => u.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Status", u => u.enabled, Compare.boolean, {align: Align.CENTER})
    .field("Username", u => u.username, Compare.string)
    .field("Roles", u => u.rolesAsString, Compare.string) // TODO : normalized role string
    .orderBy("Username");

onMounted(() => userStore.fetchAll().catch(e => console.error("unable to load users", e)));
</script>

<template>
    <div class="flex grow flex-col" ref="userTable">
        <UsersHeader />
        <div class="grow">
            <Datatable :view="view" :items="users" :loading="usersLoading" ref="userTable">
                <template #Status="props">
                    <td class="text-center uppercase text-xs">
                        {{(props.item as User).enabled ? 'ACTIVE' : 'DISABLED'}}
                    </td>
                </template>
                <template #Roles="props">
                    <td class="uppercase text-xs">
                        <span v-for="role in (props.item as User).roles"
                              class="inline-block py-0.5 px-2 bg-slate-50 border rounded-sm border-slate-300 mr-1"
                              :class="role === UserRole.Admin ? ['bg-orange-100', 'border-orange-400', 'text-orange-700'] : []">
                            {{role}}
                        </span>
                    </td>
                </template>
            </Datatable>
        </div>
    </div>
</template>