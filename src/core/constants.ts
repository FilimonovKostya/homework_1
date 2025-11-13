import {videoResolution} from "./types/createVideoType";

export const MAX_LENGTH_TITLE = 40
export const MAX_LENGTH_AUTHOR = 20
export const MIN_AGE_RESTRICTION = 1
export const MAX_AGE_RESTRICTION = 18

export const REQUIRED_FIELDS_ERROR = {
    title: {message: "Title is required", field: "title"},
    author: {message: "Author is required", field: "author"},
    availableResolutions: {message: "Available resolutions is required", field: "availableResolutions"},
    minAgeRestriction: {message: "Min age restriction is required", field: "minAgeRestriction"},
    publicationDate: {message: "Publication date is required", field: "publicationDate"},
    canBeDownloaded: {message: "Can be downloaded is required", field: "canBeDownloaded"},
};

export const AVAILABLE_RESOLUTIONS = [
    videoResolution.P144,
    videoResolution.P2160,
    videoResolution.P1440,
    videoResolution.P1080,
    videoResolution.P720,
    videoResolution.P480,
    videoResolution.P360,
    videoResolution.P240,
]