import express from 'express';
import { getAcademicPapers, getAcademicPaper, createAcademicPaper, updateAcademicPaper, deleteAcademicPaper } from '../controllers/academicPapersController.js';
import { checkSchema, validationResult } from 'express-validator'
import { createAcademicPaperSchema } from '../utils/validationSchemas.js'
import checkId from '../middleware/checkIdExist.js'

const router = express.Router();

router.get('/', getAcademicPapers)
router.get('/:id', checkId('academic_papers'), getAcademicPaper)
router.post('/', checkSchema(createAcademicPaperSchema), (req, res, next) => {
    const results = validationResult(req)
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.array() });
    }
    next()
}, createAcademicPaper)
router.put('/:id', checkId('academic_papers'), updateAcademicPaper)
router.delete('/:id',checkId('academic_papers'), deleteAcademicPaper)

export default router;