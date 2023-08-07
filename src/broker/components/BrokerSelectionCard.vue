<script lang="ts" setup>
import {Broker} from "@/broker/domain/Broker";

const props = defineProps<{
    broker: Broker
}>();
</script>

<template>
    <div class="card flex">
        <div class="flex items-center mr-2.5 -ml-1">
            <icon icon="plus-circle" class="text-lg" />
        </div>
        <div>
            <h6 class="font-semibold leading-4 mt-1">
                {{props.broker.name}}
            </h6>
            <span class="uppercase text-xs leading-4">{{props.broker.version}}</span>
        </div>
    </div>
</template>
