import db from '../config/database.js';
import { validationResult } from 'express-validator';

export const getAcademicPapers = async (req, res, next) => {
    try {
        const [academic_papers] = await db.query('SELECT * FROM academic_papers')
        res.status(200).json(academic_papers);
    } catch (e) {
        const error = new Error(`Unable to fetch accounts`);
        error.status = 404;
        return next(error)
    }
}

export const getAcademicPaper = async (req, res, next) => {
    const id = parseInt(req.params.id)
    if (!id) return res.sendStatus(400)
    try {
        const [paper] = await db.query('SELECT * FROM academic_papers WHERE id = ?', [id])
        if (!paper.length) {
            const error = new Error(`Academic paper with id ${id} not found`);
            error.status = 404;
            return next(error)
        }
        res.status(200).json(paper);
    } catch (error) {
        console.error('Error fetching single academic paper', error)
    }
}

export const createAcademicPaper = async (req, res, next) => {
    const { acadp_id, author_name, title_name, status, academic_year, course, type} = req.body
    const results = validationResult(req)
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }
    try {
        await db.query('INSERT INTO academic_papers (acadp_id, author_name, title_name, status, academic_year, course, type) VALUES (?, ?, ?, ?, ?, ? ,?)', [acadp_id, author_name, title_name, status, academic_year, course, type])
        res.status(201).json({msg: 'Academic Paper Created'})
    } catch (error) {
        console.error('Error Creating Academic Paper', error)
        res.status(400).json({msg: `check if id of ${acadp_id} already exists`})
    }
}

export const updateAcademicPaper = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const {acadp_id, author_name, title_name, status, academic_year, course, type, created_at} = req.body
    if (isNaN(id)) return res.sendStatus(400)

    const results = validationResult(req)
    if (!results.isEmpty()) {
            return res.status(400).json({ errors: results.errors.map(error => error.msg) });
        }
    try {
        await db.query('UPDATE academic_papers SET acadp_id = ?, author_name = ?, title_name = ?, status = ?, academic_year = ?, course = ? , type = ?, created_at = ? WHERE id = ?', [acadp_id, author_name, title_name, status, academic_year, course, type, created_at, id])
        res.status(200).json({msg: `Academic Paper with id of ${id} is Updated`})
    } catch (error) {
        console.error('Error Updating Academic Paper', error)
    }
}

export const deleteAcademicPaper = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        await db.query('DELETE FROM academic_papers WHERE id =?', [id])
        res.status(200).json({msg: `Academic Paper with id of ${id} is Deleted`})
    } catch (error) {
        console.error('Error Deleting Academic Paper', error)
    }
}