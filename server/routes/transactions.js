import express from 'express'
import { getTransactions, getTransaction, createTransaction, updateTransaction, uploadTransctions, deleteTransaction } from '../controllers/transactionsController.js'
import { checkSchema } from 'express-validator'
import { createTransactionSchema, updateTransactionSchema } from '../utils/validationTransactionSchema.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getTransactions)
router.get('/:id',checkId('transactions'), getTransaction)
router.post('/', checkSchema(createTransactionSchema), createTransaction)
router.put('/:id', checkSchema(updateTransactionSchema), checkId('transactions'), updateTransaction)
router.delete('/:id', checkId('transactions'), deleteTransaction)
router.post('/upload', uploadTransctions)

export default router