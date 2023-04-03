<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import GameStatus from "@/game/components/GameStatus.vue";
import {datetime} from "@/util/DateTimeFormat";

const props = defineProps<{
    game: Game
}>();
</script>

<template>
    <div class="tuple-group">
        <div class="tuple-header">Metadata</div>
        <div class="tuple">
            <div class="header mr-16">Status</div>
            <GameStatus class="!py-3 !pl-6" :status="props.game.status" />
        </div>
        <div class="tuple">
            <div class="header mr-8">ID</div>
            <div class="font-mono">{{props.game.id}}</div>
        </div>
        <div class="tuple">
            <div class="header">Created at</div>
            <div class="font-mono">{{datetime(props.game.createdAt)}}</div>
        </div>
        <div class="tuple" v-if="props.game.baseline !== null">
            <div class="header">
                Baseline
            </div>
            <div>
                <router-link :to="'/baselines/' + props.game.baseline.id">
                    {{props.game.baseline.name}}
                </router-link>
            </div>
        </div>
        <div class="tuple" v-else-if="props.game.treatment !== null">
            <div class="header">
                Treatment
            </div>
            <div>
                <router-link :to="'/treatments/' + props.game.treatment.id">
                    {{props.game.treatment.name}}
                </router-link>
            </div>
        </div>
        <div class="tuple" v-if="props.game.baseGame !== null">
            <div class="header">
                Base Game
            </div>
            <div>
                <router-link :to="'/games/' + props.game.baseGame.id">
                    {{props.game.baseGame.name}}
                </router-link>
            </div>
        </div>
    </div>
</template>
