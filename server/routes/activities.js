import express from 'express'
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activitiesController.js'
import { checkSchema } from 'express-validator'
import { createActivitySchema, updateActivitySchema } from '../utils/validationActivitySchema.js'
import checkIdExist from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getActivities)
router.get('/:id', checkIdExist('activities'), getActivity)
router.post('/', checkSchema(createActivitySchema), createActivity)
router.put('/:id', checkSchema(updateActivitySchema), checkIdExist('activities'), updateActivity)
router.delete('/:id', checkIdExist('activities'), deleteActivity)

export default router;