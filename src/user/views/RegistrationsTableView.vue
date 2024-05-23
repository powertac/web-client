<script lang="ts" setup>
import UsersHeader from "@/user/components/UsersHeader.vue";
import {useRegistrationStore} from "@/user/domain/RegistrationStore";
import Datatable from "@/util/datatable/Datatable.vue";
import {Align, Compare, Format, View} from "@/util/datatable/View";
import type {RegistrationToken} from "@/user/domain/RegistrationToken";
import {buildRegistrationToken} from "@/user/domain/RegistrationToken";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, onMounted, ref} from "vue";
import {api} from "@/api";
import {datetime} from "@/util/DateTimeFormat";
import {useRouter} from "vue-router";

const router = useRouter();
const registrationStore = useRegistrationStore();
const registrationTokens = computed(() => registrationStore.isReady? registrationStore.findAll() : []);
const registrationsLoading = computed(() => !registrationStore.isReady);
const createdTokens = ref<RegistrationToken[]>([]);
const view = new View<RegistrationToken>()
    .field("Issued by", t => t.issuedBy.username, Compare.string)
    .field("Issued at", t => t.issuedAt, Compare.date, {formatFn: datetime, align: Align.RIGHT, classes: ['font-mono']})
    .field("Status", t => t.status, Compare.string, {align: Align.CENTER})
    .field("Claimed by", t => t.claimedBy ? t.claimedBy.username : '-', Compare.string)
    .field("Claimed at", t => t.claimedAt, Compare.date, {formatFn: Format.defaultTo(datetime, "-"), align: Align.RIGHT, classes: ['font-mono']})
    .field("Expires at", t => t.expiresAt, Compare.date, {formatFn: datetime, align: Align.RIGHT, classes: ['font-mono']})
    .field("actions", t => t)
    .orderBy("Issued at", true);
const lastCopiedId = ref<number>();

function createToken(): void {
    api.orchestrator.registrations.create()
        .then(t => createdTokens.value.push(buildRegistrationToken(t)))
        .catch(e => console.error("unable to create registration token", e));
}

function registrationUrlToClipboard(token: RegistrationToken): void {
    const route = router.resolve({name: "register-user", params: {token: token.token}});
    navigator.clipboard.writeText(new URL(route.fullPath, window.location.origin,).href);
    lastCopiedId.value = token.id
    setTimeout(() => lastCopiedId.value = undefined, 1500);
}

onMounted(() => registrationStore.fetchAll().catch(e => console.error("unable to fetch registration tokens", e)));
</script>

<template>
    <div class="flex grow flex-col">
        <UsersHeader />
        <div class="border-b border-slate-300 px-8 py-4">
            <button class="button" @click="createToken">
                <FontAwesomeIcon icon="plus" class="mr-1.5" />
                Create token
            </button>
            <div v-for="token in createdTokens" :key="token.id" class="border rounded border-slate-300 px-6 py-4 mt-2">
                <div>
                    <span class="font-semibold mr-1.5">Token:</span>
                    <span class="font-mono">{{token.token}}</span>
                </div>
                <div><span class="font-semibold mr-1.5">Expires at:</span>{{datetime(token.expiresAt)}}</div>
            </div>
        </div>
        <Datatable :view="view" :items="registrationTokens" :selectable="false" :loading="registrationsLoading">
            <template #Status="props">
                <td class="uppercase text-xs text-center">
                    {{(props.item as RegistrationToken).status}}
                </td>
            </template>
            <template #actions="props">
                <td class="py-0">
                    <button type="button" class="button button-sm"
                            :class="{'active': lastCopiedId === props.item.id}"
                            @click="registrationUrlToClipboard(props.item)">
                        <span v-if="props.item.id !== lastCopiedId">copy registration link</span>
                        <span v-else>copied !</span>
                    </button>
                </td>
            </template>
        </Datatable>
    </div>
</template>
