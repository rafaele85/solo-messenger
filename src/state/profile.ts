import {GenericState, IGenericState} from './generic';
import {IProfile} from "../types/profile";

export type IProfileState = IGenericState<IProfile|undefined>;

const st = new GenericState<IProfile|undefined>(undefined, "profile");

export const profileReducer = st.reducer();

export const setProfile = st.setValue();
