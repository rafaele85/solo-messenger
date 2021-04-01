import {IContact} from "../../../shared/types/contact";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {NotificationService} from "../../service/notification";
import {IEvent} from "../../../shared/types/event";
import {setContacts} from "../../state/contacts";
import {ContactService} from "../../service/contact";
import {ID_TYPE} from "../../../shared/types/id-type";
import {selectContacts, selectSelectedContactId} from "../../state/root";

export interface IContactsProviderProps {
    children: any;
}
export const ContactsProvider = (props: IContactsProviderProps) => {

    const dispatch = useDispatch();
    const handleContactsChange = async () => {
        try {
            const cs = ContactService.instance().list();
            dispatch(setContacts(cs));
        } catch(err) {
            console.error(err);
        }
    };
    const contacts = useSelector(selectContacts) || [];

    const handleContactChange = async (contactId: ID_TYPE) => {
        try {
            const updatedContact = await ContactService.instance().contactGet(contactId);
            const newContacts: IContact[] = [];
            for(let c of contacts) {
                if(c.id===updatedContact.id) {
                    newContacts.push(updatedContact);
                } else {
                    newContacts.push(c);
                }
            }
            dispatch(setContacts(newContacts));
        } catch(err) {
            console.error(err);
        }
    };

    const selectedContactId = useSelector(selectSelectedContactId);
    const handleMessagesChange = (contactId: ID_TYPE) => {
        if(contactId===selectedContactId) {
            return;
        }
        handleContactChange(contactId);
    };

    useEffect( () => {
        let mounted=true;
        let contactsChangedListenerId: ID_TYPE|undefined=undefined;
        let contactChangedListenerId: ID_TYPE|undefined=undefined;
        let messagesChangedListenerId: ID_TYPE|undefined=undefined;
        const fetchData = async () => {
            try {
                const contacts = await ContactService.instance().list();
                dispatch(setContacts(contacts));
            } catch(err) {
                console.error(err);
            }
        };
        if(mounted) {
            fetchData();
            contactsChangedListenerId = NotificationService.instance().subscribe(IEvent.CONTACTLISTCHANGE, undefined, handleContactsChange);
            contactChangedListenerId = NotificationService.instance().subscribe(IEvent.CONTACTCHANGE, undefined, handleContactChange);
            messagesChangedListenerId = NotificationService.instance().subscribe(IEvent.MESSAGELISTCHANGE, undefined, handleMessagesChange);
        }

        return () => {
            if(contactsChangedListenerId) {
                NotificationService.instance().unsubscribe(IEvent.CONTACTLISTCHANGE, undefined, contactsChangedListenerId);
            }
            if(contactChangedListenerId) {
                NotificationService.instance().unsubscribe(IEvent.CONTACTCHANGE, undefined, contactChangedListenerId);
            }
            if(messagesChangedListenerId) {
                NotificationService.instance().unsubscribe(IEvent.MESSAGELISTCHANGE, undefined, messagesChangedListenerId);
            }
            mounted=false;
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}