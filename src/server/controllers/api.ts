import express, {Request, Response, NextFunction} from "express";
import { APIResources } from "../../shared/types/api";
import { ILanguage } from "../../shared/types/language";
import { ID_TYPE } from "../../shared/types/id-type";
import {AuthController} from "./auth";
import multer from "multer";

type IRequestHandlerConfig = {
   fileName: string;
};

export type IRequestHandlerFunc = (payload: any, language: ILanguage, userId: ID_TYPE|undefined, messageId?: ID_TYPE) => Promise<any>;

type IRequestHandler = {
    func: IRequestHandlerFunc;
    config?: IRequestHandlerConfig;
}

export class APIController {
    private static handlers = new Map<APIResources, IRequestHandler>();

    public static registerHandler(resource: APIResources, handlerFunc: IRequestHandlerFunc, config?: IRequestHandlerConfig) {
        const handler: IRequestHandler = {func: handlerFunc, config};
        this.handlers.set(resource, handler);
    }

    public static async handleRequest(handler: IRequestHandler, req: Request, res: Response, _next: NextFunction) {
        console.log(`handleRequest body=`, req.body)
        let session;
        let language;
        let messageId;
        let rest;
        if(handler.config?.fileName && req.file) {
            session = req.body?.session;
            language = req.body?.language;
            messageId = req.body?.messageId;
            rest = req.body || {};
            rest[handler.config.fileName] = req.file.destination+'/'+req.file.filename;
        } else {
            session = req.body?.data?.session;
            language = req.body?.data?.language;
            messageId = req.body?.data?.messageId;
            rest = req.body?.data || {};
        }

        try {
            let userId;
            if(session) {
                userId = AuthController.instance().getSessionUserId(session);
            }
            console.log(`handleRequest session=${session} userId=${userId}`)
            const response = await handler.func(rest, language, userId, messageId);
            res.json(response);
        } catch(err) {
            console.error(`handleRequest error `, err);
            res.status(400).json(err);
        }
    }
  
    public static getRouter() {
        const router = express.Router();


        this.handlers.forEach((handler: IRequestHandler, key: APIResources) => {
            if(handler?.config?.fileName) {
                const upload = multer({dest: "./public/images"});
                console.log(`registerhandler key=${key} handler=`, handler)
                router.post(key, upload.single(handler.config.fileName), async (req: Request, res: Response, next: NextFunction) => {
                    await this.handleRequest(handler, req, res, next);
                });
            } else {
                router.post(key, async (req: Request, res: Response, next: NextFunction) => {
                    await this.handleRequest(handler, req, res, next);
                });
            }
        });
        return router;
    }
}
    
