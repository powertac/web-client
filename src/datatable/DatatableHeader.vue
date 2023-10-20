<script lang="ts" setup>
import DatatableHeaderField from "@/datatable/DatatableHeaderField.vue";
import type {Column} from "@/datatable/Column";

const props = defineProps<{
    columns: Column<any>[];
}>();
</script>

<template>
    <thead>
    <tr>
        <DatatableHeaderField v-for="column in props.columns"
                         :class="column.classes"
                         :name="column.name" :index="treatments.index(column)" :order="treatments.order(column)"
                         @click="(event) => toggleSorting(column, event)" />
        <slot name="header"></slot>
    </tr>
    </thead>
</template>