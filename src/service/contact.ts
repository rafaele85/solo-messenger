import {NotificationService} from "./notification";

import {IEvent} from "../types/event";
import {CommonService} from "./common";
import axios from "axios";
import {IContact, testContacts} from "../types/contact";

export class ContactService extends CommonService {
    private static readonly _instance = new ContactService();
    public static instance() {
        return ContactService._instance;
    }

    public async сontactsGet() {
        const URL = this.getAPIBaseURL() + "/contact/contacts-get";
        try {
            let contacts: IContact[];
            if(process.env.NODE_ENV==="development") {
                contacts = testContacts;
            } else {
                contacts = await axios.get(URL);
            }
            NotificationService.instance().notify(IEvent.CONTACTS, undefined, contacts);
            return;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

}