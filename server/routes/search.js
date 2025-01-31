import express from 'express';
import { getAcademicPapers } from '../controllers/academicPapersController.js';
import { getAccounts } from '../controllers/accountsController.js';
import { getActivities } from '../controllers/activitiesController.js';
import { getBooks } from '../controllers/booksController.js';
import { getTransactions } from '../controllers/transactionsController.js';
import search from '../controllers/searchController.js';
import searchLibrary from '../controllers/searchLibraryController.js';

const router =  express.Router();

router.get('/academic-papers', search('academic_papers'), getAcademicPapers)
router.get('/accounts', search('accounts'), getAccounts)
router.get('/activities', search('activities'), getActivities)
router.get('/books', search('books'), getBooks)
router.get('/transactions', search('transactions'), getTransactions)
router.get('/library', searchLibrary)

export default router;