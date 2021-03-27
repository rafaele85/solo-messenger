import { PostgreSQLConnection } from '../db/db';
import { UnknownError } from "../../shared/types/error";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import { ISession } from "../../shared/types/session";
import { IContact, IContactShort1, IFriendAdd, IMatchingContactListQuery } from '../../shared/types/contact';
import { parseQueryResultArray } from '../util/query-parse';
import { ID_TYPE } from '../../shared/types/id-type';

enum PSQLQuery {
    MYCONTACTSLIST = "select * from MyContactsListJSON($1) res",
    MATCHINGCONTACTSLIST = "select * from MatchingContactsListJSON($1, $2) res",
    FRIENDADD = "select * from FriendAddJSON($1, $2) res",
}

export class ContactController {
    private static _instance = new ContactController();

    public static instance() {
        return ContactController._instance;
    }

    public static initialize() {
        APIController.registerHandler(APIResources.MYCONTACTSLIST, ContactController.instance().myContactList);
        APIController.registerHandler(APIResources.MATCHINGCONTACTLIST, ContactController.instance().matchingContactList);
        APIController.registerHandler(APIResources.FRIENDADD, ContactController.instance().friendAdd);
    }
  
    public async myContactList(payload: any, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.MYCONTACTSLIST} ${session}`)
            res = await db.one(PSQLQuery.MYCONTACTSLIST, [session]);
            console.log("myContactList res=")
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const contacts = parseQueryResultArray<IContact>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["contacts"]}) || [];
        return contacts;
    }

    public async matchingContactList(payload: IMatchingContactListQuery, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        const query = payload.query;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.MATCHINGCONTACTSLIST} ${query} ${session}`)
            res = await db.one(PSQLQuery.MATCHINGCONTACTSLIST, [query, session]);
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

    public async friendAdd(payload: IFriendAdd, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        const friendId = payload.friendId;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.FRIENDADD} ${friendId} ${session}`)
            res = await db.one(PSQLQuery.FRIENDADD, [friendId, session]);
            console.log("friendAdd res=")
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const contacts = parseQueryResultArray<IContact>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["contacts"]}) || [];
        return contacts;
    }

}
 
