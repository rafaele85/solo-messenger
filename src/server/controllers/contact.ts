import { PostgreSQLConnection } from '../db/db';
import { UnknownError } from "../../shared/types/error";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import {
    IContact,
    IContactIdData, IContactRequestData,
    IContactShort1,
    IMatchingContactListQuery
} from '../../shared/types/contact';
import {parseQueryResult, parseQueryResultArray} from '../util/query-parse';
import { ID_TYPE } from '../../shared/types/id-type';
import { SocketIOServer } from '../socket-io-server';
import { IEvent } from '../../shared/types/event';

enum PSQLQuery {
    MYCONTACTSLIST = "select * from MyContactsListJSON($1) res",
    MATCHINGCONTACTSLIST = "select * from MatchingContactsListJSON($1, $2) res",
    FRIENDADD = "select * from FriendAddJSON($1, $2) res",
    FRIENDREQUEST = "select * from FriendAddJSON($1, $2, $3) res",
    CONTACTGET = "select * from ContactGetJSON($1, $2) res",
}

export class ContactController {
    private static _instance = new ContactController();

    public static instance() {
        return ContactController._instance;
    }

    private constructor() {
    }

    public static initialize() {
        APIController.registerHandler(APIResources.CONTACTLIST, ContactController.instance().myContactList);
        APIController.registerHandler(APIResources.MATCHINGCONTACTLIST, ContactController.instance().matchingContactList);
        APIController.registerHandler(APIResources.CONTACTGET, ContactController.instance().contactGet);
        APIController.registerHandler(APIResources.CONTACTREQUEST, ContactController.instance().friendRequest);
        APIController.registerHandler(APIResources.CONTACTACCEPT, ContactController.instance().friendAdd);
    }
  
    public async myContactList(payload: any, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }
        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.MYCONTACTSLIST} ${userId}`)
            res = await db.one(PSQLQuery.MYCONTACTSLIST, [userId]);
            console.log("myContactList res=")
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const contacts = parseQueryResultArray<IContact>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["contacts"]}) || [];
        console.log("contacts=", contacts)
        return contacts;
    }

    public async matchingContactList(payload: IMatchingContactListQuery, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        const query = payload.query;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.MATCHINGCONTACTSLIST} ${query} ${userId}`)
            res = await db.one(PSQLQuery.MATCHINGCONTACTSLIST, [query, userId]);
            console.log("matchingContactList res=")
            console.dir(res)
            console.log(res?.res?.contacts)

        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const contacts = parseQueryResultArray<IContactShort1>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["contacts"]}) || [];
        console.log("matching list parsed contacts=")
        console.dir(contacts);
        return contacts;
    }

    public async contactGet(payload: IContactIdData, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        console.log("contactGet")
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        const contactId = payload.contactId;

        if(!contactId) {
            console.error("contactId is blank");
            throw UnknownError();
        }

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.CONTACTGET} ${contactId} ${userId}`)
            res = await db.one(PSQLQuery.CONTACTGET, [contactId, userId]);
            console.log("CONTACTGET res=")
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }

        const contact = parseQueryResult<IContact>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["contact"]}) || [];
        console.log("contact=")
        console.dir(contact);
        return contact;
    }

    public async friendAdd(payload: IContactIdData, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {

        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }
        const friendId = payload.contactId;

        if(!friendId) {
            console.error("friendId is blank");
            throw UnknownError();
        }

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.FRIENDADD} ${friendId} ${userId}`)
            res = await db.one(PSQLQuery.FRIENDADD, [friendId, userId]);
            console.log("friendAdd res=")
            console.dir(res)
            
            /*
            - triggers CONTACTSCHANGED event sent to me
            - triggers CONTACTSCHANGED event sent to requestor (if they are online)
            */
            SocketIOServer.instance().sendEventToUserId(IEvent.CONTACTCHANGE, friendId, undefined);
            SocketIOServer.instance().sendEventToUserId(IEvent.CONTACTCHANGE, userId, undefined);

        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        return {};
    }

    public async friendRequest(payload: IContactRequestData, _language: ILanguage,  userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        const friendId = payload.contactId;
        if(!friendId) {
            console.error("friendId is blank");
            throw UnknownError();
        }

        const message = payload.message||"";

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.FRIENDREQUEST} ${friendId} ${userId} ${message}`)
            res = await db.one(PSQLQuery.FRIENDREQUEST, [friendId, userId, message]);
            console.log("friendRequest res=")
            console.dir(res)
            SocketIOServer.instance().sendEventToUserId(IEvent.CONTACTLISTCHANGE, friendId, undefined);
            SocketIOServer.instance().sendEventToUserId(IEvent.CONTACTLISTCHANGE, userId, undefined);

        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        return {};
    }

}
 
