import { PostgreSQLConnection } from './../db/db';
import { parseQueryResult, parseQueryResultArray } from "./../util/query-parse";
import { UnknownError } from "../../shared/types/error";
import { ID_TYPE } from "../../shared/types/id-type";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import { ISession } from "../../shared/types/session";
import { IMessage, IMessageContactIdData, IMessageSendData, IMessageSendResult } from './../../shared/types/message';
import { SocketIOServer } from './../socket-io-server';
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

    public static initialize() {
        APIController.registerHandler(APIResources.MESSAGELIST, MessageController.instance().messagesList);
        APIController.registerHandler(APIResources.MESSAGESEND, MessageController.instance().messageSend);
    }
  
    public async messagesList(payload: IMessageContactIdData, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        const contactId = payload.contactId;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.LIST} ${contactId} ${session}`)
            res = await db.one(PSQLQuery.LIST, [contactId, session]);
            console.log(`${PSQLQuery.LIST} res=`)
            console.dir(res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const messages = parseQueryResultArray<IMessage>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["messages"]}) || [];
        return messages;
    }

    public async messageSend(payload: IMessageSendData, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        const contactId = payload.contactId;
        const message = payload.message;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.SEND} ${contactId} ${message} ${session}`)
            res = await db.one(PSQLQuery.SEND, [contactId, message, session]);
            console.log(`${PSQLQuery.SEND} res=`)
            console.dir(res)

        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const result = parseQueryResult<IMessageSendResult>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["result"]});
        const tosession = result?.tosession;
        const messages = result?.messages || [];
        console.log(`tosession=${tosession}, messages=`, messages)
        if(tosession) {
            SocketIOServer.instance().sendEventToSession(IEvent.NEWMESSAGE, tosession, undefined);
        }
        return messages;
    }

 
}
 