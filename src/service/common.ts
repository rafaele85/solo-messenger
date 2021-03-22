import axios, {
    AxiosResponse,
    AxiosRequestConfig,
} from "axios";
import {IAuth} from "../types/auth";

const AXIOS_TIMEOUT=5000;

export class CommonService {
    public getAPIBaseURL() {
        return process.env.REACT_APP_API_URL;
    }

    public async apiGet<TInputParams, TOutputParams>(url: string, params: TInputParams) {
        const config: AxiosRequestConfig = {
            data: params,
            timeout: AXIOS_TIMEOUT,
        };
        const res:AxiosResponse<TOutputParams> = await axios.get<TOutputParams, AxiosResponse<TOutputParams>>(url, config);
        return res.data;
    }
}
