import {Request, Response, Router} from "express";
import {GetVideoById, GetVideoType} from "../core/types/GetVideoType";
import {DB_VIDEOS} from "../db";
import {
    CreatedVideoResponseType,
    CreateVideoType,
    ValidationHandlerCreateVideoResponseType, ValidationHandlerCreateVideoType
} from "../core/types/createVideoType";
import {PutVideoType} from "../core/types/PutVideoType";
import {HTTP_STATUS_CODES} from "../core/httpStatus";
import {validationHandlerOnCreateVideo, validationHandlerOnUpdateVideo} from "../utils";
import {videoRepository} from "../repositories/videoRepository";

const {OK, NO_CONTENT, CREATED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUS_CODES


export const videoRouter = Router({})

// GET VIDEOS
videoRouter.get('/', (_, res: Response<GetVideoType[]>) => {
    res.status(OK).json(DB_VIDEOS)
});

//GET VIDEO BY ID
videoRouter.get(`/:videoID`, (req: Request<GetVideoById>, res: Response<GetVideoType>) => {
    const foundedVideo = videoRepository.findVideoById(+req.params.videoID)

    if (!foundedVideo) {
        res.sendStatus(NOT_FOUND)
    } else {
        res.status(OK).json(foundedVideo)
    }
});

//POST VIDEOS
videoRouter.post('/', (req: Request<{}, {}, CreateVideoType>, res: Response<CreatedVideoResponseType | ValidationHandlerCreateVideoResponseType>) => {
    const error: ValidationHandlerCreateVideoType[] | null = validationHandlerOnCreateVideo(req.body)

    if (error) {
        res.status(BAD_REQUEST).json({errorsMessages: error})
        return
    }

    res.status(CREATED).json(videoRepository.createVideo(req.body))
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

    videoRepository.updateVideo(+videoID, req.body)
    res.sendStatus(NO_CONTENT)
})

//DELETE VIDEO
videoRouter.delete(`/:videoID`, (req: Request<GetVideoById>, res: Response) => {
    const {videoID} = req.params

    const isExistVideoByID = videoRepository.deleteVideo(+videoID)

    if (!Number.isInteger(+videoID)) {
        res.sendStatus(NOT_FOUND)
        return
    }

    if (isExistVideoByID) {
        res.sendStatus(NOT_FOUND)
        return
    }

    res.sendStatus(NO_CONTENT)

})
