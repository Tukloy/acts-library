import db from '../config/database.js'
import { validationResult } from 'express-validator'

export const getActivities = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.search ? `%${req.query.search}%` : null;
        let sortBy = req.query.sort_by || 'created_at';
        let order = req.query.order && req.query.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const validSortColumns = ['account_id', 'activity', 'created_at', 'updated_at'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'created_at';
        }

        let query = `SELECT * FROM activities`;
        let countQuery = `SELECT COUNT(*) AS total FROM activities`;
        let params = [];

        if (search) {
            query += ` WHERE account_id LIKE ? OR activity LIKE ? OR created_at LIKE ? OR updated_at LIKE ?`;
            countQuery += ` WHERE account_id LIKE ? OR activity LIKE ? OR created_at LIKE ? OR updated_at LIKE ?`;
            params.push(search, search, search, search, search, search);
        }

        query += ` ORDER BY ${sortBy} ${order}`;

        if (limit && limit > 0) {
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const [activities] = await db.query(query, params);
        const [[{ total }]] = await db.query(countQuery, search ? [search, search, search, search, search, search] : []);

        res.status(200).json({
            records: activities,
            total: total
        });
    } catch (e) {
        console.error("Database Error:", e);
        const error = new Error("Unable to fetch activities");
        error.status = 500;
        return next(error);
    }
};

export const getActivity = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
       const [activity] = await db.query('SELECT * FROM activities WHERE id = ?', [id])
        res.status(200).json(activity)
    } catch (error) {
        console.error('Error Fetching single Activity', error)
    }
}

export const createActivity = async (req, res, next) => {
    const {account_id, activity} = req.body
    const results = validationResult(req)
    if(!results.isEmpty()) {
        return res.status(400).json({errors: results.errors.map(error => error.msg)})
    }
    try {
        await db.query('INSERT INTO activities (account_id, activity) VALUES (?,?)', [account_id, activity])
        res.status(201).json({msg: 'Activity Created'})
    } catch (error) {
        console.error('Error creating activity', error)
        res.status(500).json({ msg: `Account ${account_id} not found` })
    }
}

export const updateActivity = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const {account_id, activity, created_at} = req.body

    const results = validationResult(req)
    if(!results.isEmpty()) {
        return res.status(400).json({errors: results.errors.map(error => error.msg)})
    }
    
    try {
         db.query('UPDATE activities SET account_id = ?, activity = ?, created_at = ? WHERE id = ?', [account_id, activity, created_at, id])
         res.status(200).json({msg: 'Activity updated'})
    } catch (error) {
        console.error('Error updating activity', error)
    }
}

export const deleteActivity = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        await db.query('DELETE FROM activities WHERE id = ?', [id])
        res.status(200).json({msg: 'Activity deleted'})
    } catch (error) {
        console.error('Error deleting activity', error)
    }
}