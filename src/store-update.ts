import {updateManager} from "@/util/store/StoreUpdateManager";
import {useTaskStore} from "@/task/domain/TaskStore";

updateManager.add("tasks", () => useTaskStore().fetchUpdate());