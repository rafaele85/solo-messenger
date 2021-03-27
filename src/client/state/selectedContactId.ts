import { ID_TYPE } from '../../shared/types/id-type';
import {GenericState, IGenericState} from './generic';

export type ISelectedContactIdState = IGenericState<ID_TYPE|undefined>;

const st = new GenericState<ID_TYPE|undefined>(undefined, "selected-contact-id");

export const selectedContactIdReducer = st.reducer();

export const setSelectedContactId = st.setValue();
