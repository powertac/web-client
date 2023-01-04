<script setup lang="ts">
import {computed, onDeactivated, onMounted, ref, watch} from "vue";
import {markTerms, matchAll, parseTerms} from "@/util/TextSearch";
import {v4 as uuid} from "uuid";

const props = defineProps<{
    value: string,
    items: string[],
    placeholder?: string
}>();
const emit = defineEmits<{
    (e: 'selected', parameter: string): void
}>();

const errorClasses = ["bg-pink-50", "!border-pink-400"];
const id = uuid();
const search = ref("");
const resultsOpen = ref(false);
const selectedIndex = ref(null as number|null);
const rootElement = ref(null as HTMLDivElement|null);
const inputElement = ref(null as HTMLInputElement|null);
const resultsElement = ref(null as HTMLDivElement|null);
const searchTerms = computed(() => parseTerms(search.value));
const results = computed(() => matchAll(searchTerms.value, props.items));

function handleClickOutside(event: Event): void {
    if (rootElement.value !== null && !(rootElement.value as HTMLDivElement).contains(event.target as Node)) {
        resultsOpen.value = false;
    }
}

function select(selected: string): void {
    if (props.items.filter((item) => item === selected).length > 0) {
        search.value = selected;
        emit('selected', selected);
        resultsOpen.value = false;
    } else {
        inputElement.value?.classList.add(...errorClasses)
    }
}

function selectPrevious(): void {
    resultsOpen.value = true;
    selectedIndex.value = selectedIndex.value !== null
        ? selectedIndex.value - 1
        : results.value.length - 1;
}

function selectNext(): void {
    resultsOpen.value = true;
    selectedIndex.value = selectedIndex.value !== null
        ? selectedIndex.value + 1
        : 0;
}

function selectedIndexConstraint(index: number|null): void {
    if (index === null) return;
    if (index >= results.value.length)
        selectedIndex.value = 0;
    if (index < 0)
        selectedIndex.value = results.value.length - 1
}

function setScrollOffset(index: number|null): void {
    if (index === null || resultsElement.value === null) return;
    const activeElement: HTMLElement|null = document.getElementById(resultId(index));
    if (index <= 0 || null === activeElement) {
        resultsElement.value.scrollTop = 0;
        return;
    }
    if (index === results.value.length - 1) {
        resultsElement.value.scrollTop = activeElement.offsetTop;
    }
    const scrollZoneTopOffset = resultsElement.value.scrollTop + activeElement.clientHeight;
    if (activeElement.offsetTop < scrollZoneTopOffset) {
        resultsElement.value.scrollTop = activeElement.offsetTop - activeElement.clientHeight;
    }
    const scrollZoneBottomOffset = resultsElement.value.scrollTop
        + resultsElement.value.clientHeight
        - activeElement.clientHeight;
    if ((activeElement.offsetTop + activeElement.offsetHeight) > scrollZoneBottomOffset) {
        resultsElement.value.scrollTop = resultsElement.value.scrollTop
            + activeElement.clientHeight;
    }
}

function resultId(index: number):string {
    return id + "-" + index;
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onDeactivated(() => document.removeEventListener('click', handleClickOutside));
watch(search, (newSearch, oldSearch) => { if (newSearch !== oldSearch) inputElement.value?.classList.remove(...errorClasses)});
watch(results, () => selectedIndex.value = 0);
watch(selectedIndex, selectedIndexConstraint);
watch(selectedIndex, setScrollOffset);
watch(props, () => search.value = props.value);
</script>

<template>
    <div class="autocomplete relative" @focusin="resultsOpen = true" ref="rootElement">
        <input type="text" :placeholder="props.placeholder" class="autocomplete-search default w-full" v-model="search" :class="{'rounded-b-none': resultsOpen}"
               ref="inputElement"
               @keydown="resultsOpen = true"
               @keydown.up="selectPrevious"
               @keydown.down="selectNext"
               @keydown.enter="select(results[selectedIndex])"
               @keydown.esc="resultsOpen = false"
               @keydown.tab="resultsOpen = false" />
        <div class="autocomplete-results border border-t-0 rounded-sm border-stone-300 max-h-60 overflow-scroll absolute top-[100%] w-full bg-white"
             :class="{'hidden': !resultsOpen}" ref="resultsElement">
            <div v-for="(item, index) in results"
                 :id="resultId(index)"
                 class="autocomplete-result px-3 py-1 cursor-pointer hover:bg-stone-50"
                 :class="selectedIndex === index ? ['bg-blue-50', 'hover:bg-blue-100'] : []"
                 :key="index"
                 @click="select(item)"
                 v-html="searchTerms.length > 0 ? markTerms(item, searchTerms, ['text-pink-600', 'inline-block', 'border', 'border-slate-300', 'px-1', 'bg-slate-100', 'rounded-sm', 'mx-0.5', '-my-[1px]']) : item"></div>
            <div class="autocomplete-no-items p-4 bg-slate-50 text-slate-600 italic font-sans" v-if="results.length < 1">
                There are no items matching your input.
            </div>
        </div>
    </div>
</template>
