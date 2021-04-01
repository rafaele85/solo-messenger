
export enum IEvent {
    AUTH="auth",
    PROFILECHANGE="profile-change",

    CONTACTLISTCHANGE="contact-list-change",
    CONTACTCHANGE="contact=change",
    CONTACTSELECT="contact-select",
    CONTACTREQUESTACCEPT="contact-request-accept",

    LANGUAGE="language",

    MESSAGELISTCHANGE="message-list-change",
    MESSAGECHANGE="message-change",
}

export type IEventPayload = any;

export type ITransportEvent = {
    eventName: IEvent;
    payload: IEventPayload;
}