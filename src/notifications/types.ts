import type {ConnectionContext} from "../types";

export interface NotificationContext<T> {
    connectionContext: ConnectionContext,
    payload?: T
}

export type Notification<T> = (context: NotificationContext<T>) => void