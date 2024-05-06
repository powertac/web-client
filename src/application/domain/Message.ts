export class Message {
    timestamp: number;
    type: MessageType;
    title: string|undefined;
    body: string;
}

export enum MessageType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}