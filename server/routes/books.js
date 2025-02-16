import express from 'express'
import { getBooks, getBook, createBook, updateBook, uploadBooks, deleteBook } from '../controllers/booksController.js'
import { checkSchema } from 'express-validator'
import { createBookSchema, updateBookSchema } from '../utils/validationBookSchema.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', checkId('books'), getBook)
router.post('/', checkSchema(createBookSchema), createBook)
router.put('/:id',checkSchema(updateBookSchema), checkId('books'), updateBook)
router.delete('/:id', checkId('books'), deleteBook)
router.post('/upload', uploadBooks)

export default router