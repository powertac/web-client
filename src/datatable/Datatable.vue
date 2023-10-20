<script lang="ts" setup>
import DatatableHeaderField from "@/datatable/DatatableHeaderField.vue";
import type {DatatableConfig} from "@/datatable/DatatableConfig";
import DatatableHeader from "@/datatable/DatatableHeader.vue";

const props = defineProps<{
    table: DatatableConfig<any>
}>();
</script>

<template>
    <table class="datatable bg-white">
        <DatatableHeader :columns="props.table.columns" />
        <tbody>>
        <tr v-for="item in table.items">
            <slot :item="item"></slot>
        </tr>
        </tbody>
    </table>
    <table class="datatable bg-white" v-else>
        <thead>
        <tr>
            <slot name="header"></slot>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
        </tr>
        <tr>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
        </tr>
        <tr>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
            <td><div class="bg-slate-200 rounded-sm animate-pulse">&nbsp;</div></td>
        </tr>
        </tbody>
    </table>
</template>