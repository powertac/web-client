<script lang="ts" setup>
import {Modifier, ModifierType} from "@/treatment/domain/Modifier";
import {useBrokerStore} from "@/broker/domain/BrokerStore";

const props = defineProps<{
    modifier: Modifier
}>();

const brokerStore = useBrokerStore();
</script>

<template>
    <div class="tuple-group" v-if="props.modifier.type === ModifierType.ParameterSet">
        <div class="tuple-header">Parameter Set Modifier</div>
        <div class="tuple" v-for="parameter in Object.keys(props.modifier.config.parameters)" :key="parameter">
            <div class="grow font-mono">{{parameter}}</div>
            <div>=</div>
            <div class="font-mono">{{props.modifier.config.parameters[parameter]}}</div>
        </div>
    </div>
    <div class="tuple-group" v-else-if="props.modifier.type === ModifierType.ReplaceBroker">
        <div class="tuple-header">Broker Replacement Modifier</div>
        <div class="tuple" v-for="originalId in Object.keys(props.modifier.config.brokerMapping)" :key="originalId">
            <div class="grow font-mono">{{brokerStore.findById(originalId).name}}</div>
            <div><icon icon="arrow-right" /></div>
            <div class="font-mono">{{brokerStore.findById(props.modifier.config.brokerMapping[originalId]).name}}</div>
        </div>
    </div>
</template>
