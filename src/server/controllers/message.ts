import { PostgreSQLConnection } from '../db/db';
import { parseQueryResultArray } from "../util/query-parse";
import { UnknownError } from "../../shared/types/error";
import { ID_TYPE } from "../../shared/types/id-type";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import { IMessage, IMessageListData, IMessageSendData} from '../../shared/types/message';
import { SocketIOServer } from '../socket-io-server';
import { IEvent } from '../../shared/types/event';

enum PSQLQuery {
    LIST = "select * from MessagesListJSON($1, $2) res",
    SEND = "select * from MessageSendJSON($1, $2, $3) res",
}

export class MessageController {
    private static _instance = new MessageController();

    public static instance() {
        return MessageController._instance;
    }

    private constructor() {
    }


    public static initialize() {
        APIController.registerHandler(APIResources.MESSAGELIST, MessageController.instance().messagesList);
        APIController.registerHandler(APIResources.MESSAGESEND, MessageController.instance().messageSend);
    }
  
    public async messagesList(payload: IMessageListData, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank")
            throw UnknownError();
        }

        const contactId = payload.contactId;

        if(!contactId) {
            console.error("contactId is blank")
            throw UnknownError();
        }

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.LIST} ${contactId} ${userId}`)
            res = await db.one(PSQLQuery.LIST, [contactId, userId]);
            console.log(`${PSQLQuery.LIST} res=`)
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const messages = parseQueryResultArray<IMessage>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["messages"]}) || [];
        console.log("messages=", messages)
        return messages;
    }

    public async messageSend(payload: IMessageSendData, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank")
            throw UnknownError();
        }

        const contactId = payload.contactId;

        if(!contactId) {
            console.error("contactId is blank")
            throw UnknownError();
        }
        const message = payload.message;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.SEND} ${contactId} ${message} ${userId}`)
            res = await db.one(PSQLQuery.SEND, [contactId, message, userId]);
            console.log(`${PSQLQuery.SEND} res=`)
            console.dir(res)

        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        /*
        - triggers NEWMESSAGE event sent to me
        - triggers NEWMESSAGE event sent to friend (if they are online)
        */
        SocketIOServer.instance().sendEventToUserId(IEvent.MESSAGELISTCHANGE, contactId, undefined);
        return {};
    }

 
}
 