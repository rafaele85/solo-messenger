import axios, {
    AxiosResponse,
    AxiosRequestConfig,
} from "axios";
import { IRequestParams } from "../../shared/types/api";
import { UnknownError } from "../../shared/types/error";
import { ISession } from "../../shared/types/session";
import { store } from "../state/store";

const AXIOS_TIMEOUT=5000;

export class CommonService {
    public getAPIBaseURL() {
        const url = process.env.REACT_APP_API_URL;
        if(!url) {
            throw UnknownError();
        }
        return url;
    }

    protected getSessionKey() {        
        const sessionKey=localStorage.getItem   ("session");
        if(!sessionKey) {
            console.error("getSessionKey sessionKey is blank")
            throw UnknownError();
        }
        return sessionKey;
    }


/*
 const payload = JSON.stringify(jsonData);
    const bufferObject = Buffer.from(payload, 'utf-8');
    const file = new FormData();

    file.append('upload_file', bufferObject, "b.json");

    const response = await axios.post(
        lovelyURL,
        file,
        headers: file.getHeaders()
    ).toPromise();

 */

    public async apiPost<TInputParams, TOutputParams>(url: string, params: TInputParams, session?: ISession) {
        const language = store.getState().language.value;

        const config: AxiosRequestConfig = {timeout: AXIOS_TIMEOUT};


        const data: IRequestParams<TInputParams> = {...params, session, language};

        config.data = data;
        console.log(`apiPost ${url}`, params, config)
        
        try {
            console.log(`CommonService post url=${url} config=`, config)
            const res: AxiosResponse<TOutputParams> = await axios.post<TOutputParams, AxiosResponse<TOutputParams>>(
                url, config
            );
            console.log(`CommonService res=`, res)
            return res.data;
        } catch(err) {
            console.error("Error:");
            console.dir(err)
            if(err.response?.data?.errors) {                
                throw err.response?.data?.errors;
            } else {
                throw UnknownError();
            }            
        }                
    }


    public async apiPostMultipart<TInputParams, TOutputParams>(url: string, params: TInputParams, session?: ISession) {
        const language = store.getState().language.value;

        const config: AxiosRequestConfig = {timeout: AXIOS_TIMEOUT, headers: { 'Content-Type': 'multipart/form-data' }};

        const data = new FormData();
        data.append("session", session||"");
        data.append("language", language||"");
        for(let kv of Object.entries(params)) {
            data.append(kv[0], kv[1]||"");
        }

        try {
            console.log(`CommonService post url=${url} session=`, session)
            const res: AxiosResponse<TOutputParams> = await axios.post<TOutputParams, AxiosResponse<TOutputParams>>(
                url, data, config
            );
            console.log(`CommonService res=`, res)
            return res.data;
        } catch(err) {
            console.error("Error:");
            console.dir(err)
            if(err.response?.data?.errors) {
                throw err.response?.data?.errors;
            } else {
                throw UnknownError();
            }
        }
    }
}
