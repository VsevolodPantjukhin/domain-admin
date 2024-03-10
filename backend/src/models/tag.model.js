const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tagSchema.plugin(toJSON);
tagSchema.plugin(paginate);


tagSchema.statics.isLabelTaken = async function (label, excludeTagId) {
  const tag = await this.findOne({ label, _id: { $ne: excludeTagId } });
  return !!tag;
};

// tagSchema.pre('save', async function (next) {
//   const tag = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef Tag
 */
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
