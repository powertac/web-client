<script lang="ts" setup>
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {computed, onMounted, ref, watch} from "vue";
import {Broker} from "@/broker/domain/Broker";
import Autocomplete from "@/util/components/Autocomplete.vue";

const props = defineProps<{
    original: Broker
}>();
const emit = defineEmits<{
    (e: 'selected', broker: Broker|undefined): void
}>();

const brokerStore = useBrokerStore();
const selected = ref<Broker>();

const brokers = computed(() => brokerStore.findAll()
    .slice()
    .sort((a, b) => {
        const primary = a.name.localeCompare(b.name);
        return primary !== 0 ? primary : a.version.localeCompare(b.version)
    }));

function label(broker: Broker|undefined): string {
    return broker !== undefined
        ? broker.name + ':' + broker.version
        : "";
}

function matchSelected(selectedLabel: string): Broker|undefined {
    return brokers.value.filter(b => label(b) === selectedLabel).shift();
}

watch(selected, (newSelected) => emit("selected", newSelected));
onMounted(() => selected.value = props.original);
</script>

<template>
    <Autocomplete :value="label(selected)" :items="brokers.map(b => label(b))" @selected="s => selected = matchSelected(s)" class="broker-dropdown grow" />
    <button type="button" class="button !rounded-l-none -ml-[1px] z-50" :disabled="selected === original" @click="selected = original">
        <icon icon="arrow-rotate-left" />
    </button>
</template>

<style>
.broker-dropdown > .autocomplete-search {
    @apply rounded-r-none !important;
}
</style>
