<script lang="ts" setup>
import {Broker} from "@/broker/domain/Broker";
const props = defineProps<{
    brokers: Broker[]
}>();
</script>

<template>
    <div class="tuple-group">
        <div class="tuple-header">Brokers</div>
        <div class="tuple" v-for="broker in props.brokers">
            <div class="grow mr-16">
                {{broker.name}}
            </div>
            <div class="uppercase text-xs !text-slate-700">
                {{broker.version}}
            </div>
        </div>
    </div>
</template>
