import express, {Express, Request, Response} from "express";
import {
    CreatedVideoResponseType,
    CreateVideoType, ValidationHandlerCreateVideoResponseType,
    ValidationHandlerCreateVideoType,
} from "./core/types/createVideoType";
import {DB_VIDEOS} from "./db";
import {HTTP_STATUS_CODES} from "./core/httpStatus";
import {
    AVAILABLE_RESOLUTIONS, MAX_AGE_RESTRICTION,
    MAX_LENGTH_AUTHOR,
    MAX_LENGTH_TITLE,
    MIN_AGE_RESTRICTION,
    REQUIRED_FIELDS_ERROR
} from "./core/constants";
import {GetVideoById, GetVideoType} from "./core/types/GetVideoType";
import {videosRoute} from "./videos/routingConstants";
import {PutVideoType} from "./core/types/PutVideoType";

const {OK, NO_CONTENT, CREATED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUS_CODES


const validationHandlerOnCreateVideo = (data: CreateVideoType):
    ValidationHandlerCreateVideoType | null => {
    const {title, author, availableResolutions} = data || {}

    if (!title || typeof title !== "string"
        || title.length === 0
        || title.length > MAX_LENGTH_TITLE) {
        return REQUIRED_FIELDS_ERROR.title
    }

    if (!author
        || typeof author !== "string"
        || !author.length
        || author.length > MAX_LENGTH_AUTHOR
    ) {
        return REQUIRED_FIELDS_ERROR.author
    }

    if (availableResolutions.length === 0
        || !availableResolutions
        || availableResolutions.some((resolution) => !AVAILABLE_RESOLUTIONS.includes(resolution))
        || !Array.isArray(availableResolutions)) {
        return REQUIRED_FIELDS_ERROR.availableResolutions
    }

    return null
}

const validationHandlerOnUpdateVideo = (data: PutVideoType):
    ValidationHandlerCreateVideoType | null => {
    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = data || {}


    if (!title || typeof title !== "string"
        || title.length === 0
        || title.length > MAX_LENGTH_TITLE) {
        return REQUIRED_FIELDS_ERROR.title
    }

    if (!author
        || typeof author !== "string"
        || !author.length
        || author.length > MAX_LENGTH_AUTHOR
    ) {
        return REQUIRED_FIELDS_ERROR.author
    }


    if (availableResolutions.length === 0
        || !availableResolutions
        || availableResolutions.some((resolution) => !AVAILABLE_RESOLUTIONS.includes(resolution))
        || !Array.isArray(availableResolutions)
    ) {
        return REQUIRED_FIELDS_ERROR.availableResolutions
    }
    if (!Object.keys(data).includes('canBeDownloaded') && typeof canBeDownloaded !== 'boolean' || canBeDownloaded === null) {
        return REQUIRED_FIELDS_ERROR.canBeDownloaded
    }

    if (minAgeRestriction && (minAgeRestriction > MIN_AGE_RESTRICTION && minAgeRestriction > MAX_AGE_RESTRICTION)) {
        return REQUIRED_FIELDS_ERROR.minAgeRestriction
    }


    if (!publicationDate) {
        return REQUIRED_FIELDS_ERROR.publicationDate
    }


    return null
}


export const setupApp = (app: Express) => {
    app.use(express.json());

    // GET VIDEOS
    app.get(videosRoute, (_, res: Response<GetVideoType[]>) => {
        res.status(OK).json(DB_VIDEOS)
    });

    //GET VIDEO BY ID
    app.get(`${videosRoute}/:videoID`, (req: Request<GetVideoById>, res: Response<GetVideoType>) => {
        const {videoID} = req.params

        if (!Number.isInteger(+videoID)) {
            res.sendStatus(NOT_FOUND)
            return
        }

        const isExistVideoByID = DB_VIDEOS.find(({id}) => id === +videoID)

        if (!isExistVideoByID) {
            res.sendStatus(NOT_FOUND)
            return
        }

        const foundedVideo = DB_VIDEOS.find(({id}) => id === +req.params.videoID)
        res.status(OK).json(foundedVideo)
    });

    //POST VIDEOS
    app.post(videosRoute, (req: Request<{}, {}, CreateVideoType>, res: Response<CreatedVideoResponseType | ValidationHandlerCreateVideoResponseType>) => {
        const {body} = req

        const error = validationHandlerOnCreateVideo(body)

        if (error && error.message) {
            res.status(BAD_REQUEST).json({errorsMessages: [error]})
            return
        }

        const {title, author, availableResolutions} = body;

        const createdNewVideo: CreatedVideoResponseType = {
            id: DB_VIDEOS.length + 1,
            title,
            author,
            availableResolutions,
            canBeDownloaded: false,
            createdAt: '2025-11-09T20:52:26.177Z',
            minAgeRestriction: null,
            publicationDate: Date.now().toString(),
        }
        DB_VIDEOS.push(createdNewVideo)

        res.status(CREATED).json(createdNewVideo)
    })

    //PUT VIDEO
    app.put(`${videosRoute}/:videoID`, (req: Request<GetVideoById, {}, PutVideoType>, res: Response<ValidationHandlerCreateVideoResponseType | null>) => {
        const {videoID} = req.params


        if (!Number.isInteger(+videoID)) {
            res.sendStatus(NOT_FOUND)
            return
        }


        const idDataBase = DB_VIDEOS.find(({id}) => id === +videoID)?.id

        if (!Number.isInteger(idDataBase)) {
            res.sendStatus(NOT_FOUND)
            return
        }


        const error = validationHandlerOnUpdateVideo(req.body)


        if (error?.message) {
            res.status(BAD_REQUEST).json({errorsMessages: [error]})
            return
        }

        const updatedVideo = DB_VIDEOS.map((video) => video.id === +videoID ?
            {...video, ...req.body}
            : video
        )
        DB_VIDEOS.splice(0, DB_VIDEOS.length, ...updatedVideo)

        res.sendStatus(NO_CONTENT)
    })

    //DELETE VIDEO
    app.delete(`${videosRoute}/:videoID`, (req: Request<GetVideoById>, res: Response) => {
        const {videoID} = req.params

        if (!Number.isInteger(+videoID)) {
            res.sendStatus(NOT_FOUND)
            return
        }

        const isExistVideoByID = DB_VIDEOS.find(({id}) => id === +videoID)

        if (!isExistVideoByID) {
            res.sendStatus(NOT_FOUND)
            return
        }

        DB_VIDEOS.splice(DB_VIDEOS.findIndex(({id}) => id === +req.params.videoID), 1)
        res.sendStatus(NO_CONTENT)

    })

    //DELETE ALL BASE
    app.delete("/all-data", (req: Request, res: Response) => {
        DB_VIDEOS.splice(0, DB_VIDEOS.length)
        res.sendStatus(NO_CONTENT)
    })

    return app;
};