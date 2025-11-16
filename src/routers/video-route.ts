import {Request, Response, Router} from "express";
import {GetVideoById, GetVideoType} from "../core/types/GetVideoType";
import {DB_VIDEOS} from "../db";
import {
    CreatedVideoResponseType,
    CreateVideoType,
    ValidationHandlerCreateVideoResponseType
} from "../core/types/createVideoType";
import {PutVideoType} from "../core/types/PutVideoType";
import {HTTP_STATUS_CODES} from "../core/httpStatus";
import {validationHandlerOnCreateVideo, validationHandlerOnUpdateVideo} from "../utils";

const {OK, NO_CONTENT, CREATED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUS_CODES


export const videoRouter = Router({})

// GET VIDEOS
videoRouter.get('/', (_, res: Response<GetVideoType[]>) => {
    res.status(OK).json(DB_VIDEOS)
});

//GET VIDEO BY ID
videoRouter.get(`/:videoID`, (req: Request<GetVideoById>, res: Response<GetVideoType>) => {
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
videoRouter.post('/', (req: Request<{}, {}, CreateVideoType>, res: Response<CreatedVideoResponseType | ValidationHandlerCreateVideoResponseType>) => {
    const {body} = req

    const error = validationHandlerOnCreateVideo(body)

    if (error && error.length > 0) {
        res.status(BAD_REQUEST).json({errorsMessages: error})
        return
    }

    const {title, author, availableResolutions} = body;

    const createdAt = new Date().toISOString()
    const publicationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const createdNewVideo: CreatedVideoResponseType = {
        id: DB_VIDEOS.length + 1,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions,
    }
    DB_VIDEOS.push(createdNewVideo)

    res.status(CREATED).json(createdNewVideo)
})

//PUT VIDEO
videoRouter.put(`/:videoID`, (req: Request<GetVideoById, {}, PutVideoType>, res: Response<ValidationHandlerCreateVideoResponseType | null>) => {
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


    if (error && error.length > 0) {
        res.status(BAD_REQUEST).json({errorsMessages: error})
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
videoRouter.delete(`/:videoID`, (req: Request<GetVideoById>, res: Response) => {
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
