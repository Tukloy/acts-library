import express from 'express'
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activitiesController.js'
import checkIdExist from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getActivities)
router.get('/:id', checkIdExist('activities'), getActivity)
router.post('/', createActivity)
router.put('/:id', checkIdExist('activities'), updateActivity)
router.delete('/:id', checkIdExist('activities'), deleteActivity)

export default router;