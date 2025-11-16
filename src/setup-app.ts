import express, {Express, Request, Response} from "express";
import {DB_VIDEOS} from "./db";
import {HTTP_STATUS_CODES} from "./core/httpStatus";

import {videosUrl} from "./videos/routingConstants";
import {videoRouter} from "./routers/video-route";

const {NO_CONTENT} = HTTP_STATUS_CODES


export const setupApp = (app: Express) => {
    app.use(express.json());
    app.use(videosUrl, videoRouter)

    //DELETE ALL BASE
    app.delete("/testing/all-data", (req: Request, res: Response) => {
        DB_VIDEOS.splice(0, DB_VIDEOS.length)
        res.sendStatus(NO_CONTENT)
    })

    return app;
};