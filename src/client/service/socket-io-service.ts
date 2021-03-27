
import socketio from "socket.io-client";
import { ITransportEvent } from "../../shared/types/event";
import { ISession } from "../../shared/types/session";
import { NotificationService } from "./notification";

export class SocketIOService {
   private static readonly _instance = new SocketIOService();

   public static instance() { 
     return SocketIOService._instance;
   }

   private socket: SocketIOClient.Socket|undefined=undefined;

   private SocketIOServer() {
   }

   public initialize(session: ISession) {
      if(this.socket) {
          this.socket = undefined;
      }
      if(!session) {
          console.error("session is not found - unable to initialize socketio")
          return;  
      }
      const url = process.env.REACT_APP_API_URL;
      if(!url) {
          console.error("REACT_APP_API_URL is not defined")
          return;  
      }
      const reconnectAttempts = Number.parseInt(process.env.REACT_APP_SOCKETIO_RECONNECT_ATTEMPTS||"5") || 5;
      
      const opts: SocketIOClient.ConnectOpts = {
          reconnection: !!reconnectAttempts,
          reconnectionAttempts: reconnectAttempts,
          query: `session=${session}`
      }
      this.socket = socketio(url, opts);
      this.socket.on('disconnect', () => this.onDisconnect());
      this.socket.on('message', (params: any) => this.onMessage(params))
   }

   protected onDisconnect() {
      this.socket=undefined;
   }

   protected onMessage(params: ITransportEvent) {
      if(!params.eventName) { 
         return;
      }
      NotificationService.instance().notify(params.eventName, undefined, params.payload);
   }
}
