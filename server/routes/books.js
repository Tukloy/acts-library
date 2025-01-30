import express from 'express'
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/booksController.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', checkId('books'), getBook)
router.post('/', createBook)
router.put('/:id', checkId('books'), updateBook)
router.delete('/:id', checkId('books'), deleteBook)

export default router