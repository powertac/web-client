<script setup lang="ts">
import BrokerPill from "@/broker/components/BrokerPill.vue";
import Modal from "@/util/components/Modal.vue";
import {Broker} from "@/broker/domain/Broker";
import type {BrokerConfigData} from "@/broker/domain/BrokerConfig";
import {onMounted, ref} from "vue";

const props = defineProps<{
    broker: Broker,
    parameters?: string
}>();
const emit = defineEmits<{
    (e: 'create', config: BrokerConfigData): void,
    (e: 'close'): void
}>();

const name = ref("");
const parameters = ref(props.parameters !== undefined ? props.parameters : "");

const createConfig = (): void => {
    emit('create', {
        brokerId: props.broker.id,
        name: name.value,
        parameters: parameters.value
    });
};
</script>

<template>
    <Modal ref="configModal" @close="emit('close')">
        <template v-slot:title>
            New broker configuration
        </template>
        <form class="max-w-screen-sm form">
            <div class="mt-6">
                <div class="text-lg text-slate-600 mr-4 mb-2">Broker</div>
                <BrokerPill :broker="props.broker" />
            </div>
            <div class="flex flex-col mt-7">
                <label for="broker-config-name" class="block mb-2 text-lg text-slate-600">Name</label>
                <input v-model="name" type="text" id="broker-config-name" class="default grow" />
            </div>
            <div class="mt-7">
                <label for="broker-config-parameters" class="mb-2 text-lg block text-slate-600">Parameters</label>
                <textarea v-model="parameters" class="w-full default font-mono min-h-[16rem] resize-none" id="broker-config-parameters" placeholder="configuration.parameter = value"></textarea>
                <p class="text-slate-600 mt-3">
                    Available options depend on the specific broker implementation and vary between brokers. Leave empty for defaults.
                </p>
                <p class="mt-3 text-slate-600">
                    The parameters must be compatible with the <a class="link" target="_blank" href="https://en.wikipedia.org/wiki/.properties">.properties format</a> and are passed to the broker via the <em>--config</em> flag.
                    Please refer to the <a class="link" target="_blank" href="https://github.com/powertac/sample-broker">Sample Broker GitHub page</a> for details.
                </p>
            </div>
            <div class="mt-7 flex justify-between">
                <button class="button" @click="emit('close')">
                    Cancel
                </button>
                <button class="button form-submit" @click="createConfig">
                    Create broker configuration
                </button>
            </div>
        </form>
    </Modal>
</template>
