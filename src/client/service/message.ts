import {APIResources} from '../../shared/types/api';
import {ID_TYPE} from '../../shared/types/id-type';
import {IMessage, IMessageGetData, IMessageListData, IMessageSendData} from '../../shared/types/message';
import {CommonService} from './common';
import {NotificationService} from "./notification";
import {IEvent} from "../../shared/types/event";

export class MessageService extends CommonService {
    private static readonly _instance = new MessageService();
    
    public static instance() {
        return MessageService._instance;
    }
    private constructor() {
        super();        
    }

    public async messageSend(message: string, contactId: ID_TYPE) {        
        try {
            const URL = this.getAPIBaseURL() + APIResources.MESSAGESEND;
            const sessionkey = this.getSessionKey();
            const res = await this.apiPost<IMessageSendData, any>(URL, {message, contactId}, sessionkey);
            console.log("messageSend res=")
            console.dir(res);
            NotificationService.instance().notify(IEvent.MESSAGELISTCHANGE, undefined, contactId);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async messagesList(contactId: ID_TYPE|undefined) {
        if(!contactId) {
            return [];
        }        
        try {
            const URL = this.getAPIBaseURL() + APIResources.MESSAGELIST;
            const sessionkey = this.getSessionKey();
            const messages = await this.apiPost<IMessageListData, IMessage[]>(URL, {contactId}, sessionkey);
            console.log("messageList messages=")
            console.dir(messages);
            return messages;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async messageGet(messageId: ID_TYPE) {
        try {
            const URL = this.getAPIBaseURL() + APIResources.MESSAGEGET;
            const sessionkey = this.getSessionKey();
            const message = await this.apiPost<IMessageGetData, IMessage>(URL, {messageId}, sessionkey);
            console.log("message message=")
            console.dir(message);
            return message;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
}