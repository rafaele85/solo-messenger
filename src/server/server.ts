import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { APIController } from "./controllers/api";
import { AuthController } from "./controllers/auth";


const initializeControllers = () => {
    AuthController.initialize();    
}

const startApp = () => {
    try {
        dotenv.config( { debug: true } );
        let PORT: number = 0;
        if (process.env.SERVER_PORT) {
            PORT = Number.parseInt(process.env.SERVER_PORT || "", 10);
        }
        const HOST = process.env.SERVER_HOST || "";
    
        const app = express();
        app.set("port", PORT);
    
        app.use(morgan("dev"));
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        initializeControllers();
        
        app.use("/api", APIController.getRouter());
    
        console.log(`HOST=${HOST} PORT=${PORT}`)
    
        app.listen(PORT, HOST, () => {
            console.log(`listening ${HOST}:${PORT}`);
        }); 

    } catch(err) {
        console.error(err)
    }
    
}
//

startApp();

