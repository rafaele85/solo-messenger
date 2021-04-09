import { ID_TYPE } from "../../../../shared/types/id-type";
import {ChatMessage} from "./chat-message";
import { makeStyles, Theme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { IMessage, IMessageChangePayload, IMessagesChangePayload } from "../../../../shared/types/message";
import { MessageService } from '../../../service/message';
import { NotificationService } from "../../../service/notification";
import { IEvent } from "../../../../shared/types/event";

export interface IChatMessagesProps {
    selectedContactId: ID_TYPE;
}

const useStyles = makeStyles((_theme: Theme) => {
    return {
        main: {
            width: "100%",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
                display: "none"
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
        },
        
    }
}, {name: "chat-message-list"});

export const ChatMessages = (props: IChatMessagesProps) => {
    const classes = useStyles();

    const [messages, setMessages] = useState<IMessage[]>([]);

    const [reloadMessageId, setReloadMessageId] = useState<ID_TYPE|undefined>();
    const [reloadContactId, setReloadContactId] = useState<ID_TYPE|undefined>();
    
    const handleMessageChanged = async (payload: IMessageChangePayload) => {
        if (payload.contactid !== props.selectedContactId) {
            return;
        }
        setReloadMessageId(payload.messageid)
    };

    const reloadMessage = async () => {
        try {
            if(!reloadMessageId || !messages.find( (m: IMessage) => m.id===reloadMessageId)) {
                return;
            }
            const msg = await MessageService.instance().messageGet(reloadMessageId);
            const newMessages: IMessage[] = [];
            let found = false;
            for (let i = 0; i < messages.length; i++) {
                const m = messages[i];
                if (m.id === msg.id) {
                    found = true;
                    newMessages.push(msg);
                } else {
                    newMessages.push(m);
                }
            }
            if (found) {
                setMessages(newMessages);
            }
            setReloadMessageId(undefined);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect( () => {
        let mounted=true;
        if(mounted && reloadMessageId) {
            reloadMessage();
        }
        return () => {
            mounted=false;
        }
    }, [reloadMessageId]);

    const handleMessagesChanged = (payload: IMessagesChangePayload) => {
        if (payload.contactid !== props.selectedContactId) {
            return;
        }
        setReloadContactId(payload.contactid);
        console.log("messagesChanged setReloadContactId", payload.contactid)
    };

    const reloadContact = async () => {
        if(!reloadContactId || reloadContactId === props.selectedContactId) {
            return;
        }
        try {
            const msgs = await MessageService.instance().messagesList(reloadContactId);
            setMessages(msgs);
            setReloadContactId(undefined);
        } catch(err) {
            console.error(err);
        }
    };

    useEffect( () => {
        let mounted=true;

        if(mounted && reloadContactId) {
            reloadContact();
        }
        return () => {
            mounted=false;
        }
    }, [reloadContactId])

 
    
    useEffect( () => {
        let mounted=true;
        let msgChangedListenerId: string|undefined=undefined;
        let msgsChangedListenerId: string|undefined=undefined;
        const fetchData = async () => {
            try {                
                const msgs = await MessageService.instance().messagesList(props.selectedContactId);
                setMessages(msgs);
                msgsChangedListenerId = NotificationService.instance().subscribe(IEvent.MESSAGECHANGE, undefined, handleMessagesChanged)
                msgChangedListenerId = NotificationService.instance().subscribe(IEvent.MESSAGELISTCHANGE, undefined, handleMessageChanged)
            } catch(err) {
                console.error(err);                
            }                        
        };
        if(mounted) {
            fetchData();
        }
        return () => {
            mounted=false;
            if(msgsChangedListenerId) {
                NotificationService.instance().unsubscribe(IEvent.MESSAGELISTCHANGE, undefined, msgsChangedListenerId);
            }            
            if(msgChangedListenerId) {
                NotificationService.instance().unsubscribe(IEvent.MESSAGECHANGE, undefined, msgChangedListenerId);
            }            
        }
    }, [props.selectedContactId, ]);
 
    const jsxMessages: JSX.Element[] = [];
    for(let i=0; i<messages.length; i++) {
        const m = messages[i];
        jsxMessages.push((
            <ChatMessage key={m.id} message={m} selectedContactId={props.selectedContactId} />
        ));
    }

    return (
        <div className={classes.main} id={"chat-message-list-main"}>
            {jsxMessages}
        </div>
    )

}