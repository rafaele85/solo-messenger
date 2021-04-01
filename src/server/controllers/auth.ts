import { PostgreSQLConnection } from '../db/db';
import { UnknownError } from "../../shared/types/error";
import { parseQueryResult, parseQueryResultArray, parseQueryResultString } from '../util/query-parse';
import { ID_TYPE } from "../../shared/types/id-type";
import { ISignInData, ISignUpData } from "../../shared/types/auth";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import { ISession } from "../../shared/types/session";
import { IProfile, IProfileUpdateData } from '../../shared/types/profile';
import { SocketIOServer } from '../socket-io-server';
import { IEvent } from '../../shared/types/event';
import { suuid } from '../../shared/service/uuid';
import fs from "fs";


type IProfileUpdateSQLData = {
    name: string;
    hashpassword: string;
    hashconfirmpassword: string;
    avatar: string|undefined;
    userid: string
}


enum PSQLQuery {
    LOGIN = "select * from UserLoginJSON($1, $2) res", //username, hashpassword
    LOGOUT = "select * from UserLogoutJSON($1) res",   //userid
    PROFILEGET = "select * from ProfileGetJSON($1) res",  //userid
    PROFILEUPDATE = "select * from ProfileUpdateJSON($1) res",  //name,username,hashpassword,hashconfirmpassword,avatar,userid
    SIGNUP = "select * from UserSignupJSON($1, $2, $3, $4) res",  //name,username,hashpassword,hashconfirmpassword
}

export class AuthController {
    private static _instance = new AuthController();

    private sessionUserId = new Map<ISession, ID_TYPE>();
    private userIdSession = new Map<ID_TYPE, ISession>();

    private constructor() {
    }

    public static instance() {
        return AuthController._instance;
    }

    public static initialize() {
        APIController.registerHandler(APIResources.USERLOGIN, AuthController.instance().login);
        APIController.registerHandler(APIResources.USERLOGOUT, AuthController.instance().logout);
        APIController.registerHandler(APIResources.USERSIGNUP, AuthController.instance().signup);
        APIController.registerHandler(APIResources.PROFILEGET, AuthController.instance().profileGet);
        APIController.registerHandler(APIResources.PROFILEUPDATE, AuthController.instance().profileUpdate, {fileName: "avatar"});
    }

    public getSessionUserId(session: ISession) {
        const userId = this.sessionUserId.get(session);
        if(!userId) {
            console.error(`not found userId for session ${session}`)
        }
        return userId;
    }

    public getUserIdSession(userId: ID_TYPE) {
        return this.userIdSession.get(userId);
    }
  
    public async login(payload: ISignInData, _language: ILanguage, _userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        const username = payload?.username;
        const hashPassword = payload?.hashPassword;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.LOGIN} ${username} ${hashPassword}`)
            res = await db.one(PSQLQuery.LOGIN, [username, hashPassword]);
            console.log("res=", res)
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        /*
        - triggers event contactchange sent to all contacts who are online
        */
        const userId = parseQueryResultString({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["userid"]});

        if(!userId) {
            console.error("res.userid is blank or invalid");
            throw UnknownError();
        }
        
        const prevSession = AuthController.instance().userIdSession.get(userId);
        if(prevSession) {
            AuthController.instance().userIdSession.delete(prevSession);
        }
        const session = suuid();
        AuthController.instance().userIdSession.set(userId, session);
        AuthController.instance().sessionUserId.set(session, userId);

        const contactIds = parseQueryResultArray<ID_TYPE>({strErrorsJSON: "", strPayloadJSON: res?.res["contactids"]}) || [];
        SocketIOServer.instance().sendEventToUserIds(IEvent.CONTACTCHANGE, contactIds, userId);
        return session;
    }

    public async signup(payload: ISignUpData, _language: ILanguage, _userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        const name = payload?.name;
        const username = payload?.username;
        const hashPassword = payload?.hashPassword;
        const hashConfirmPassword = payload?.hashConfirmPassword;
        
        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.SIGNUP} ${name}, ${username}, ${hashPassword}, ${hashConfirmPassword}`)
            res = await db.one(PSQLQuery.SIGNUP, [name, username, hashPassword, hashConfirmPassword]);
            console.log("signup res=", res);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        const userId = parseQueryResultString({strErrorsJSON: res?.res["errors"], strPayloadJSON: res});
        if(!userId) {
            console.error("res.auth is blank or invalid");
            //throw UnknownError();
            throw Error("UnknownError");            
        }

        const session = suuid();
        AuthController.instance().userIdSession.set(userId, session);
        AuthController.instance().sessionUserId.set(session, userId);
        
        return session;
    }

    public async logout(_payload: any, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        console.log(`userId=${userId}`)

        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            res = await db.one(PSQLQuery.LOGOUT, [userId]);
            console.log("logout res=")
            console.dir(res);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        if(userId) {
            const session = AuthController.instance().getUserIdSession(userId);
            AuthController.instance().sessionUserId.delete(userId);
            if(session) {
                AuthController.instance().userIdSession.delete(session);
            }
        }

        const contactIds = parseQueryResultArray<ID_TYPE>({strErrorsJSON: "", strPayloadJSON: res?.res["contactids"]});
        SocketIOServer.instance().sendEventToUserIds(IEvent.CONTACTCHANGE, contactIds, userId);

        return;
    }

    public async profileGet(payload: any, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        //const avatarFile = req.files.avatar;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            res = await db.one(PSQLQuery.PROFILEGET, [userId]);
            console.log("profileGet res=")
            console.dir(res);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }

        const profile = parseQueryResult<IProfile>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["profile"]});
        if(!profile?.name) {
            console.error("res.profile is blank or invalid");
            throw Error("UnknownError");
        }

        return profile;
    }



    public async profileUpdate(payload: IProfileUpdateData, _language: ILanguage, userId: ID_TYPE|undefined, _messageId?: ID_TYPE) {
        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }
        const name = payload?.name;
        const hashPassword = payload?.hashPassword;
        const hashConfirmPassword = payload?.hashConfirmPassword;
        const avatar = payload?.avatar;

        if(!userId) {
            console.error("userId is blank");
            throw UnknownError();
        }

        const usqldata: IProfileUpdateSQLData = {
            name,
            hashpassword: hashPassword,
            hashconfirmpassword: hashConfirmPassword,
            avatar: avatar,
            userid: userId
        };

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }

            console.log(`${PSQLQuery.PROFILEUPDATE}`, usqldata)
            res = await db.one(PSQLQuery.PROFILEUPDATE, [usqldata]);
            console.log("profileUpdate res=")
            console.dir(res);
            const contactIds = parseQueryResultArray<ISession>({strErrorsJSON: res?.res["errors"],
                strPayloadJSON: res?.res["contactids"]}
            ) || [];

            const prevFile = parseQueryResultString({strErrorsJSON: res?.res["errors"],
                strPayloadJSON: res?.res["prevavatar"]}
            );

            if(prevFile) {
                try {
                    fs.unlinkSync(prevFile);
                } catch(err) {
                    console.error(err)
                }
            }

            SocketIOServer.instance().sendEventToUserIds(IEvent.CONTACTCHANGE, contactIds, userId);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        return {};
    }
}
 
