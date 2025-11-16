import {DB_VIDEOS} from "../db";
import {
    CreatedVideoResponseType,
    CreateVideoType,
    ValidationHandlerCreateVideoResponseType, ValidationHandlerCreateVideoType
} from "../core/types/createVideoType";
import {validationHandlerOnCreateVideo} from "../utils";
import {PutVideoType} from "../core/types/PutVideoType";


export const videoRepository = {
    findVideoById: (videoID: number) => DB_VIDEOS.find(({id}) => id === videoID),
    createVideo: (body: CreateVideoType): CreatedVideoResponseType | ValidationHandlerCreateVideoResponseType => {

        const error: ValidationHandlerCreateVideoType[] | null = validationHandlerOnCreateVideo(body)
        if (error && error.length > 0) {
            return {errorsMessages: error}
        }

        const createdAt = new Date().toISOString()
        const publicationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        const {title, author, availableResolutions} = body
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
        return createdNewVideo

    },
    updateVideo: (videoID: number, body: PutVideoType) => {
        const updatedVideo = DB_VIDEOS.map((video) => video.id === +videoID ?
            {...video, ...body}
            : video
        )
        DB_VIDEOS.splice(0, DB_VIDEOS.length, ...updatedVideo)
    },
    deleteVideo: (videoID: number) => {

        const isExistVideoByID = DB_VIDEOS.find(({id}) => id === +videoID)

        if (!isExistVideoByID) {
            return true
        }

        DB_VIDEOS.splice(DB_VIDEOS.findIndex(({id}) => id === videoID), 1)

    }
};