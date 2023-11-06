import type {RouteRecordRaw} from "vue-router";
import NewGameView from "@/game/views/NewGameView.vue";
import GameTableView from "@/game/views/GameTableView.vue";
import GameDetailsView from "@/game/views/GameDetailsView.vue";
import GameActionsView from "@/game/views/GameActionsView.vue";
import GameFilesView from "@/game/views/GameFilesView.vue";
import GameAnalysisView from "@/game/views/GameAnalysisView.vue";

export const gameRoutes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/games/new',
        name: 'new-game',
        component: NewGameView
    },
    {
        path: '/games/table',
        name: 'game-table',
        component: GameTableView
    },
    {
        path: '/games/:id',
        name: 'game-details',
        component: GameDetailsView
    },
    {
        path: '/games/:id/actions',
        name: 'game-actions',
        component: GameActionsView
    },
    {
        path: '/games/:id/analysis',
        name: 'game-analysis',
        component: GameAnalysisView
    },
    {
        path: '/games/:id/files/:relativePath*',
        name: 'game-files',
        component: GameFilesView
    }
];