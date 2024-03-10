const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTag = {
    body: Joi.object().keys({
        label: Joi.string().required()
    }),
};

const getTags = {
    query: Joi.object().keys({
        label: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getTag = {
    params: Joi.object().keys({
        tagId: Joi.string().custom(objectId),
    }),
};

const updateTag = {
    params: Joi.object().keys({
        tagId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            label: Joi.string().required()
        })
        .min(1),
};

const deleteTag = {
    params: Joi.object().keys({
        tagId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createTag,
    getTags,
    getTag,
    updateTag,
    deleteTag,
};
