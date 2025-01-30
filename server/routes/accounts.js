import express from 'express'
import { getAccount, getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountsController.js'

const router = express.Router()

router.get('/',  getAccounts)
router.get('/:id', getAccount)
router.post('/', createAccount)
router.put('/:id', updateAccount)
router.delete('/:id', deleteAccount)

export default router