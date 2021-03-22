import {ID_TYPE} from "./id-type";

export interface IContact {
    id: ID_TYPE;
    name: string;
    unread: number;
}

export const testContacts: IContact[] = [
    {id: "1", name: "Mike Buher", unread: 0},
    {id: "2", name: "Broan Fegh", unread: 1},
    {id: "3", name: "Niker Jhcri", unread: 2},
];
