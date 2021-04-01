import { ID_TYPE } from "./id-type";
import { ILanguage } from "./language"
import { ISession } from "./session"

export enum APIResources {
    USERLOGIN="/auth/user-login",
    USERLOGOUT="/auth/user-logout",
    USERSIGNUP="/auth/user-signup",
    PROFILEGET="/profile/get",
    PROFILEUPDATE="/profile/update",

    CONTACTGET="/contact/get",
    CONTACTLIST="/contact/list",
    MATCHINGCONTACTLIST="/contact/matching-list",
    CONTACTSELECT="/contact/select",
    CONTACTREQUEST="/contact/request",
    CONTACTACCEPT="/contact/accept",

    MESSAGEGET="/message/get",
    MESSAGESEND="/message/send",
    MESSAGELIST="/message/list",
    MESSAGECHANGE="/message/change",
    MESSAGEDELETE="/message/delete",
}

export type IRequestParams<TInputParams> = TInputParams & {session?: ISession, language?: ILanguage, messageId?: ID_TYPE};

