<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {GameValidator} from "@/game/domain/GameValidator";
import {api} from "@/api";
import ValidationBadge from "@/util/components/ValidationBadge.vue";
import {Baseline} from "@/baseline/domain/Baseline";
import type {NewTreatmentDTO} from "@/treatment/domain/Treatment";
import type {NewModifierData} from "@/treatment/domain/Modifier";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import ModifierForm from "@/treatment/components/ModifierForm.vue";
import BaselineSelector from "@/baseline/components/BaselineSelector.vue";
import {useRouter} from "vue-router";
import TreatmentsHeader from "@/treatment/components/TreatmentsHeader.vue";

const baselineStore = useBaselineStore();
const loading = ref(true);

const router = useRouter();
const name = ref("" as string);
const baseline = ref<Baseline>();
const modifier = ref<NewModifierData>();
const nameElement = ref<HTMLElement>();
const baselineElement = ref<HTMLElement>();
const modifierElement = ref<HTMLElement>();

const treatment = computed((): Partial<NewTreatmentDTO> => ({
    name: name.value,
    baselineId: baseline.value?.id,
    modifier: modifier.value !== undefined ? modifier.value : undefined,
}));

function createTreatment(): void {
    if (isValid()) {
        const newTreatment: NewTreatmentDTO = {
            name: name.value,
            baselineId: (baseline.value as Baseline).id,
            modifier: modifier.value as NewModifierData
        };
        api.orchestrator.treatments.create(newTreatment)
            .then(() => router.push("/"))
            .catch((error) => console.error(error));
    } else {
        console.error("treatment data not valid");
    }
}

function isValid(): boolean {
    return GameValidator.gameName(name.value)
        && baseline.value !== undefined
        && modifier.value !== undefined;
}

onMounted(() => baselineStore.fetchAll()
    .then(() => loading.value = false)
    .catch(error => console.error(error)));
</script>

<template>
    <div class="form" @submit="createTreatment" @keyup.ctrl.enter="createTreatment">
        <TreatmentsHeader />
        <div class="form-content" v-if="!loading">
            <div class="form-group mt-3" ref="nameElement">
                <h2 class="form-group-title">Name</h2>
                <div class="form-group-content">
                    <input type="text" class="default w-[32rem]" :class="{'valid': name !== null && GameValidator.gameName(name)}" v-model="name" />
                    <p class="mt-5 text-slate-500">A treatment's name must consist of at least 5 characters.</p>
                </div>
            </div>
            <div class="form-group mt-3" ref="baselineElement">
                <h2 class="form-group-title">Baseline</h2>
                <BaselineSelector class="form-group-content" @selected="(b) => baseline = b" />
            </div>
            <div class="form-group mt-3" ref="modifierElement">
                <h2 class="form-group-title" :class="{'!text-slate-400': baseline === undefined}">Modifier</h2>
                <div class="form-group-content">
                    <ModifierForm :baseline="baseline" v-if="baseline !== undefined" @updated="(m) => modifier = m" />
                    <div class="p-6 bg-slate-50 border border-slate-200 rounded text-center font-semibold text-slate-500" v-else>
                        A baseline must first be selected to define the modifier function.
                    </div>
                </div>
            </div>
        </div>
        <div class="form-footer">
            <div class="form-group !pt-7 !pb-10">
                <h2 class="form-group-title"></h2>
                <div class="form-group-content">
                    <div class="flex gap-1.5 w-full mb-3">
                        <ValidationBadge :valid="GameValidator.gameName(name)" label="Name" @click="nameElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="baseline !== undefined" label="Baseline" @click="baselineElement?.scrollIntoView()" class="cursor-pointer" />
                        <ValidationBadge :valid="modifier !== undefined" label="Modifier" @click="modifierElement?.scrollIntoView()" class="cursor-pointer" />
                    </div>
                    <button type="submit" class="button form-submit button-lg self-start" :disabled="!isValid()" @click="createTreatment">Create Treatment</button>
                </div>
            </div>
        </div>
    </div>
</template>
