import pgPromise, { IDatabase } from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import bluebird from "bluebird";
import dotenv from 'dotenv';
import fs from "fs";

export interface IQueryResultJSON {
    strPayloadJSON?: string;
    strErrorsJSON?: string;
}

export class PostgreSQLConnection {
    private readonly db: IDatabase<pg.IClient>|undefined = undefined;

    public constructor() {
        dotenv.config( );
        const DB_URL = process.env.DB_URL || "";
        try {
            const pgp = pgPromise({promiseLib: bluebird});
            //console.log(`connecting to ${DB_URL}`)
            this.db = pgp(DB_URL);    
        } catch(err) {
            console.error(err);
        }
    }    

    public async execute(file: string) {
        if(!file) {
            console.error("file argument is missing");
            return;
        }
        try {
            const query = fs.readFileSync(file).toString();
            await this.db?.none(query, []);    
            console.log(`${file} - SUCCESS`)
        } catch(err) {
            console.error(err);
        }
    }
}

const db = new PostgreSQLConnection();
db.execute(process.argv[2]);



