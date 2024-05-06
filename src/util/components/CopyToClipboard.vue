<script lang="ts" setup>
import {useMessageStore} from "@/application/domain/MessageStore";
import {computed, ref} from "vue";

const SHOW_SUCCESS_TIMEOUT = 1500;

const props = defineProps<{
    value: string
}>();

const messages = useMessageStore();
const showSuccess = ref<boolean>(false);
const buttonIcon = computed(() => showSuccess.value ? "check" : "copy");

function copy(): void {
    navigator.clipboard.writeText(props.value)
        .then(() => {
            showSuccess.value = true;
            setTimeout(() => showSuccess.value = false, SHOW_SUCCESS_TIMEOUT);
        })
        .catch(() => messages.error("could not to copy to clipboard"));
}
</script>

<template>
    <button class="button" type="button" @click="copy">
        <icon :icon="buttonIcon" />
    </button>
</template>