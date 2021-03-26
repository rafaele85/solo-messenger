import { ID_TYPE } from "./id-type";
import { ILanguage } from "./language"
import { ISession } from "./session"

export enum APIResources {
    LOGIN="/auth/signin",
    LOGOUT="/auth/logout",
    SIGNUP="/auth/signup",
    UPDATEPROFILE="/auth/update-profile",
    MYCONTACTSLIST="/contact/my-contacts-list",
    MATCHINGCONTACTLIST="/contact/matching-contacts-list",
    FRIENDADD="/contact/friend-add",
}

export type IRequestParams<TInputParams> = TInputParams & {session?: ISession, language?: ILanguage, messageId?: ID_TYPE};

