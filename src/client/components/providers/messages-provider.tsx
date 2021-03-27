import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {NotificationService} from "../../service/notification";
import {IEvent} from "../../../shared/types/event";
import { selectSelectedContactId } from './../../state/root';
import { setMessages } from "../../state/messages";
import { IMessage } from "../../../shared/types/message";
import { MessageService } from "../../service/message";

export interface IMessagesProviderProps {
    children: any;
}
export const MessagesProvider = (props: IMessagesProviderProps) => {

    const dispatch = useDispatch();
    const handleMessagesChange = (messages: IMessage[]) => {
        console.log("MessageProvider.handleMessageChange messages=", messages);
        dispatch(setMessages(messages));
    };

    const selectedContactId = useSelector(selectSelectedContactId);

    useEffect( () => {
        console.log("MessagesProvider useEffect, selectedContactId=", selectedContactId)
        let mounted=true;
        const fetchData = async () => {
            try {
                await MessageService.instance().messagesList(selectedContactId);
            } catch(err) {
                console.error(err);
            }
        };
        const listenerId = NotificationService.instance().subscribe(IEvent.MESSAGES, undefined, handleMessagesChange);
        console.log("MessagesProvider listenerId = ", listenerId)
        if(mounted) {
            fetchData();
        }

        return () => {
            NotificationService.instance().unsubscribe(IEvent.MESSAGES, undefined, listenerId);
            mounted=false;
        }
    }, [selectedContactId]);

    return (
        <>
            {props.children}
        </>
    )
}