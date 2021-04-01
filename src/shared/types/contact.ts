import {ID_TYPE} from "./id-type";

export interface IContactShort1 {
    id: ID_TYPE;
    name: string;
}

export interface IContact extends IContactShort1 {
    unread: number;
}

export type IMatchingContactListQuery = {
    query: string
};

export type IContactRequestData = {
    contactId: ID_TYPE;
    message?: string;
}

export type IContactIdData = {
    contactId: ID_TYPE;
}


export const testContactsShort1: IContactShort1[] = [
    {id: "1", name: "Mike Buher"},
    {id: "2", name: "Broan Fegh"},
    {id: "3", name: "Niker Jhcri"},
];

export const testContacts: IContact[] = [
    {id: "1", name: "Mike Buher", unread: 0},
    {id: "2", name: "Broan Fegh", unread: 1},
    {id: "3", name: "Niker Jhcri", unread: 2},
];

