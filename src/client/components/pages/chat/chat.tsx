import {StyledLayout} from "../../layout/styled-layout";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {selectContacts, selectLanguage} from "../../../state/root";
import {IContact} from "../../../../shared/types/contact";
import { localization } from '../../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../../shared/types/localization";
import {ChatInput} from "./chat-input";
import React, { useEffect } from "react";
import { setSelectedContactId } from "../../../state/selectedContactId";
import { ChatMessages } from "./chat-messages";


export const Chat = () => {    
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.CHAT, lang);
    const ttlChatWith = t(ILocalizationResource.CHATWITH)||"Чат с ";

    const params = useParams<{id: string}>();
    const id = params.id;

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(setSelectedContactId(id));
    }, [id, dispatch]);

    const contacts = useSelector(selectContacts) || [];
    const currentContact = contacts.find( (c: IContact) => c.id===id);
    console.log(`Chat: id=${id} currentContact=${currentContact} contacts=`)
    console.dir(contacts);
 
    const title = `${ttlChatWith} ${currentContact?.name}`;
    return (
        <StyledLayout title={title}>
            <ChatMessages selectedContactId={id}/>            
            <ChatInput  selectedContactId={id} />
        </StyledLayout>
    )
}