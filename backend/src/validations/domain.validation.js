const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDomain = {
    body: Joi.object().keys({
        domain: Joi.string().required(),
        dateCreated: Joi.date().required().timestamp('unix'),
        registrar: Joi.string().required(),
        account: Joi.string().required().email(),
        tags: Joi.array().items(Joi.object().keys({
            label: Joi.string().required(),
            tagId: Joi.string().required()
        })).required().min(1)
    }),
};


const getDomains = {
    query: Joi.object().keys({
        domain: Joi.string(),
        dateCreated: Joi.date().timestamp('unix'),
        dateExpires: Joi.date().timestamp('unix'),
        registrar: Joi.string(),
        account: Joi.string().email(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getDomain = {
    params: Joi.object().keys({
        domainId: Joi.string().custom(objectId),
    }),
};

const updateDomain = {
    params: Joi.object().keys({
        domainId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            domain: Joi.string(),
            dateCreated: Joi.date().timestamp('unix'),
            registrar: Joi.string(),
            tags: Joi.array().items(Joi.object().keys({
                label: Joi.string().required(),
                tagId: Joi.string().required()
            })).min(1)
        })
        .min(1),
};

const deleteDomain = {
    params: Joi.object().keys({
        domainId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createDomain,
    getDomains,
    getDomain,
    updateDomain,
    deleteDomain,
};
