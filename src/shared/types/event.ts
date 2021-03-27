
export enum IEvent {
    AUTH="auth",
    CONTACTS="contacts",
    PROFILE="profile",
    LANGUAGE="language",
    MESSAGES="messages",
    NEWMESSAGE="newmessage",
}

export type IEventPayload = any;

export type ITransportEvent = {
    eventName: IEvent;
    payload: IEventPayload;
}