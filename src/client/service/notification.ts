import {IEvent} from "../../shared/types/event";
import {suuid} from "../../shared/service/uuid";

type IEventPayload = any;
type IEventListener = (payload: IEventPayload) => void;
type IListenerId = string;
type IEventListenerList = Map<IListenerId, IEventListener>;

export class NotificationService {
    private static readonly _instance = new NotificationService();
    public static instance() {
        return NotificationService._instance;
    }
    private constructor() {
             
    }

    private listeners = new Map<string, IEventListenerList>();

    public subscribe(event: IEvent, subtype: string|undefined, listener: IEventListener) {
        let strevent = event.toString();
        if(subtype) {
            strevent = strevent+subtype;
        }
        const eventListeners = this.listeners.get(strevent) || new Map<IListenerId, IEventListener>();
        const listenerId = suuid();
        eventListeners.set(listenerId, listener);
        this.listeners.set(strevent, eventListeners);
        return listenerId;
    }

    public unsubscribe(event: IEvent, subtype: string|undefined, listenerId: IListenerId) {
        let strevent = event.toString();
        if(subtype) {
            strevent = strevent+subtype;
        }
        const eventListeners = this.listeners.get(strevent) || new Map<IListenerId, IEventListener>();
        eventListeners.delete(listenerId);
        if(eventListeners.size===0) {
            this.listeners.delete(strevent);
        }
    }

    public notify(event: IEvent, subtype: string|undefined, payload: IEventPayload) {
        let strevent = event.toString();
        if(subtype) {
            strevent = strevent+subtype;
        }
        const eventListeners = this.listeners.get(strevent) || new Map<IListenerId, IEventListener>();
        console.log(`strevent=${strevent} listeners = ${eventListeners.size}`)
        if(!eventListeners || eventListeners.size===0) {
            console.warn(`no listeners found for event ${strevent}`);
            console.dir(this.listeners)
            return;
        }
        eventListeners.forEach((listener: IEventListener) => {
            try {
                listener(payload);
            } catch(err) {
                console.error(err);
            }
        })
    }


}
