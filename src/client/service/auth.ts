import {NotificationService} from "./notification";

import {IEvent} from "../types/event";
import {CommonService} from "./common";
import {sha256} from "js-sha256";
import {IAuth} from "../../shared/types/auth";
import {IProfile} from "../types/profile";
import { APIResources } from "../../shared/types/api";
import { ILocalizationResource } from "../../shared/types/localization";

interface ISignInData {
    username: string;
    hashPassword: string;
}

interface ISignUpData extends ISignInData {
    name: string;
    hashConfirmPassword: string;
}


type IProfileData = {
    name: string;
    hashPassword: string;
    hashConfirmPassword: string;
}

export class AuthService extends CommonService {
    private static readonly _instance = new AuthService();
    public static instance() {
        return AuthService._instance;
    }

    public async signIn(username: string, password: string) {
        const ttlSigninError=ILocalizationResource.ERROR_LOGINFAILED;
        const url = this.getAPIBaseURL()+APIResources.LOGIN;
        const hashPassword = sha256(password);
        const signInData: ISignInData = {username, hashPassword};
        let authData;
        try {
            authData = await this.apiPost<ISignInData, IAuth>(url, signInData);
            NotificationService.instance().notify(IEvent.AUTH, undefined, authData);
            if(authData) {
                const profile: IProfile = { name: authData?.name};
                NotificationService.instance().notify(IEvent.PROFILE, undefined, profile);
            }
            return;
        } catch(err) {
            console.error("Error:");
            console.dir(err)
            if(err.username || err.password) {
                throw err;
            }
            throw {error: ttlSigninError};
        }
    }

    public async signUp(name: string, username: string, password: string, confirmPassword: string) {
        
        const ttlSignupError=ILocalizationResource.ERROR_SIGNUPFAILED;
        const url = this.getAPIBaseURL()+APIResources.SIGNUP;
        const hashPassword = sha256(password);
        const hashConfirmPassword = sha256(confirmPassword);
        console.log(`signUp name=${name} username=${username} password=${hashPassword} confirmPassword=${hashConfirmPassword}`)
        const data: ISignUpData = {name, username, hashPassword, hashConfirmPassword};
        let authData;
        try {
            const authData = await this.apiPost<ISignInData, IAuth>(url, data);
            NotificationService.instance().notify(IEvent.AUTH, undefined, authData);
            if(authData) {
                const profile: IProfile = { name: authData?.name};
                NotificationService.instance().notify(IEvent.PROFILE, undefined, profile);
            }
            return;
        } catch(err) {
            console.error("signup - Error");
            console.dir(err)
            if(err.username || err.password || err.name || err.confirmPassword) {
                throw err;
            }
            throw {error: ttlSignupError};
        }
    }

    public async signOut() {
        console.log("signout")
        const url = this.getAPIBaseURL()+APIResources.LOGOUT;
        console.log("signout1 url=", url)
        try {
            const session = this.getSessionKey();
            console.log("signout2 session=", session)
            console.log(`${url} {} ${session}`)
            await this.apiPost<any, undefined>(url, {}, session);
            NotificationService.instance().notify(IEvent.AUTH, undefined, undefined);
            NotificationService.instance().notify(IEvent.PROFILE, undefined, undefined);
            return;
        } catch(err) {
            console.error(err)
        }
    }

    public async updateProfile(name: string, password: string, confirmPassword: string) {
        const ttlSaveProfileError=ILocalizationResource.ERROR_SAVINGPROFILE;
        const url = this.getAPIBaseURL()+APIResources.UPDATEPROFILE;
        const hashPassword = sha256(password);
        const hashConfirmPassword = sha256(confirmPassword);
        const profileData: IProfileData = {name, hashPassword, hashConfirmPassword};
        try {
            const session = this.getSessionKey();
            const profile = await this.apiPost<IProfileData, IProfile>(url, profileData, session);
            NotificationService.instance().notify(IEvent.PROFILE, undefined, profile);
            return;
        } catch(err) {
            console.error(err);
            if(err.name || err.password || err.confirmPassword) {
                throw err;
            }
            throw {error: ttlSaveProfileError};
        }
    }

}