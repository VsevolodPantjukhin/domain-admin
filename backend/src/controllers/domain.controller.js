const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { domainService } = require('../services');

const createDomain = catchAsync(async (req, res) => {
    const domain = await domainService.createDomain(req.body);
    res.status(httpStatus.CREATED).send(domain);
});

const getDomains = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['domain', 'dateCreated', 'dateExpires', 'registrar', 'account']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await domainService.queryDomains(filter, options);
    res.send(result);
});

const getDomain = catchAsync(async (req, res) => {
    const domain = await domainService.getDomainById(req.params.domainId);
    if (!domain) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Domain not found');
    }
    res.send(domain);
});

const updateDomain = catchAsync(async (req, res) => {
    const domain = await domainService.updateDomainById(req.params.domainId, req.body);
    res.send(domain);
});

const deleteDomain= catchAsync(async (req, res) => {
    await domainService.deleteDomainById(req.params.domainId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createDomain,
    getDomains,
    getDomain,
    updateDomain,
    deleteDomain,
};
