const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const getDomainInfo = require('../utils/domainInfo');

const domainSchema = mongoose.Schema(
    {
        domain: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        dateCreated: {
            type: Number,//unix
            required: true,
        },
        dateExpires: {
            type: Number,//unix
            required: true,
        },
        registrar: {
            type: String,
            required: true,
            trim: true,
        },
        account: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [{
                label: {
                    type: String,
                    required: true,
                },
                tagId: {
                    type: String,
                    required: true,
                }
            }],
            required: true,

        }

    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
domainSchema.plugin(toJSON);
domainSchema.plugin(paginate);

domainSchema.statics.isDomainTaken = async function (domain, excludeDomainId) {
    const dmn = await this.findOne({ domain, _id: { $ne: excludeDomainId } });
    return !!dmn;
};

domainSchema.statics.getDomainExpirationUnix = async function (domain) {
    return await getDomainInfo(domain)
}
// async function

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
