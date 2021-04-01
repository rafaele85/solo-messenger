import {CommonService} from "./common";
import {
    IContact, IContactIdData, IContactRequestData,
    IMatchingContactListQuery,
} from "../../shared/types/contact";
import { APIResources } from "../../shared/types/api";
import { IContactShort1 } from '../../shared/types/contact';
import { ID_TYPE } from "../../shared/types/id-type";

export class ContactService extends CommonService {
    private static readonly _instance = new ContactService();
    public static instance() {
        return ContactService._instance;
    }
    private constructor() {
        super();        
    }

    public async list() {
        try {
            const URL = this.getAPIBaseURL() + APIResources.CONTACTLIST;
            const sessionkey = this.getSessionKey();
            let contacts: IContact[];
            contacts = await this.apiPost<undefined, IContact[]>(URL, undefined, sessionkey);
            return contacts;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async matchingList(query: string) {        
        try {
            const URL = this.getAPIBaseURL() + APIResources.MATCHINGCONTACTLIST;
            const sessionkey = this.getSessionKey();
            let contacts: IContactShort1[];
            contacts = await this.apiPost<IMatchingContactListQuery, IContactShort1[]>(URL, {query}, sessionkey);
            return contacts;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async contactRequest(contactId: ID_TYPE, message: string) {
        try {
            const URL = this.getAPIBaseURL() + APIResources.CONTACTREQUEST;
            const sessionkey = this.getSessionKey();
            const res = await this.apiPost<IContactRequestData, any>(URL, {contactId, message}, sessionkey);
            console.log("friendRequest res=", res)
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async contactAccept(contactId: ID_TYPE) {
        try {
            const URL = this.getAPIBaseURL() + APIResources.CONTACTACCEPT;
            const sessionkey = this.getSessionKey();
            const res = await this.apiPost<IContactIdData, any>(URL, {contactId}, sessionkey);
            console.log("friendAdd res=")
            console.dir(res);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async contactSelect(contactId: ID_TYPE) {
        try {
            const URL = this.getAPIBaseURL() + APIResources.CONTACTSELECT;
            const sessionkey = this.getSessionKey();
            const res = await this.apiPost<IContactIdData, any>(URL, {contactId}, sessionkey);
            console.log("contactSelect res=")
            console.dir(res);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }



    public async contactGet(contactId: ID_TYPE) {
        try {
            const URL = this.getAPIBaseURL() + APIResources.CONTACTGET;
            const sessionkey = this.getSessionKey();
            const res = await this.apiPost<IContactIdData, IContact>(URL, {contactId}, sessionkey);
            console.log("contactGet res=")
            console.dir(res);
            return res;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }



}