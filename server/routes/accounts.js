import express from 'express'
import { getAccount, getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountsController.js'
import { checkSchema } from 'express-validator'
import { createAccountSchema, updateAccountSchema } from '../utils/validationAccountSchema.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/',  getAccounts)
router.get('/:id', checkId('accounts'), getAccount)
router.post('/', checkSchema(createAccountSchema), createAccount)
router.put('/:id',checkSchema(updateAccountSchema), checkId('accounts'), updateAccount)
router.delete('/:id', checkId('accounts'), deleteAccount)

export default router