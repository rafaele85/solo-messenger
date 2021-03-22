import {GenericState, IGenericState} from './generic';
import {IContact} from "../types/contact";

export type IContactsState = IGenericState<IContact[]>;

const st = new GenericState<IContact[]>([], "contacts");

export const contactsReducer = st.reducer();

export const setContacts = st.setValue();
