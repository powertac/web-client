<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {onMounted, ref, watch} from "vue";
import {Game} from "@/game/domain/Game";
import GameDetails from "@/game/components/GameDetails.vue";
import {datetime} from "@/util/DateTimeFormat";
import GameStatusIcon from "@/game/components/GameStatusIcon.vue";
import {Dataset, SortOrder} from "@/util/Dataset";
import DatatableHeader from "@/datatable/DatatableHeader.vue";
import {v4} from "uuid";

const gameStore = useGameStore();
const loading = ref<boolean>(); // TODO : add loading
const selectedGame = ref<Game>();
const games = ref(null as Dataset<Game>|null);
const rows = ref<HTMLElement[]>([]);
const tableId = v4();

const columns: { [name: string]: (a: Game, b: Game) => number } = {
    "ID": (a, b) => a.id.localeCompare(b.id),
    "Status": (a, b) => a.statusIndex - b.statusIndex,
    "Baseline / Treatment": (a, b) => {
        if (a.baseline === null && b.baseline === null) return 0;
        else if (a.baseline === null) return 1;
        else if (b.baseline === null) return -1;
        else return a.baseline.name.localeCompare(b.baseline.name);
    },
    "Name": (a, b) => a.name.localeCompare(b.name),
    "Created at": (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis(),
    "Completed at": (a, b) => {
        if (a.end === null && b.end === null) return 0;
        else if (a.end === null) return -1;
        else if (b.end === null) return 0;
        else return a.end.toMillis() - b.end.toMillis()
    }
};

function isSelected(game: Game): boolean {
    return selectedGame.value !== undefined
        && selectedGame.value.id === game.id;
}

function createDataset(): Dataset<Game> {
    return Dataset.create(columns, gameStore.findAll())
        .orderBy("Status", SortOrder.ASC)
        .orderBy("Created at", SortOrder.DESC)
        .orderBy("Completed at", SortOrder.DESC);
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (games.value !== null) {
        if (event.ctrlKey) {
            games.value.toggle(column)
        } else {
            const currentIndex = games.value.index(column);
            const currentOrder = games.value.order(column);
            games.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                games.value.orderBy(column, currentOrder);
            }
            games.value.toggle(column);
        }
    }
}

function select(game: Game): void {
    selectedGame.value = game;
    const id = rowId(game);
    const row = rows.value.filter(r => r.id === id).shift();
    if (row !== undefined) {
        row.scrollIntoView();
    }
}

function rowId(game: Game): string {
    return tableId + ":" + game.id;
}

onMounted(() => gameStore.fetchAllOnce()
    .then(() => {
        loading.value = false
        games.value = createDataset();
    })
    .catch((error) => console.error(error)));
</script>

<template>
    <div class="flex flex-col h-full bg-slate-50" ref="root">
        <div class="grow overflow-scroll">
            <table class="datatable bg-white" v-if="games">
                <thead>
                <tr>
                    <DatatableHeader v-for="column in Object.keys(columns)"
                                     :class="{'left-aligned': (column === 'Name' || column === 'Baseline / Treatment' || column === 'ID')}"
                                     :name="column" :index="games.index(column)" :order="games.order(column)"
                                     @click="(event) => toggleSorting(column, event)" />
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="game in games.items" ref="rows" :id="rowId(game)" @click="select(game)" class="selectable" :class="{'selected': isSelected(game)}">
                    <td class="!text-left font-mono w-96">{{game.id}}</td>
                    <td class="uppercase text-xs">
                        <GameStatusIcon class="mr-2 text-slate-500" :status="game.status" />
                        {{game.status}}
                    </td>
                    <td class="!text-left">
                        <router-link :to="'/baselines/' + game.baseline.id" v-if="game.baseline !== null">
                            {{game.baseline.name}}
                        </router-link>
                        <router-link :to="'/treatments/' + game.treatment.id" v-else-if="game.treatment !== null">
                            {{game.treatment.name}}
                        </router-link>
                        <span v-else>&mdash;</span>
                    </td>
                    <td class="!text-left">{{game.name}}</td>
                    <td class="font-mono">{{datetime(game.createdAt)}}</td>
                    <td class="font-mono">{{ game.end !== null ? datetime(game.end) : '-' }}</td>
                    <td class="!p-0">
                        <router-link :to="'/games/' + game.id" class="button !py-1.5 !px-2 !bg-slate-50 hover:!bg-blue-100">
                            <icon icon="dice-d6" class="mr-1" />
                            Game Page
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="datatable bg-white" v-else>
                <thead>
                <tr>
                    <th>Status</th>
                    <th class="!text-left">ID</th>
                    <th class="!text-left">Baseline / Treatment</th>
                    <th class="!text-left">Name</th>
                    <th>Created at</th>
                    <th>Completed at</th>
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
        </div>
        <GameDetails :game="selectedGame" v-if="selectedGame !== undefined" @close-self="() => selectedGame = undefined" ref="gameDetails" />
    </div>
</template>
