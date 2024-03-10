const httpStatus = require('http-status');
const { Domain } = require('../models');
const ApiError = require('../utils/ApiError');

const createDomain = async (domainBody) => {
    if (await Domain.isDomainTaken(domainBody.domain)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Domen already exists');
    }
    let dateExpires = await Domain.getDomainExpirationUnix(domainBody.domain);
    return Domain.create({ ...domainBody, dateExpires: dateExpires });
};

const queryDomains = async (filter, options) => {
    const domains = await Domain.paginate(filter, options);
    return domains;
};

const getDomainById = async (id) => {
    return Domain.findById(id);
};

const getDomainByName = async (domain) => {
    return Domain.findOne({ domain });
};

const updateDomainById = async (domainId, updateBody) => {
    const domain = await getDomainById(domainId);
    if (!domain) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Domain not found');
    }
    if (updateBody.domain && (await Domain.isDomainTaken(updateBody.domain, domainId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Domain already exists');
    }
    Object.assign(domain, updateBody);
    await domain.save();
    return domain;
};

const deleteDomainById = async (domainId) => {
    const domain = await getDomainById(domainId);
    if (!domain) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Domain not found');
    }
    await domain.remove();
    return domain;
};

module.exports = {
    createDomain,
    queryDomains,
    getDomainById,
    getDomainByName,
    updateDomainById,
    deleteDomainById,
};
