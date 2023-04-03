<script lang="ts" setup>
const props = defineProps<{
    parameters: { [parameter: string]: string }
}>();
</script>

<template>
    <div class="tuple-group" v-if="Object.keys(props.parameters).length > 0">
        <div class="tuple-header">Parameters</div>
        <div class="tuple" v-for="parameter in Object.keys(props.parameters)" :key="parameter">
            <div class="grow font-mono">{{parameter}}</div>
            <div>=</div>
            <div class="font-mono">{{props.parameters[parameter]}}</div>
        </div>
    </div>
</template>
