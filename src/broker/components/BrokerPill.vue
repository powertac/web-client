<script lang="ts" setup>
import {Broker} from "@/broker/domain/Broker";

const props = defineProps<{
    broker: Broker
}>();
</script>

<template>
    <div class="border border-slate-400 bg-slate-50 rounded-sm flex items-stretch justify-between">
        <div class="py-0.5 px-3">{{props.broker.name}}</div>
        <div class="flex py-0.5 border-l border-slate-300 px-2 bg-slate-200 uppercase text-xs items-center">{{props.broker.version}}</div>
    </div>
</template>
