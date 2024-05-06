<script setup lang="ts">
import {useMessageStore} from "@/application/domain/MessageStore";
import {datetime} from "@/util/DateTimeFormat";
import {DateTime} from "luxon";

const messageStore = useMessageStore();
</script>

<template>
    <div class="w-full h-12 border-t border-slate-300 bg-slate-50 flex justify-end">
        <div>
            <div class="pr-5">Messages; messages: {{messageStore.all.length}}</div>
            <div class="absolute bottom-12 right-0 w-96 bg-amber-600 border border-slate-300 -mb-[1px]">
                <div v-for="message in messageStore.all" class="bg-white pt-3 pb-4 px-6 border-b border-slate-200">
                    <div class="flex justify-between items-baseline mt-0.5">
                        <h3 class="font-semibold" v-if="message.title !== undefined">{{message.title}}</h3>
                        <div class="text-sm">{{datetime(DateTime.fromMillis(message.timestamp))}}</div>
                    </div>
                    <p>{{message.body}}</p>
                </div>
            </div>
        </div>
    </div>
</template>