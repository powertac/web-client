<script lang="ts" setup>
import {datetime} from "@/util/DateTimeFormat";
import {Treatment} from "@/treatment/domain/Treatment";

const props = defineProps<{
    treatment: Treatment
}>();
</script>

<template>
    <div class="tuple-group">
        <div class="tuple-header">Metadata</div>
        <div class="tuple">
            <div class="header mr-16">Status</div>
            <div class="uppercase text-xs !py-3">{{props.treatment.status}}</div>
        </div>
        <div class="tuple">
            <div class="header mr-8">ID</div>
            <div class="font-mono">{{props.treatment.id}}</div>
        </div>
        <div class="tuple">
            <div class="header">Created at</div>
            <div class="font-mono">{{datetime(props.treatment.createdAt)}}</div>
        </div>
        <div class="tuple">
            <div class="header">Baseline</div>
            <div>
                <router-link :to="'/baselines/' + props.treatment.baseline.id" class="flex items-center">
                    <icon icon="seedling" class="text-sm mr-2 text-slate-500" />
                    {{props.treatment.baseline.name}}
                </router-link>
            </div>
        </div>
    </div>
</template>
