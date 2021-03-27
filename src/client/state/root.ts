import {authReducer, IAuthState} from "./auth";
import {contactsReducer, IContactsState} from "./contacts";
import {IProfileState, profileReducer} from "./profile";
import {ILanguageState, languageReducer} from "./language";
import { IMessagesState, messagesReducer } from "./messages";
import { ISelectedContactIdState, selectedContactIdReducer } from "./selectedContactId";

export interface IRootState {
    auth: IAuthState;
    contacts: IContactsState;
    profile: IProfileState;
    language: ILanguageState;
    selectedContactId: ISelectedContactIdState;
    messages: IMessagesState;
}

export const rootReducer = {
    auth: authReducer,
    contacts: contactsReducer,
    profile: profileReducer,
    language: languageReducer,
    selectedContactId: selectedContactIdReducer,
    messages: messagesReducer,
};

export const selectAuth = (state: IRootState) => state.auth.value;
export const selectContacts = (state: IRootState) => state.contacts.value;
export const selectProfile = (state: IRootState) => state.profile.value;
export const selectLanguage = (state: IRootState) => state.language.value;
export const selectSelectedContactId = (state: IRootState) => state.selectedContactId.value;
export const selectMessages = (state: IRootState) => state.messages.value;
