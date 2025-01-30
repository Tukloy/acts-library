import express from 'express';
import { getAcademicPapers, getAcademicPaper, createAcademicPaper, updateAcademicPaper, deleteAcademicPaper } from '../controllers/academicPaperController.js';
import checkId from '../middleware/checkIdExist.js'

const router = express.Router();

router.get('/', getAcademicPapers)
router.get('/:id', checkId('academic_papers'), getAcademicPaper)
router.post('/', createAcademicPaper)
router.put('/:id', checkId('academic_papers'), updateAcademicPaper)
router.delete('/:id',checkId('academic_papers'), deleteAcademicPaper)

export default router;