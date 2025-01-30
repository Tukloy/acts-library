import express from 'express'
import { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getTransactions)
router.get('/:id',checkId('transactions'), getTransaction)
router.post('/', createTransaction)
router.put('/:id', checkId('transactions'), updateTransaction)
router.delete('/:id', checkId('transactions'), deleteTransaction)

export default router