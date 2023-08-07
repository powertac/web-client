<script lang="ts" setup>
import {Broker} from "@/broker/domain/Broker";

const props = defineProps<{
    broker: Broker
}>();
</script>

<template>
    <span class="inline-block border border-stone-400 rounded-sm bg-white">
        <span class="inline-block py-0.5 px-1.5 border-r border-stone-300">{{props.broker.name}}</span>
        <span class="inline-block py-0.5 px-1.5 bg-rose-50 text-pink-700">{{props.broker.version}}</span>
    </span>
</template>
