import { ISession } from "./session";

export type IMessageId = string;

export type IMessage = {
    message: string;
    from: string;  //from username
    to: string;  //to username
    date: Date;
};

export interface IMessageContactIdData {
    contactId: string;
}

export interface IMessageSendData extends IMessageContactIdData {
    message: string;    
}

export type IMessageSendResult = {
    tosession: ISession;
    messages: IMessage[];
}
