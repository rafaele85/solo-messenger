import {authReducer, IAuthState} from "./auth";
import {contactsReducer, IContactsState} from "./contacts";
import {IProfileState, profileReducer} from "./profile";
import {ILanguageState, languageReducer} from "./language";

export interface IRootState {
    auth: IAuthState;
    contacts: IContactsState;
    profile: IProfileState;
    language: ILanguageState;
}

export const rootReducer = {
    auth: authReducer,
    contacts: contactsReducer,
    profile: profileReducer,
    language: languageReducer,
};

export const selectAuth = (state: IRootState) => state.auth.value;
export const selectContacts = (state: IRootState) => state.contacts.value;
export const selectProfile = (state: IRootState) => state.profile.value;
export const selectLanguage = (state: IRootState) => state.language.value;
