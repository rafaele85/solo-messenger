import { IMessage } from '../../shared/types/message';
import {GenericState, IGenericState} from './generic';

export type IMessagesState = IGenericState<IMessage[]>;

const st = new GenericState<IMessage[]>([], "messages");

export const messagesReducer = st.reducer();

export const setMessages = st.setValue();
