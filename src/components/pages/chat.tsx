import {StyledLayout} from "../layout/styled-layout";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {selectContacts} from "../../state/root";
import {IContact} from "../../types/contact";

export const Chat = () => {
    const params = useParams<{id: string}>();
    const id = params.id;
    const contacts = useSelector(selectContacts) || [];
    const currentContact = contacts.find( (c: IContact) => c.id===id);


    const title = `Чат с ${currentContact?.name}`;
    return (
        <StyledLayout title={title}>

        </StyledLayout>
    )
}