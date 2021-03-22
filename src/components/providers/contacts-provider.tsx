import {IContact} from "../../types/contact";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {NotificationService} from "../../service/notification";
import {IEvent} from "../../types/event";
import {setContacts} from "../../state/contacts";
import {ContactService} from "../../service/contact";

export interface IContactsProviderProps {
    children: any;
}
export const ContactsProvider = (props: IContactsProviderProps) => {
    const dispatch = useDispatch();
    const handleContactsChange = (contacts: IContact[]) => {
        dispatch(setContacts(contacts));
    };

    useEffect( () => {
        let mounted=true;
        const fetchData = async () => {
            try {
                await ContactService.instance().сontactsGet();
            } catch(err) {
                console.error(err);
            }
        };
        const listenerId = NotificationService.instance().subscribe(IEvent.CONTACTS, undefined, handleContactsChange);
        console.log("ContactsProvider listenerId = ", listenerId)
        if(mounted) {
            fetchData();
        }

        return () => {
            NotificationService.instance().unsubscribe(IEvent.CONTACTS, undefined, listenerId);
            mounted=false;
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}