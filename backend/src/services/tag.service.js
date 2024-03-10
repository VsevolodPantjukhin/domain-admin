const httpStatus = require('http-status');
const { Tag } = require('../models');
const ApiError = require('../utils/ApiError');


const createTag = async (tagBody) => {
  if (await Tag.isLabelTaken(tagBody.label)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Label already exists');
  }
  return Tag.create(tagBody);
};

const queryTags = async (filter, options) => {
  const tags = await Tag.paginate(filter, options);
  return tags;
};

const getTagById = async (id) => {
  return Tag.findById(id);
};

const getTagByLabel = async (label) => {
  return Tag.findOne({ label });
};

const updateTagById = async (tagId, updateBody) => {
  const tag = await getTagById(tagId);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }
  if (updateBody.label && (await Tag.isLabelTaken(updateBody.label, tagId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Label already exists');
  }
  Object.assign(tag, updateBody);
  await tag.save();
  return tag;
};

const deleteTagById = async (tagId) => {
  const tag = await getTagById(tagId);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }
  await tag.remove();
  return tag;
};

module.exports = {
  createTag,
  queryTags,
  getTagById,
  getTagByLabel,
  updateTagById,
  deleteTagById,
};
