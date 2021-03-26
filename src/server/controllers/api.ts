import express, {Request, Response, NextFunction} from "express";
import { APIResources } from "../../shared/types/api";
import { ISession } from "../../shared/types/session";
import { ILanguage } from "../../shared/types/language";
    
type IRequestHandler = (payload: any, language: ILanguage, session: ISession) => Promise<any>;

export class APIController {
    private static handlers = new Map<APIResources, IRequestHandler>();

    public static registerHandler(resource: APIResources, handler: IRequestHandler) {
        this.handlers.set(resource, handler);
    }

    public static async handleRequest(handler: IRequestHandler, req: Request, res: Response, next: NextFunction) {        
        const {session, language, ...rest} = req.body?.data;        
        console.log(`handleRequest rest=`, rest)
        try {
            const response = await handler(rest, language, session);
            res.json(response);
        } catch(err) {
            console.error(`${APIResources.LOGIN} error `, err);
            res.status(400).json(err);
        }
    }
  
    public static getRouter() {
        const router = express.Router();

        this.handlers.forEach((handler: IRequestHandler, key: APIResources) => {
            router.post(key, async (req: Request, res: Response, next: NextFunction) => {
                await this.handleRequest(handler, req, res, next);
            });
        })
 
        return router;
    }
}
    
