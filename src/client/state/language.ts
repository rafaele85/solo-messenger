import { defaultLanguage, ILanguage } from '../../shared/types/language';
import {GenericState, IGenericState} from './generic';

export type ILanguageState = IGenericState<ILanguage>;

const st = new GenericState<ILanguage>(defaultLanguage(), "language");

export const languageReducer = st.reducer();

export const setLanguage = st.setValue();
