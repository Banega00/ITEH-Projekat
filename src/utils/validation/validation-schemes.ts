import { boolean, date, number, object, string } from 'joi';

//Schemes is JS Object which keys are routes
//and values are JOI schema objects

export const Schemes = {
    "/route1": object({
        message: string().required(),
        eventObject: object().keys({
            stepId: number().required(),
            startTimestamp: date().optional(),
            endTimestamp: date().optional(),
            title: string().optional(),
            isSuccessful: boolean().optional(),
            business: number().optional(),
            videoOperatorUserName: string().optional(),
            sessionId: string().optional()
        }).required()
    }),
}