import {authReducer, IAuthState} from "./auth";
import {contactsReducer, IContactsState} from "./contacts";
import {IProfileState, profileReducer} from "./profile";

export interface IRootState {
    auth: IAuthState;
    contacts: IContactsState;
    profile: IProfileState;
}

export const rootReducer = {
    auth: authReducer,
    contacts: contactsReducer,
    profile: profileReducer,
};

export const selectAuth = (state: IRootState) => state.auth.value;
export const selectContacts = (state: IRootState) => state.contacts.value;
export const selectProfile = (state: IRootState) => state.profile.value;