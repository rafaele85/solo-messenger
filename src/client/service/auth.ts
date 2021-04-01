import {NotificationService} from "./notification";
import {IEvent} from "../../shared/types/event";
import {CommonService} from "./common";
import {sha256} from "js-sha256";
import {IProfileData, ISignInData, ISignUpData} from "../../shared/types/auth";
import {IProfile} from "../../shared/types/profile";
import {APIResources} from "../../shared/types/api";
import {ILocalizationResource} from "../../shared/types/localization";
import {ID_TYPE} from "../../shared/types/id-type";
import {SocketIOService} from "./socket-io-service";
import {ContactService} from "./contact";

export class AuthService extends CommonService {
    private static readonly _instance = new AuthService();
    public static instance() {
        return AuthService._instance;
    }

    private constructor() {
        super();    
    }

    public isSignedIn() {
        return !!localStorage.getItem("session");
    }

    public async signIn(username: string, password: string) {        
        const ttlSigninError=ILocalizationResource.ERROR_LOGINFAILED;        
        const hashPassword = sha256(password);
        console.log(`AuthService.signIn username=${username} hashpassword=${hashPassword}`)
        const signInData: ISignInData = {username, hashPassword};
        let session;
        try {
            const url = this.getAPIBaseURL()+APIResources.USERLOGIN;
            session = await this.apiPost<ISignInData, ID_TYPE>(url, signInData);
            localStorage.setItem("session", session);
            SocketIOService.instance().initialize(session);
            await this.profileGet();
            await ContactService.instance().list();
            NotificationService.instance().notify(IEvent.AUTH,undefined, !!session );
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
        const hashPassword = sha256(password);
        const hashConfirmPassword = sha256(confirmPassword);
        console.log(`signUp name=${name} username=${username} password=${hashPassword} confirmPassword=${hashConfirmPassword}`)
        const data: ISignUpData = {name, username, hashPassword, hashConfirmPassword};
        try {
            const url = this.getAPIBaseURL()+APIResources.USERSIGNUP;
            const session = await this.apiPost<ISignInData, ID_TYPE>(url, data);
            localStorage.setItem("session", session);
            SocketIOService.instance().initialize(session);
            await this.profileGet();
            NotificationService.instance().notify(IEvent.AUTH,undefined, !!session );
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
        try {
            const url = this.getAPIBaseURL()+APIResources.USERLOGOUT;
            const session = this.getSessionKey();
            console.log("signout2 session=", session)
            console.log(`${url} {} ${session}`)
            await this.apiPost<{}, undefined>(url, {}, session);
        } catch(err) {
            console.error(err)
        }
        try {
            localStorage.removeItem("session");
            NotificationService.instance().notify(IEvent.AUTH, undefined, undefined);
            return;
        } catch(err) {
            console.error(err)
            return;
        }
    }

    public async updateProfile(name: string, password: string, confirmPassword: string, avatar?: File) {
        const ttlSaveProfileError=ILocalizationResource.ERROR_SAVINGPROFILE;        
        const hashPassword = sha256(password);
        const hashConfirmPassword = sha256(confirmPassword);
        const profileData: IProfileData = {name, hashPassword, hashConfirmPassword, avatar};
        try {
            const url = this.getAPIBaseURL()+APIResources.PROFILEUPDATE;
            const session = this.getSessionKey();
            await this.apiPostMultipart<IProfileData, IProfile>(url, profileData, session);

            return;
        } catch(err) {
            console.error(err);
            if(err.name || err.password || err.confirmPassword) {
                throw err;
            }
            throw {error: ttlSaveProfileError};
        }
    }

    public async profileGet() {        
        try {
            const url = this.getAPIBaseURL()+APIResources.PROFILEGET;
            const session = this.getSessionKey();
            const p = await this.apiPost<any, IProfile>(url, {}, session);
            return p;
        } catch(err) {
            console.error(err);
            if(err.name || err.password || err.confirmPassword) {
                throw err;
            }
        }
    }

}