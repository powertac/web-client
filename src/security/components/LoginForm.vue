<script lang="ts" setup>
import {ref} from "vue";
import {api} from "@/api";

const username = ref("admin");
const password = ref("supersecure");
const hasError = ref(false);

function login(): void {
    api.orchestrator.auth.login({
        username: username.value,
        password: password.value
    })
        .then(() => console.log("HI"))
        .catch(error => {
            console.error("unable to authenticate", error);
            hasError.value = true;
        });
}
</script>

<template>
    <div class="w-full h-full flex items-center justify-center">
        <div class="pb-28 w-[26rem]">
            <div class="mb-6 ml-1">
                <h2 class="font-semibold text-3xl text-blue-800">Power TAC</h2>
                <h4 class="text-xl text-blue-800">Experiment Manager</h4>
            </div>
            <form class="form" @keyup.enter="login">
                <div class="mb-3">
                    <label for="username" class="block mb-1 ml-1 text-slate-600">Username</label>
                    <input type="text" class="default w-full" id="username" v-model="username">
                </div>
                <div class="mb-3">
                    <label for="password" class="block mb-1 ml-1 text-slate-600">Password</label>
                    <input type="password" class="default w-full !pt-2.5" id="password" v-model="password">
                </div>
                <button type="button" class="mt-6 !py-3.5 button" @click="login">Login</button>
            </form>
            <div v-if="hasError" class="mt-3 border rounded border-pink-400 bg-pink-50 py-4 px-6 text-pink-800">
                Unable to authenticate. Please try again and contact your admin if this problem persists.
            </div>
        </div>
    </div>
</template>
