<script lang="ts" setup>
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import RunningGamesBlock from "@/game/components/RunningGamesBlock.vue";

const brokerStore = useBrokerStore();
</script>

<template>
    <div class="max-w-screen-md mx-auto mt-10">
        <div class="border rounded border-slate-300 py-5 px-7 text-slate-700 my-10" v-if="brokerStore.findAll().length < 1">
            <h2 class="text-2xl text-slate-800">No brokers available</h2>
            <p class="my-4 leading-relaxed">
                There are not yet any brokers added to the Experiment Manager. Check
                <a target="_blank" class="link" href="https://github.com/powertac/broker-images">
                    powertac/broker-images
                    <icon icon="square-up-right" />
                </a> on GitHub for instructions and templates to build broker images.
            </p>
            <p class="mb-1">
                To add broker images that are already installed on your system, use the
                <router-link to="/brokers/add" class="link">add broker</router-link> form.
            </p>
        </div>
        <RunningGamesBlock />
    </div>
</template>
