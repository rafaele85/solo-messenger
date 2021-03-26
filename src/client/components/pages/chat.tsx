import {StyledLayout} from "../layout/styled-layout";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {selectContacts, selectLanguage} from "../../state/root";
import {IContact} from "../../types/contact";
import { localization } from './../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";

export const Chat = () => {    
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.CHAT, lang);

    const ttlChatWith = t(ILocalizationResource.CHATWITH)||"Чат с ";

    const params = useParams<{id: string}>();
    const id = params.id;
    const contacts = useSelector(selectContacts) || [];
    const currentContact = contacts.find( (c: IContact) => c.id===id);


    const title = `${ttlChatWith} ${currentContact?.name}`;
    return (
        <StyledLayout title={title}>

        </StyledLayout>
    )
}