import { ID_TYPE } from "./id-type";
import { ISession } from "./session";

export type IMessageId = string;

export enum IMessageType {
    MESSAGE="message",
    FRIENDREQUEST="friendrequest",
}

export type IMessage = {
    id: ID_TYPE;
    message: string;
    from: string;  //from username
    to: string;  //to username
    messagetype: IMessageType;
    date: number;
};

export interface IMessageListData {
    contactId: ID_TYPE;
}

export interface IMessageGetData {
    messageId: ID_TYPE;
}

export interface IMessageSendData extends IMessageListData {
    message: string;    
}

export type IMessageSendResult = {
    tosession: ISession;
    messages: IMessage[];
}

export type IMessagesChangePayload = {
    contactid: ID_TYPE;
}

export type IMessageChangePayload = {
    contactid: ID_TYPE;
    messageid: ID_TYPE;
}