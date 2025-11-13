export enum videoResolution {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160",
}

export type CreateVideoType = {
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
}

export type CreatedVideoResponseType = {
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

export type ValidationHandlerCreateVideoType = {
    message: string,
    field: string,
}

export type ValidationHandlerCreateVideoResponseType = {
    errorsMessages: ValidationHandlerCreateVideoType[] | null
}