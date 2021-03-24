import {NotificationService} from "./notification";

import {IEvent} from "../types/event";
import {CommonService} from "./common";
import {sha256} from "js-sha256";
import {IAuth} from "../types/auth";
import {IProfile} from "../types/profile";

type ISignInData = {
    username: string;
    hashPassword: string;
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
        const url = this.getAPIBaseURL()+"/auth/signin";
        const hashPassword = sha256(password);
        const signInData: ISignInData = {username, hashPassword};
        let authData;
        try {
            if(process.env.NODE_ENV==="development" && username==="john" && password==="12345678" ) {
                authData = {name: "John Smith", sessionId: "12134343434"};
                console.log("signin1")
            } else if(process.env.NODE_ENV==="development" && username==="john1") {
                throw {username: "Invalid username"};
            } else {
                authData = await this.apiGet<ISignInData, IAuth>(url, signInData);
            }
            NotificationService.instance().notify(IEvent.AUTH, undefined, authData);
            if(authData) {
                const profile: IProfile = { name: authData?.name};
                NotificationService.instance().notify(IEvent.PROFILE, undefined, profile);
            }
            return;
        } catch(err) {
            console.error(err);
            if(err.username || err.password) {
                throw err;
            }
            throw {error: "Ошибка при входе в систему"};
        }
    }

    public async signOut() {
        const url = this.getAPIBaseURL()+"/auth/signout";
        try {
            if(process.env.NODE_ENV==="development") {

            } else {
                await this.apiGet<undefined, undefined>(url, undefined);
            }
            NotificationService.instance().notify(IEvent.AUTH, undefined, undefined);
            NotificationService.instance().notify(IEvent.PROFILE, undefined, undefined);
            return;
        } catch(err) {
            console.error(err)
        }
    }

    public async updateProfile(name: string, password: string, confirmPassword: string) {
        const url = this.getAPIBaseURL()+"/auth/update-profile";
        const hashPassword = sha256(password);
        const hashConfirmPassword = sha256(confirmPassword);
        const profileData: IProfileData = {name, hashPassword, hashConfirmPassword};
        try {
            if(process.env.NODE_ENV==="development" && name==="John Smith" && password==="12345678" ) {

            } else {
                const profile = await this.apiGet<IProfileData, IProfile>(url, profileData);
                NotificationService.instance().notify(IEvent.PROFILE, undefined, profile);
            }
            return;
        } catch(err) {
            console.error(err);
            if(err.name || err.password || err.confirmPassword) {
                throw err;
            }
            throw {error: "Ошибка при сохранении профайла"};
        }
    }

}