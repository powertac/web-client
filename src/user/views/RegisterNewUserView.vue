<script lang="ts" setup>
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {api} from "@/api";
import {UserRole} from "@/user/domain/User";

const router = useRouter();
const token = (router.currentRoute.value.params.token as string);
const tokenVerified = ref<boolean>();
const username = ref("");
const password = ref("");
const passwordRepeat = ref("");
const providerName = "<PROVIDER>" // FIXME : config value
const registrationComplete = ref(false);
const registrationSuccessful = ref<boolean>();

// validation rules
const showErrors = ref(false);
const hasErrors = computed(() => !(passwordsMatch.value && usernameLongEnough.value));
const passwordsMatch = computed(() => password.value === passwordRepeat.value);
const usernameLongEnough = computed(() => username.value.length >= 5);

function register(): void {
    console.log(hasErrors.value)
    if (!hasErrors.value) {
        api.orchestrator.users.create({
            username: username.value,
            password: password.value,
            roles: [UserRole.Authenticated, UserRole.Base],
            token
        })
            .then(() => (registrationComplete.value = true) && (registrationSuccessful.value = true))
            .catch(e => (registrationComplete.value = true)
                && (registrationSuccessful.value = false)
                && console.error("unable to create user", e));
    } else {
        showErrors.value = true;
    }
}

onMounted(() => api.orchestrator.registrations.verify(token)
    .then(() => tokenVerified.value = true)
    .catch(e => tokenVerified.value = false));
</script>

<template>
    <div class="w-full h-full flex flex-row items-center justify-center">
        <div class="flex flex-row">
            <div class="text-right py-10 pr-10 mr-10 self-stretch">
                <h2 class="font-semibold text-4xl text-blue-800 mt-0.5">Power TAC</h2>
                <h4 class="text-2xl text-blue-800">Experiment Manager</h4>
            </div>
            <div class="w-[30rem] py-10" v-if="!registrationComplete">
                <form class="form" v-if="tokenVerified">
                    <h2 class="text-3xl mb-6">New account</h2>
                    <div class="mb-4">
                        <label for="username" class="block mb-1 ml-1 text-slate-600">Username</label>
                        <input type="text" class="default w-full !text-lg h-14 !text-black" id="username" v-model="username">
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block mb-1 ml-1 text-slate-600">Password</label>
                        <input type="password" class="default w-full h-14 tracking-widest !text-slate-600 !text-sm" id="password" v-model="password">
                    </div>
                    <div class="mb-4">
                        <label for="passwordRepeat" class="block mb-1 ml-1 text-slate-600">Repeat password</label>
                        <input type="password" class="default w-full h-14 tracking-widest !text-slate-600 !text-sm" id="passwordRepeat" v-model="passwordRepeat">
                    </div>
                    <div v-if="hasErrors && showErrors" class="my-3 border rounded border-pink-400 bg-pink-50 py-4 px-6 text-pink-800">
                        Errors have occured:
                        <ul>
                            <li v-if="!usernameLongEnough">Username must consist of five characters or more.</li>
                            <li v-if="!passwordsMatch">Passwords must match.</li>
                        </ul>
                    </div>
                    <div class="mt-2 mb-4 text-slate-700">
                        By creating a user account, you acknowledge and agree to the
                        <a class="link" href="to/tou">terms of use</a> and <a class="link" href="to/pp">privacy policy</a> of
                        this service provided by {{providerName}}.
                    </div>
                    <button type="button" class="mt-2 button h-14" @click="register">Create</button>
                </form>
                <div v-else class="mt-3 border rounded border-pink-400 bg-pink-50 py-4 px-6 text-pink-800">
                    <p class="font-semibold">Your registration token is no longer valid.</p>
                    <p class="mt-3">Please contact your administrator to receive a new token.</p>
                </div>
            </div>
            <div class="w-[30rem] py-10" v-else>
                <div v-if="registrationSuccessful">
                    <h2 class="text-2xl">Registration successful!</h2>
                    <p class="mt-3">Your registration was successful. You can now log in with your chosen credentials.</p>
                    <router-link class="mt-4 flex items-center justify-center button h-14" to="/">
                        Login
                    </router-link>
                </div>
                <div v-else class="border rounded border-pink-400 bg-pink-50 py-4 px-6 text-pink-800">
                    <h2 class="text-2xl">Registration failed</h2>
                    <p class="mt-3">An error occurred while creating your account.</p>
                    <p class="mt-3">Please try again and contact your administrator if this error persists.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
div.error {

}
</style>