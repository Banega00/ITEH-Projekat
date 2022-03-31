import Joi from 'joi';

//Schemes is JS Object which keys are routes
//and values are JOI schema objects

export const Schemes = {
    "/route1": Joi.object({
        message: Joi.string().required(),
        eventObject: Joi.object().keys({
            stepId: Joi.number().required(),
            startTimestamp: Joi.date().optional(),
            endTimestamp: Joi.date().optional(),
            title: Joi.string().optional(),
            isSuccessful: Joi.boolean().optional(),
            business: Joi.number().optional(),
            videoOperatorUserName: Joi.string().optional(),
            sessionId: Joi.string().optional()
        }).required()
    }),
}