import {videoResolution} from "./createVideoType";

export type GetVideoType = {
    id: number,
    title: string,
    author: string,
    availableResolutions: Array<
        videoResolution.P144 |
        videoResolution.P2160 |
        videoResolution.P1440 |
        videoResolution.P1080 |
        videoResolution.P720 |
        videoResolution.P480 |
        videoResolution.P360 |
        videoResolution.P240
    >,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
}

export type GetVideoById = { videoID: string }