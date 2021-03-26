import {GenericState, IGenericState} from './generic';
import {IAuth} from "../../shared/types/auth";

export type IAuthState = IGenericState<IAuth|undefined>;

const st = new GenericState<IAuth|undefined>(undefined, "auth");

export const authReducer = st.reducer();

export const setAuth = st.setValue();
