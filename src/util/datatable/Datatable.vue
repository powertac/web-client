<script lang="ts" generic="E extends Identifiable" setup>
import type {Identifiable} from "@/util/domain/Identifiable";
import type {Field, View} from "@/util/datatable/View";
import {Align} from "@/util/datatable/View";
import DatatableHeader from "@/util/datatable/DatatableHeader.vue";
import {computed, ref} from "vue";

const props = defineProps<{
    view: View<E>;
    items: E[]|undefined;
    selectable?: boolean;
}>();

const view = ref<View<E>>(props.view);
const fields = computed<Field<E, any>[]>(() => view.value.fields);
const selected = ref<E>();

function toggleSorting(name: string, event: MouseEvent): void {
    view.value.toggle(name, event.ctrlKey);
    // FIXME : let's see if it feels more natural if the selection is reset every time the sorting changes
    selected.value = undefined
}

function format(field: Field<E, any>, item: E): string {
    const value = field.accessFn(item);
    return field.formatFn !== undefined
        ? field.formatFn(value)
        : value;
}

function classes(field: Field<E, any>): {[key: string]: boolean} {
    const classes: {[key: string]: boolean} = {};
    if (field.classes !== undefined) {
        field.classes.forEach(c => classes[c] = true)
    }
    if (field.align !== undefined) {
        switch (field.align) {
            case Align.LEFT: classes["text-left"] = true; break;
            case Align.CENTER: classes["text-center"] = true; break;
            case Align.RIGHT: classes["text-right"] = true;
        }
    }
    return classes;
}

function toggleSelect(item: E): void {
    if (props.selectable) {
        selected.value = item !== selected.value ? item : undefined;
    }
}
</script>

<template>
    <table class="datatable">
        <thead>
        <tr>
            <DatatableHeader v-for="field in view.fields" :name="field.name" :align="field.align" :key="field.name"
                                :index="view.index(field.name)" :reverse="view.isReverse(field.name)" :additive="view.isAdditive"
                                @click="e => toggleSorting(field.name, e)" />
        </tr>
        </thead>
        <tbody v-if="items && items.length > 0">
        <template v-for="item in view.sort(items)" :key="item.id">
            <tr @click="toggleSelect(item)" :class="{'selected': selected === item}">
                <slot v-for="field in fields" :name="field.name" :field="field" :item="item">
                    <td :class="classes(field)">{{format(field, item)}}</td>
                </slot>
            </tr>
            <tr v-if="item === selected">
                <td :colspan="fields.length">
                    <slot name="selected-item" :item="item"></slot>
                </td>
            </tr>
        </template>
        </tbody>
        <tbody v-else-if="items !== undefined">
        <tr>
            <td :colspan="fields.length" class="italic text-center !py-6 font-semibold bg-slate-100 !text-slate-500">
                No items available.
            </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr v-for="i in 5" :key="i">
            <td v-for="j in fields.length" :key="j">PLACEHOLDER</td>
        </tr>
        </tbody>
    </table>
</template>