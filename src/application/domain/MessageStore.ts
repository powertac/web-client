import {type Message, MessageType} from "@/application/domain/Message";
import {defineStore} from "pinia";
import {DateTime} from "luxon";

interface MessageStoreState {
    messages: Message[];
}

export const useMessageStore = defineStore({
    id: "messages",
    state: () => ({messages: []} as MessageStoreState),
    getters: {
        latest: (state: MessageStoreState) =>
            (limit: number = Number.MAX_SAFE_INTEGER) =>
                state.messages.slice().sort((a,b) => a.timestamp - b.timestamp).splice(0, Math.min(limit, state.messages.length)),
        since: (state: MessageStoreState) =>
            (timestamp: number) =>
                state.messages.slice().filter(m => m.timestamp > timestamp).sort((a,b) => a.timestamp - b.timestamp),
        all: (state: MessageStoreState) =>
            state.messages.slice()
    },
    actions: {
        addMessage(message: Message): void {
            this.messages.push(message);
        },
        info(body: string, title?: string): void {
            this.messages.push({
                timestamp: DateTime.now().toMillis(),
                type: MessageType.INFO,
                title,
                body
            });
        },
        error(body: string|Error, title?: string): void {
            this.messages.push({
                timestamp: DateTime.now().toMillis(),
                type: MessageType.ERROR,
                title,
                body: body instanceof Error ? body.message : body
            });
        }
    }
});