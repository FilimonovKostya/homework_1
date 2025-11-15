import express from "express";
import {setupApp} from "../src/setup-app";
import request from 'supertest';
import {DB_VIDEOS} from "../src/db";
import {HTTP_STATUS_CODES} from "../src/core/httpStatus";
import {REQUIRED_FIELDS_ERROR} from "../src/core/constants";
import {CreateVideoType, videoResolution} from "../src/core/types/createVideoType";
import {PutVideoType} from "../src/core/types/PutVideoType";
import {videosRoute} from "../src/videos/routingConstants";

const {OK, CREATED, NOT_FOUND, NO_CONTENT, BAD_REQUEST} = HTTP_STATUS_CODES

describe('Videos CRUD operations', () => {
    const app = setupApp(express())

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(NO_CONTENT)
    })

    const video: CreateVideoType = {
        title: 'New video 2',
        author: 'Kostya',
        availableResolutions: [videoResolution.P144]
    }

    const updateVideoBody: PutVideoType = {
        title: 'UPDATED VIDEO',
        availableResolutions: [videoResolution.P720],
        author: 'Yana',
        canBeDownloaded: false,
        minAgeRestriction: 18,
        publicationDate: '2025-11-09T20:52:26.177Z'
    }


    it('should return videos', async () => {
        await request(app)
            .get(videosRoute)
            .expect(OK, [])
    });

    it('should create a new video first', async () => {
        let createdVideo1

        const video: CreateVideoType = {
            title: 'New video 111111',
            author: 'Filimonov',
            availableResolutions: [videoResolution.P144]
        }

        const createdResponse = await request(app)
            .post(videosRoute)
            .send(video)
            .expect(CREATED)

        createdVideo1 = createdResponse.body
        expect(createdVideo1.body).toEqual(createdVideo1.body)

        await request(app)
            .get(videosRoute)
            .expect(OK, [createdVideo1])

    });


    it('should create the second video', async () => {
        let createdVideo2
        let response

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'New video 3'})
            .expect(CREATED)

        const createdResponse = await request(app)
            .post(videosRoute)
            .send(video)
            .expect(CREATED)


        createdVideo2 = createdResponse.body
        expect(createdVideo2.body).toEqual(createdVideo2.body)

        response = await request(app)
            .get(videosRoute)
            .expect(OK, DB_VIDEOS)

        expect(response.body).toHaveLength(2)
        expect(response.body[1]).toEqual(createdVideo2)
        expect(response.body[1].title === 'New video 2').toBeTruthy()
    });

    it('should not create the video', async () => {
        const requiredBody: CreateVideoType = {
            title: 'New video 1',
            author: 'Filimonov',
            availableResolutions: [videoResolution.P144]
        }

        // Validations for Title
        await request(app)
            .post(videosRoute)
            .send({
                ...requiredBody,
                title: null
            })
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.title]})
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, title: ''})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.title]})
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, title: 'Long String'.repeat(4)})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.title]})
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, title: -100})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.title]})

        // Validations for Author
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, author: -100, title: null})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.title, REQUIRED_FIELDS_ERROR.author]})
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, author: "New author".repeat(4)})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.author]})
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, author: ''})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.author]})

        // Validation for Available resolutions
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, availableResolutions: []})
            .expect(BAD_REQUEST, {
                errorsMessages: [REQUIRED_FIELDS_ERROR.availableResolutions]
            })
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, availableResolutions: ['not_valid']})
            .expect(BAD_REQUEST, {
                errorsMessages: [REQUIRED_FIELDS_ERROR.availableResolutions]
            })
        await request(app)
            .post(videosRoute)
            .send({...requiredBody, availableResolutions: [1]})
            .expect(BAD_REQUEST, {
                errorsMessages: [REQUIRED_FIELDS_ERROR.availableResolutions]
            })
    })
    ;

    it('should find video by ID', async () => {
        let response

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 1'})
            .expect(CREATED)

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 2'})
            .expect(CREATED)

        response = await request(app)
            .get(`${videosRoute}/2`)
            .expect(OK, DB_VIDEOS[1])

        expect(response.body.id).toBe(2)
        expect(response.body).toEqual(DB_VIDEOS[1])

    });

    it('should not find video by ID', async () => {
        await request(app)
            .get(`${videosRoute}/-100`)
            .expect(NOT_FOUND)
    });

    it('should update existing video', async () => {
        let createdVideo
        let updateVideo

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 3'})
            .expect(CREATED)
        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 4'})
            .expect(CREATED)

        createdVideo = await request(app)
            .post(videosRoute)
            .send(video)
            .expect(CREATED)
        expect(createdVideo.body.title).toBe(video.title)

        await request(app)
            .put(`${videosRoute}/3`)
            .send({...updateVideoBody})
            .expect(NO_CONTENT)

        updateVideo = await request(app)
            .get(videosRoute)
            .expect(OK)
        expect(updateVideo.body[2].title).toBe('UPDATED VIDEO')
        expect(updateVideo.body[2].id).toBe(3)
        expect(updateVideo.body.length).toBe(3)

    });

    it('should not update the video', async () => {
        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 4'})
            .expect(CREATED)

        await request(app)
            .put(`${videosRoute}/-100`)
            .send({...updateVideoBody, title: ''})
            .expect(NOT_FOUND)

        await request(app)
            .put(`${videosRoute}/1`)
            .send({...updateVideoBody, minAgeRestriction: 19})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.minAgeRestriction]})
        await request(app)
            .put(`${videosRoute}/1`)
            .send({...updateVideoBody, publicationDate: ''})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.publicationDate]})
        await request(app)
            .put(`${videosRoute}/1`)
            .send({...updateVideoBody, canBeDownloaded: null})
            .expect(BAD_REQUEST, {errorsMessages: [REQUIRED_FIELDS_ERROR.canBeDownloaded]})


    });

    it('should delete the video', async () => {
        let allVideos
        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 5'})
            .expect(CREATED)

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 6'})
            .expect(CREATED)

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 7'})
            .expect(CREATED)


        await request(app)
            .delete(`${videosRoute}/3`)
            .expect(NO_CONTENT)

        allVideos = await request(app)
            .get(videosRoute)
            .expect(OK)
        expect(allVideos.body.length).toBe(2)

    });

    it('should not delete the video', async () => {
        let allVideos
        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 4'})
            .expect(CREATED)

        await request(app)
            .post(videosRoute)
            .send({...video, title: 'Video 5'})
            .expect(CREATED)

        await request(app)
            .delete(`${videosRoute}/-100`)
            .expect(NOT_FOUND)

        allVideos = await request(app)
            .get(videosRoute)
            .expect(OK)
        expect(allVideos.body.length).toBe(2)

    });

    it('should delete all videos', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(NO_CONTENT)
    });


});