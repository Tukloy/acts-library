import express from 'express'
import { getAccount, getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountsController.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/',  getAccounts)
router.get('/:id', checkId('accounts'), getAccount)
router.post('/', createAccount)
router.put('/:id', checkId('accounts'), updateAccount)
router.delete('/:id', checkId('accounts'), deleteAccount)

export default router