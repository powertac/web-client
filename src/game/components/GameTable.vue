<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {Game} from "@/game/domain/Game";
import GameDetails from "@/game/components/GameSidebar.vue";
import {datetime} from "@/util/DateTimeFormat";
import GameStatusIcon from "@/game/components/GameStatusIcon.vue";
import {Dataset, SortOrder} from "@/util/Dataset";
import DatatableHeader from "@/datatable/DatatableHeaderField.vue";
import {v4} from "uuid";

const availableColumns: { [name: string]: (a: Game, b: Game) => number } = {
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

const props = defineProps<{
    games: Game[],
    excludeColumns?: string[]
}>();

const tableId = v4();
const selectedGame = ref<Game>();
const rows = ref<HTMLElement[]>([]);
const dataset = ref(null as Dataset<Game>|null);
const columns = computed(() => {
    const visibleColumns: { [name: string]: (a: Game, b: Game) => number } = {};
    const exclude = props.excludeColumns !== undefined ? props.excludeColumns.map((c) => c.toLowerCase()) : [];
    for (const column of Object.keys(availableColumns)) {
        if (!exclude.includes(column.toLowerCase())) {
            visibleColumns[column] = availableColumns[column];
        }
    }
    return visibleColumns;
});


function isSelected(game: Game): boolean {
    return selectedGame.value !== undefined
        && selectedGame.value.id === game.id;
}

function toggleSorting(column: string, event: MouseEvent): void {
    if (dataset.value !== null) {
        if (event.ctrlKey) {
            dataset.value.toggle(column)
        } else {
            const currentIndex = dataset.value.index(column);
            const currentOrder = dataset.value.order(column);
            dataset.value.reset();
            if (currentIndex !== null && currentOrder !== null) {
                dataset.value.orderBy(column, currentOrder);
            }
            dataset.value.toggle(column);
        }
    }
}

function select(game: Game): void {
    selectedGame.value = game;
}

function rowId(game: Game): string {
    return tableId + ":" + game.id;
}

onMounted(() => {
    dataset.value = Dataset.create(columns.value, props.games)
        .orderBy("Status", SortOrder.ASC)
        .orderBy("Created at", SortOrder.DESC)
        .orderBy("Completed at", SortOrder.DESC)
});
</script>

<template>
    <div class="flex relative grow">
        <div class="table-wrapper border-r border-slate-300 grow">
            <table class="datatable" v-if="dataset !== null">
                <thead>
                <tr>
                    <DatatableHeader v-for="column in Object.keys(columns)"
                                     :class="{'left-aligned': (column === 'Name' || column === 'Baseline / Treatment' || column === 'ID')}"
                                     :name="column" :index="dataset.index(column)" :order="dataset.order(column)"
                                     @click="(event) => toggleSorting(column, event)" />
                </tr>
                </thead>
                <tbody>
                <tr v-for="game in dataset.items" ref="rows" :id="rowId(game)" @click="select(game)" class="selectable" :class="{'selected': isSelected(game)}">
                    <td class="!text-left font-mono w-96" v-if="columns['ID'] !== undefined">{{game.id}}</td>
                    <td class="uppercase text-xs" v-if="columns['Status'] !== undefined">
                        <GameStatusIcon class="mr-2 text-slate-500" :status="game.status" />
                        {{game.status}}
                    </td>
                    <td class="!text-left" v-if="columns['Baseline / Treatment'] !== undefined">
                        <router-link :to="'/baselines/' + game.baseline.id" v-if="game.baseline !== null">
                            {{game.baseline.name}}
                        </router-link>
                        <router-link :to="'/treatments/' + game.treatment.id" v-else-if="game.treatment !== null">
                            {{game.treatment.name}}
                        </router-link>
                        <span v-else>&mdash;</span>
                    </td>
                    <td class="!text-left" v-if="columns['Name'] !== undefined">{{game.name}}</td>
                    <td class="font-mono">{{datetime(game.createdAt)}}</td>
                    <td class="font-mono">{{ game.end !== null ? datetime(game.end) : '-' }}</td>
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
        <GameDetails class="sticky top-0 self-start sidebar"
                     :game="selectedGame"
                     v-if="selectedGame !== undefined"
                     @close-self="() => selectedGame = undefined"
                     ref="gameDetails" />
    </div>
</template>
