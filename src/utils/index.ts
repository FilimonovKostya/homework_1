import {CreateVideoType, ValidationHandlerCreateVideoType} from "../core/types/createVideoType";
import {
    AVAILABLE_RESOLUTIONS, MAX_AGE_RESTRICTION,
    MAX_LENGTH_AUTHOR,
    MAX_LENGTH_TITLE,
    MIN_AGE_RESTRICTION,
    REQUIRED_FIELDS_ERROR
} from "../core/constants";
import {PutVideoType} from "../core/types/PutVideoType";

export const validationHandlerOnCreateVideo = (data: CreateVideoType):
    ValidationHandlerCreateVideoType[] | null => {
    const {title, author, availableResolutions} = data || {}

    const errorMessages = []

    if (!title || typeof title !== "string"
        || title.length === 0
        || title.length > MAX_LENGTH_TITLE) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.title)

    }
    if (!author
        || typeof author !== "string"
        || !author.length
        || author.length > MAX_LENGTH_AUTHOR
    ) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.author)
    }

    if (availableResolutions.length === 0
        || !availableResolutions
        || availableResolutions.some((resolution) => !AVAILABLE_RESOLUTIONS.includes(resolution))
        || !Array.isArray(availableResolutions)) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.availableResolutions)
    }

    return errorMessages.length > 0 ? errorMessages : null
}

export const validationHandlerOnUpdateVideo = (data: PutVideoType):
    ValidationHandlerCreateVideoType[] | null => {
    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = data || {}
    const errorMessages = []


    if (!title || typeof title !== "string"
        || title.length === 0
        || title.length > MAX_LENGTH_TITLE) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.title)
    }

    if (!author
        || typeof author !== "string"
        || !author.length
        || author.length > MAX_LENGTH_AUTHOR
    ) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.author)
    }


    if (availableResolutions.length === 0
        || !availableResolutions
        || availableResolutions.some((resolution) => !AVAILABLE_RESOLUTIONS.includes(resolution))
        || !Array.isArray(availableResolutions)
    ) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.availableResolutions)
    }
    if (!Object.keys(data).includes('canBeDownloaded') && typeof canBeDownloaded !== 'boolean' || typeof canBeDownloaded === 'string' || canBeDownloaded === null) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.canBeDownloaded)
    }

    if (minAgeRestriction && (minAgeRestriction > MIN_AGE_RESTRICTION && minAgeRestriction > MAX_AGE_RESTRICTION)) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.minAgeRestriction)
    }


    if (!publicationDate || publicationDate.length === 0 || typeof publicationDate !== 'string' || !Date.parse(publicationDate)) {
        errorMessages.push(REQUIRED_FIELDS_ERROR.publicationDate)
    }


    return errorMessages.length > 0 ? errorMessages : null
}
