import {StyledLayout} from "../../layout/styled-layout";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {selectLanguage} from "../../../state/root";
import {IContact} from "../../../../shared/types/contact";
import {localization} from '../../../service/localization';
import {ILocalizationCategory, ILocalizationResource} from "../../../../shared/types/localization";
import {ChatInput} from "./chat-input";
import React, {useEffect, useState} from "react";
import {ChatMessages} from "./chat-messages";
import {ContactService} from "../../../service/contact";
import {ID_TYPE} from "../../../../shared/types/id-type";
import {NotificationService} from "../../../service/notification";
import {IEvent} from "../../../../shared/types/event";
import {makeStyles, Theme} from "@material-ui/core";
import {MessageService} from "../../../service/message";

const useStyles = makeStyles((theme: Theme) => {
    return {
        chat: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "calc(100% - 45px)",
        },
    }
}, {name: "chat"});
export const Chat = () => {
    const classes = useStyles();
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.CHAT, lang);
    const ttlChatWith = t(ILocalizationResource.CHATWITH)||"Чат с ";

    const params = useParams<{id: string}>();
    const id = params.id;

    const [currentContact, setCurrentContact] = useState<IContact|undefined>(undefined);

    const handleContactChange = (payload: IContact, mounted: boolean) => {
        if(mounted) {
            setCurrentContact(payload);
        }
    };

    useEffect( () => {
        let mounted=true;
        let currentContactListenerId: ID_TYPE|undefined=undefined;
        const fetchData = async () => {
            try {
                const cc = await ContactService.instance().contactGet(id);
                setCurrentContact(cc);
                currentContactListenerId = NotificationService.instance().subscribe(IEvent.CONTACTCHANGE,
                    undefined, (payload: IContact) => handleContactChange(payload, mounted)
                );
            } catch(err) {
                console.error(err);
            }
        };

        if(mounted) {
            fetchData();
        }

        return () => {
           mounted=false;
           if(currentContactListenerId) {
               NotificationService.instance().unsubscribe(IEvent.CONTACTCHANGE,  undefined, currentContactListenerId);
           }
        }
    }, [params.id]);

    const handleMessageSend = async (txt: string) => {
        if(!txt) {
            return;
        }
        try {
            await MessageService.instance().messageSend(txt, id);
        } catch(err) {
            console.error(err);
        }
    }

    const title = `${ttlChatWith} ${currentContact?.name}`;
    return (
        <StyledLayout title={title}>
            <div className={classes.chat}>
                <ChatMessages selectedContactId={id}/>
                <ChatInput selectedContactId={id} messageSend={handleMessageSend}/>
            </div>
        </StyledLayout>
    )
}