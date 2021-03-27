import { APIResources } from '../../shared/types/api';
import { ID_TYPE } from '../../shared/types/id-type';
import { IMessage, IMessageContactIdData, IMessageSendData } from '../../shared/types/message';
import { IEvent } from '../../shared/types/event';
import { CommonService } from './common';
import { NotificationService } from './notification';

export class MessageService extends CommonService {
    private static readonly _instance = new MessageService();
    
    public static instance() {
        return MessageService._instance;
    }

    public async messageSend(message: string, contactId: ID_TYPE) {
        const URL = this.getAPIBaseURL() + APIResources.MESSAGESEND;
        try {
            const sessionkey = this.getSessionKey();
            const messages = await this.apiPost<IMessageSendData, IMessage[]>(URL, {message, contactId}, sessionkey);
            console.log("messageSend messages=")
            console.dir(messages);
            NotificationService.instance().notify(IEvent.MESSAGES, undefined, messages);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public async messagesList(contactId: ID_TYPE|undefined) {
        if(!contactId) {
            NotificationService.instance().notify(IEvent.MESSAGES, undefined, []);
            return;
        }
        const URL = this.getAPIBaseURL() + APIResources.MESSAGELIST;
        try {
            const sessionkey = this.getSessionKey();
            const messages = await this.apiPost<IMessageContactIdData, IMessage[]>(URL, {contactId}, sessionkey);
            console.log("messageList messages=")
            console.dir(messages);
            NotificationService.instance().notify(IEvent.MESSAGES, undefined, messages);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
}