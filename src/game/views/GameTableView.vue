<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {computed, onMounted, ref} from "vue";
import {Align, Compare, Format, View} from "@/util/datatable/View";
import type {Game} from "@/game/domain/Game";
import {datetime} from "@/util/DateTimeFormat";
import Datatable from "@/util/datatable/Datatable.vue";
import GamesHeader from "@/file/components/GamesHeader.vue";
import GameStatusIcon from "@/game/components/GameStatusIcon.vue";
import TableGroupLink from "@/group/components/TableGroupLink.vue";
import TableSelectedGame from "@/game/components/TableSelectedGame.vue";
import {GameStatus} from "@/game/domain/GameStatus";

const gameStore = useGameStore();
const games = computed(() => gameStore.isReady ? gameStore.findAll() : []);
const gamesLoading = computed(() => !gameStore.isReady);
const gameTable = ref(null);

const view = new View<Game>()
    .field("ID", g => g.id, Compare.string, {classes: ['font-mono', 'w-[20.75rem]']})
    .field("Status", g => g.statusIndex, Compare.number, {align: Align.CENTER})
    .field("Name", g => g.name, Compare.string)
    .field("Group", g => g.group !== null ? g.group.name : "", Compare.string)
    .field("Created at", g => g.createdAt, Compare.date, {align: Align.RIGHT, formatFn: datetime, classes: ['font-mono']})
    .field("Completed at", g => g.end, Compare.date, {align: Align.RIGHT, formatFn: Format.defaultTo(datetime, "-"), classes: ['font-mono']})
    .orderBy("Status")
    .orderBy("Completed at", true)
    .orderBy("Created at", true);

const statusStyles = new Map<GameStatus, string[]>([
    [GameStatus.Queued, ['!bg-stone-100', '!border-stone-400', '!text-stone-700']],
    [GameStatus.Running, ['!bg-indigo-100', '!border-indigo-400', '!text-indigo-700']],
    [GameStatus.Completed, ['!bg-emerald-100', '!border-emerald-400', '!text-emerald-800']],
    [GameStatus.Failed, ['!bg-rose-100', '!border-rose-400', '!text-rose-800']],
    [GameStatus.Cancelled, ['!bg-amber-100', '!border-amber-400', '!text-amber-800']],
]);

function getStatusClasses(status: GameStatus): string[] {
    return statusStyles.get(status);
}

function toggleSelect(): void {
    if (gameTable.value !== null) {
        gameTable.value.toggleSelect();
    }
}

onMounted(() => gameStore.fetchAll().catch(e => console.error("unable to fetch games", e)));
</script>

<template>
    <div class="flex grow flex-col">
        <GamesHeader  />
        <div class="grow">
            <Datatable :view="view" :items="games" :loading="gamesLoading" :selectable="true" ref="gameTable">
                <template #Group="props">
                    <td>
                        <TableGroupLink :group="props.item.group"
                                        :muted="props.selected !== undefined && props.selected?.id !== props.item.id"
                                        :selected="props.selected?.id === props.item.id" />
                    </td>
                </template>
                <template #Status="props">
                    <td class="!p-0">
                        <div class="border border-transparent py-3 text-center -m-[1px] uppercase text-xs"
                            :class="props.selected?.id === props.item.id ? getStatusClasses(props.item.status) : []">
                            <GameStatusIcon class="mr-2" :status="(props.item as Game).status" />
                            {{(props.item as Game).status}}
                        </div>
                    </td>
                </template>
                <template #selected-item="props">
                    <TableSelectedGame :game="(props.item as Game)" @close-self="toggleSelect" />
                </template>
            </Datatable>
        </div>
    </div>
</template>