<script lang="ts" setup>
import {Baseline} from "@/baseline/domain/Baseline";
import {datetime} from "@/util/DateTimeFormat";

const props = defineProps<{
    baseline: Baseline
}>();
</script>

<template>
    <div class="tuple-group">
        <div class="tuple-header">Metadata</div>
        <div class="tuple">
            <div class="header mr-16">Status</div>
            <div class="uppercase text-xs !py-3">{{props.baseline.status}}</div>
        </div>
        <div class="tuple">
            <div class="header mr-8">ID</div>
            <div class="font-mono">{{props.baseline.id}}</div>
        </div>
        <div class="tuple">
            <div class="header">Created at</div>
            <div class="font-mono">{{datetime(props.baseline.createdAt)}}</div>
        </div>
    </div>
</template>
