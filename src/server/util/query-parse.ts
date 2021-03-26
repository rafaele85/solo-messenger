import { IErrors, UnknownError } from "../../shared/types/error";
import { IQueryResultJSON } from './../db/db';

export const isValidNonEmptyJSONObject = (str: string) => {
    console.log(`isValidNonEmptyJSONObject str=(${str})`)
    if(!str) {
        return false;
    }
    if(str.charAt(0)!=="{") {
        return false;
    }
    if(str.charAt(str.length-1)!=="}") {
        return false;
    }
    return str.indexOf(":")>=0;
}

export function tryParseJSON<T>(str: string) {
    if(typeof str === "object") {
        return str as T;
    }
    if(!isValidNonEmptyJSONObject(str)) {
        return undefined;
    }
    try {
        return JSON.parse(str) as T;
    } catch(err) {
        console.error(`str=${str}`, err);
    }
    return undefined;
}


export const isValidNonEmptyJSONObjectArray = (str: string) => {
    if(!str) {
        return false;
    }
    if(str.charAt(0)!=="[") {
        return false;
    }
    if(str.charAt(str.length-1)!=="]") {
        return false;
    }
    return isValidNonEmptyJSONObject(str.substring(1, str.length-1));
};
 



export function tryParseJSONArray<TArrayItem>(str: string) {
    if(!isValidNonEmptyJSONObjectArray(str)) {
        return [] as TArrayItem[];
    }
    let list = [];
    try {
        list = JSON.parse(str) as TArrayItem[];
        return list;
    } catch(err) {
        console.error(`str=${str}`, err);
    }
    return [] as TArrayItem[];
}



export function parseQueryResult<T>(result: IQueryResultJSON) {    
    //const errors = result.strErrorsJSON;
    //const payload = result.strPayloadJSON;
    console.log("result=")
    console.dir(result)
    const errors = tryParseJSON<IErrors>( result.strErrorsJSON || "");
    const payload = tryParseJSON<T>( result.strPayloadJSON || "");
    
    if(result && !(errors && Object.getOwnPropertyNames(errors)) ) {
        return payload;
    }
    if(!result) {
        console.error("res is blank")
    } else if(errors && Object.getOwnPropertyNames(errors)) {
        console.error("errors = ", errors);
        throw {errors};
    }
    throw UnknownError();
}
 
export function parseQueryResultString<T>(result: IQueryResultJSON) {
    //const errors = result.strErrorsJSON; 
    const errors = tryParseJSON<IErrors>( result.strErrorsJSON || "");
    const payload = result.strPayloadJSON;
    if(result && payload && !(errors && Object.getOwnPropertyNames(errors)) ) {
        return payload;
    }
    if(!result) {
        console.error("res is blank")
    } else if(!payload) {
        console.error("res payload is blank")
    } else if(errors && Object.getOwnPropertyNames(errors)) {
        console.error("errors = ", errors);
        throw errors;
    }
    throw UnknownError();
}


export function parseQueryResultVoid(result: IQueryResultJSON) {
    //const errors = result.strErrorsJSON; 
    const errors = tryParseJSON<IErrors>( result.strErrorsJSON || "");
    if(errors && Object.getOwnPropertyNames(errors)) {
        throw errors;
    }
}
