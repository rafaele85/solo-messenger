import pgPromise, { IDatabase } from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import bluebird from "bluebird";
import dotenv from 'dotenv';

export interface IQueryResultJSON {
    strPayloadJSON?: string;
    strErrorsJSON?: string;
}

export class PostgreSQLConnection {
    private static _instance = new PostgreSQLConnection();
    private readonly db: IDatabase<pg.IClient>|undefined = undefined;

    public static db() {        
        return PostgreSQLConnection._instance.db;
    }

    private constructor() {
        dotenv.config( { debug: true } );
        const DB_URL = process.env.DB_URL || "";
        try {
            const pgp = pgPromise({promiseLib: bluebird});
            console.log(`connecting to ${DB_URL}`)
            this.db = pgp(DB_URL);    
        } catch(err) {
            console.error(err);
        }
    }    
}
