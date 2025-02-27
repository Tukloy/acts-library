import db from '../config/database.js';
import { validationResult } from 'express-validator';

export const getAcademicPapers = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.search ? `%${req.query.search}%` : null;
        let sortBy = req.query.sort_by || 'created_at';
        let order = req.query.order && req.query.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const validSortColumns = ['title_name', 'author_name', 'type', 'status', 'academic_year', 'course', 'created_at'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'created_at';
        }

        let query = `SELECT * FROM academic_papers`;
        let countQuery = `SELECT COUNT(*) AS total FROM academic_papers`;
        let params = [];

        if (search) {
            query += ` WHERE title_name LIKE ? OR author_name LIKE ? OR type LIKE ? OR status LIKE ? OR academic_year LIKE ? OR course LIKE ?`;
            countQuery += ` WHERE title_name LIKE ? OR author_name LIKE ? OR type LIKE ? OR status LIKE ? OR academic_year LIKE ? OR course LIKE ?`;
            params.push(search, search, search, search, search, search);
        }

        query += ` ORDER BY ${sortBy} ${order}`;

        if (limit && limit > 0) {
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const [academic_papers] = await db.query(query, params);
        const [[{ total }]] = await db.query(countQuery, search ? [search, search, search, search, search, search] : []);

        res.status(200).json({
            records: academic_papers,
            total: total
        });
    } catch (e) {
        console.error("Database Error:", e);
        const error = new Error("Unable to fetch academic_papers");
        error.status = 500;
        return next(error);
    }
};

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

export const uploadAcademicPapers =  async (req, res) => {
    try {
        const papers = req.body.papers;
        if (!papers || papers.length === 0) {
            return res.status(400).json({ error: "No data received" });
        }

        // Insert each paper into the database
        for (const paper of papers) {
            await db.query(
                `INSERT INTO academic_papers (acadp_id, author_name, title_name, course, academic_year, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [paper.acadp_id, paper.author_name, paper.title_name, paper.course, paper.academic_year, paper.type, paper.status]
            );
        }

        res.json({ message: "Upload successful!" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload data" });
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