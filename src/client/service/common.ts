import axios, {
    AxiosResponse,
    AxiosRequestConfig,
} from "axios";
import { UnknownError } from "../../shared/types/error";
import { ISession } from "../../shared/types/session";
import { store } from "../state/store";

const AXIOS_TIMEOUT=5000;

export class CommonService {
    public getAPIBaseURL() {
        return process.env.REACT_APP_API_URL;
    }

    protected getSessionKey() {        
        const state = store.getState()
        console.log("getSessionKey state=", state);
        const sessionKey= state?.auth?.value?.sessionkey;
        if(!sessionKey) {
            console.error("getSessionKey sessionKey is blank")
            throw UnknownError();
        }
        return sessionKey;
    }
 
    
    public async apiPost<TInputParams, TOutputParams>(url: string, params: TInputParams, session?: ISession) {
        const language = store.getState().language.value;

        const config: AxiosRequestConfig = {
            data: {...params, session, language},
            timeout: AXIOS_TIMEOUT,
        };
        
        try {
            const res:AxiosResponse<TOutputParams> = await axios.post<TOutputParams, AxiosResponse<TOutputParams>>(url, config);            
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
