import express from 'express';
import { getAcademicPapers, getAcademicPaper, createAcademicPaper, updateAcademicPaper, deleteAcademicPaper } from '../controllers/academicPapersController.js';
import { checkSchema } from 'express-validator'
import { createAcademicPaperSchema, updateAcademicPaperSchema } from '../utils/validationAcademicPaperSchemas.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router();

router.get('/', getAcademicPapers)
router.get('/:id', checkId('academic_papers'), getAcademicPaper)
router.post('/', checkSchema(createAcademicPaperSchema), createAcademicPaper)
router.put('/:id', checkId('academic_papers'), checkSchema(updateAcademicPaperSchema), updateAcademicPaper)
router.delete('/:id',checkId('academic_papers'), deleteAcademicPaper)

export default router;