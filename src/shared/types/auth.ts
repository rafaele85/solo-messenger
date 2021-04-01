import { ID_TYPE } from "./id-type";

export interface IAuth {
    sessionkey: ID_TYPE;
}

export interface ISignInData {
    username: string;
    hashPassword: string;
}

export interface ISignUpData extends ISignInData {
    name: string;
    hashConfirmPassword: string;
}

export interface IProfileData {
    name: string;
    hashPassword: string;
    hashConfirmPassword: string;
    avatar?: File;
}


