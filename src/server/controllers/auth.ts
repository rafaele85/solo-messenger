import { PostgreSQLConnection } from './../db/db';
import { UnknownError } from "../../shared/types/error";
import { parseQueryResult, parseQueryResultString } from './../util/query-parse';
import { ID_TYPE } from "../../shared/types/id-type";
import { IAuth, ISignInData, ISignUpData } from "../../shared/types/auth";
import { APIResources } from "../../shared/types/api";
import { APIController } from './api';
import { ILanguage } from "../../shared/types/language";
import { ISession } from "../../shared/types/session";

enum PSQLQuery {
    LOGIN = "select * from UserLoginJSON($1, $2, $3) res",
    LOGOUT = "select * from UserLogoutJSON($1) res",
    SIGNUP = "select * from UserSignupJSON($1, $2, $3, $4, $5) res",
}

export class AuthController {
    private static _instance = new AuthController();

    public static instance() {
        return AuthController._instance;
    }

    public static initialize() {
        APIController.registerHandler(APIResources.LOGIN, AuthController.instance().login);
        APIController.registerHandler(APIResources.LOGOUT, AuthController.instance().logout);
        APIController.registerHandler(APIResources.SIGNUP, AuthController.instance().signup);
    }
  
    public async login(payload: ISignInData, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        const username = payload?.username;
        const hashPassword = payload?.hashPassword;

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            console.log(`${PSQLQuery.LOGIN} ${username} ${hashPassword} ${session}`)
            res = await db.one(PSQLQuery.LOGIN, [username, hashPassword, session]);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        
        const auth = parseQueryResult<IAuth>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["auth"]});
        if(!auth || !auth.name) {
            console.error("res.auth is blank or invalid");
            throw UnknownError();
        }
        return auth;
    }

    public async signup(payload: ISignUpData, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
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
            console.log(`${PSQLQuery.SIGNUP} ${name}, ${username}, ${hashPassword}, ${hashConfirmPassword}, ${session}`)
            res = await db.one(PSQLQuery.SIGNUP, [name, username, hashPassword, hashConfirmPassword, session]);
            console.log("signup res=", res);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }
        const auth = parseQueryResult<IAuth>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["auth"]});
        if(!auth || !auth.name) {
            console.error("res.auth is blank or invalid");
            //throw UnknownError();
            throw Error("UnknownError");
        }
        return auth;
    }

    public async logout(payload: any, language: ILanguage, session: ISession, messageId?: ID_TYPE) {
        console.log(`messageId=${messageId}, session=${session} `)

        let res;
        try {
            const db = PostgreSQLConnection.db();
            if(!db) {
                throw UnknownError();
            }
            res = await db.one(PSQLQuery.LOGOUT, [session]);
            console.log("logout res=")
            console.dir(res);
        } catch(err) {
            console.error(err);
            throw UnknownError();
        }

        session = parseQueryResultString<ID_TYPE>({strErrorsJSON: res?.res["errors"], strPayloadJSON: res?.res["session"]});
        return session;
    }
 
}
 