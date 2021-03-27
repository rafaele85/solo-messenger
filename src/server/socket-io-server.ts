import * as socketio from "socket.io";
import { ISession } from "../shared/types/session";
import http from "http";
import { IEvent, IEventPayload, ITransportEvent } from "../shared/types/event";

const getSessionKey = (session: ISession) => {
    return session.toLocaleLowerCase();
}

export class SocketIOServer {
    private static readonly _instance = new SocketIOServer();
    public static instance() {
        return SocketIOServer._instance;
    }

    private sessions = new Map<ISession, socketio.Socket>();
    private io: socketio.Server|undefined;

    private SocketIOServer() {        
    }

    public initialize(httpServer: http.Server) {
        const cors_origin = process.env.CORS_ORIGIN;
        this.io = new socketio.Server(httpServer, { cors: { origin: cors_origin } } );
        this.io.on("connection", (socket: socketio.Socket) => this.onConnection(socket) );
    }

    private onConnection(socket: socketio.Socket) {
        let session: ISession|undefined = undefined;
        const ndx = socket.request?.url?.indexOf("session=");
        if(ndx) {
            session = socket.request?.url?.substring(ndx+8);
            const ndx2 = session?.indexOf("&");
            if(ndx2) {
                session = session?.substring(0, ndx2);
           }
        }
        if(!session) {
           console.error(`SocketIOServer: new client connected - session is empty - skipping`);
           return;
        }
        const sessionKey = getSessionKey(session);
        (socket as any).session = sessionKey;
        this.sessions.set(sessionKey, socket);

        socket.on("disconnect", ()  => this.onDisconnect(socket));

        //if need to handle incoming messages too
        //socket.on("message", (data: ITransportData) => this.onMessage(socket, data));
    }

    public onDisconnect(socket: socketio.Socket) {
        const session = (socket as any).session;
        const sessionKey = getSessionKey(session);
        this.sessions.delete(sessionKey);
    }

    private getSessionSocket(session: ISession) {     
        const sessionKey = getSessionKey(session);
        const socket = this.sessions.get(sessionKey);
        if(!socket) {
           console.error(`Not found socket for session ${session}`)
        }
        return socket;
    }

    public broadcastEvent(eventName: IEvent, payload: IEventPayload) {
        const evt: ITransportEvent = {eventName, payload};
        if(!this.io) {
           console.error(`this.io is not initialized`);
           return;
        }
        this.io.emit("message", evt);
    }

    public sendEventToSession(eventName: IEvent, session: ISession, payload: IEventPayload) {
        const evt: ITransportEvent = {eventName, payload};
        const socket = this.getSessionSocket(session);
        if(socket) {
            socket.send(evt);
        }
    }
}