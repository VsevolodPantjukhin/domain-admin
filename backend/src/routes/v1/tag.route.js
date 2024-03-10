const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tagValidation = require('../../validations');
const tagController = require('../../controllers/tag.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTags'), validate(tagValidation.createTag), tagController.createTag)
  .get(auth('getTags'), validate(tagValidation.getTags), tagController.getTags);

router
  .route('/:tagId')
  .get(auth('getTags'), validate(tagValidation.getTag), tagController.getTag)
  .patch(auth('manageTags'), validate(tagValidation.updateTag), tagController.updateTag)
  .delete(auth('manageTags'), validate(tagValidation.deleteTag), tagController.deleteTag);

module.exports = router;