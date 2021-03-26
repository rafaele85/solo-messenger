import {NotificationService} from "./notification";
import {IEvent} from "../types/event";
import {CommonService} from "./common";
import {IContact, IFriendAdd, IMatchingContactListQuery, testContacts} from "../types/contact";
import { APIResources } from "../../shared/types/api";
import { IContactShort1 } from './../types/contact';
import { ID_TYPE } from "../../shared/types/id-type";

export class ContactService extends CommonService {
    private static readonly _instance = new ContactService();
    public static instance() {
        return ContactService._instance;
    }

    public async myList() {
        const URL = this.getAPIBaseURL() + APIResources.MYCONTACTSLIST;
        try {
            const sessionkey = this.getSessionKey();
            let contacts: IContact[];
            contacts = await this.apiPost<undefined, IContact[]>(URL, undefined, sessionkey);
            NotificationService.instance().notify(IEvent.CONTACTS, undefined, contacts);
            return;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async matchingList(query: string) {
        const URL = this.getAPIBaseURL() + APIResources.MATCHINGCONTACTLIST;
        try {
            const sessionkey = this.getSessionKey();
            let contacts: IContactShort1[];
            contacts = await this.apiPost<IMatchingContactListQuery, IContactShort1[]>(URL, {query}, sessionkey);
            return contacts;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async friendAdd(friendId: ID_TYPE) {
        const URL = this.getAPIBaseURL() + APIResources.FRIENDADD;
        try {
            const sessionkey = this.getSessionKey();
            const contacts = await this.apiPost<IFriendAdd, IContact[]>(URL, {friendId}, sessionkey);
            console.log("friendAdd contacts=")
            console.dir(contacts);
            NotificationService.instance().notify(IEvent.CONTACTS, undefined, contacts);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

}