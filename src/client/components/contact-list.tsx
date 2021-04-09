import {IContact} from "../../shared/types/contact";
import {IMenuUrls} from "../client-types/menu";
import {StyledListItem} from "./styled-list-item";
import {ContactMenuItem} from "./layout/contact-menu-item";
import {Divider} from "@material-ui/core";
import {useHistory} from "react-router";
import {useEffect, useState} from "react";
import {NotificationService} from "../service/notification";
import {IEvent} from "../../shared/types/event";
import {ID_TYPE} from "../../shared/types/id-type";
import {ContactService} from "../service/contact";

export interface IContactListProps {
    additionalClickEffect?: () => void;
}

export const ContactList = (props: IContactListProps) => {

    const history = useHistory();

    let selectedContact;
    const ndx = history.location.pathname.indexOf(IMenuUrls.CONTACT);
    if(ndx>0) {
        selectedContact = history.location.pathname.substring(ndx+IMenuUrls.CONTACT.length);
    }

    const [contacts, setContacts] = useState<IContact[]>([]);

    const refreshContacts = async (mounted: boolean) => {
        if(!mounted) {
            return;
        }
        try {
            const cs = await ContactService.instance().list();
            setContacts(cs);
        } catch(err) {
            console.error(err);
        }
    };

    const handleContactListChange = (payload: IContact[], mounted: boolean) => {
        if(mounted) {
            setContacts(payload);
        }
    };

    const handleContactChange = (payload: IContact, mounted: boolean) => {
        if(!mounted) {
            return;
        }
        const ncs: IContact[] = contacts.map( (c: IContact) => (c.id===payload.id ? payload : c) );
        setContacts(ncs);
    };

    const handleSelectContact = (c: IContact) => {
        try {
            history.push(`${IMenuUrls.CONTACT}/${c.id}`);
        } catch(err) {
            console.error(err);
        }
    };

    useEffect( () => {
        let mounted=true;
        refreshContacts(mounted);
        let contactListChangeListener: ID_TYPE|undefined=undefined;
        let contactChangeListener: ID_TYPE|undefined=undefined;
        if(mounted) {
            contactListChangeListener = NotificationService.instance().subscribe(IEvent.CONTACTLISTCHANGE,
                undefined, (payload: IContact[]) => handleContactListChange(payload, mounted)
            );
            contactChangeListener = NotificationService.instance().subscribe(IEvent.CONTACTCHANGE,
                undefined, (payload: IContact) => handleContactChange(payload, mounted)
            );
        }
        return () => {
            mounted=false;
            if(contactListChangeListener) {
                NotificationService.instance().unsubscribe(IEvent.CONTACTLISTCHANGE, undefined, contactListChangeListener);
            }
            if(contactChangeListener) {
                NotificationService.instance().unsubscribe(IEvent.CONTACTCHANGE, undefined, contactChangeListener);
            }
        }

    }, []);



    let jsxContacts: JSX.Element[] = [];
    for(let i=0; i<contacts.length; i++) {
        const c = contacts[i];
        const isSelected = (c.id === selectedContact);
        jsxContacts.push((
            <StyledListItem key={i}  to={`${IMenuUrls.CONTACT}/${c.id}`}
                            onClick={props.additionalClickEffect} isSelected={isSelected}
            >
                <ContactMenuItem contact={c} onSelect={() => handleSelectContact(c)}/>
            </StyledListItem>
        ))
    }
    if(jsxContacts.length) {
        jsxContacts.unshift(<Divider key={1234}/>);
    }

    return (
        <>
            {jsxContacts}
        </>
    );
}