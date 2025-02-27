import db from '../config/database.js';
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'

export const getAccounts = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.search ? `%${req.query.search}%` : null;
        let sortBy = req.query.sort_by || 'created_at';
        let order = req.query.order && req.query.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const validSortColumns = ['account_id', 'name', 'course', 'year_and_section', 'email', 'account_type', 'created_at'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'created_at';
        }

        let query = `SELECT * FROM accounts`;
        let countQuery = `SELECT COUNT(*) AS total FROM accounts`;
        let params = [];

        if (search) {
            query += ` WHERE account_id LIKE ? OR name LIKE ? OR course LIKE ? OR year_and_section LIKE ? OR email LIKE ? OR account_type LIKE ?`;
            countQuery += ` WHERE account_id LIKE ? OR name LIKE ? OR course LIKE ? OR year_and_section LIKE ? OR email LIKE ? OR account_type LIKE ?`;
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

export const getAccount = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        if(isNaN(id)) return res.sendStatus(400)
        const [account] = await db.query('SELECT * FROM accounts WHERE id = ?', id)
        if (!account.length) {
            const error = new Error(`Account with id ${id} not found`);
            error.status = 404;
            return next(error)
        }
        res.status(200).json(account)
    } catch (error) {
        console.log('Error Fetching single account', error)
    }
}

export const createAccount = async (req, res, next) => {
    const {account_id, name, password, course, year_and_section, email, account_type} = req.body
    const results = validationResult(req)
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await db.query('INSERT INTO accounts (account_id, name, password, course, year_and_section, email, account_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [account_id, name, hashedPassword, course, year_and_section, email, account_type])
       res.status(201).json({msg: 'Account Created'})
    } catch (e) {
        console.log('Error Creating a new account', e);
        res.status(400).json({ msg: `Account id ${account_id} already exists` })
    }
}

export const updateAccount = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const { account_id, name, password, course, year_and_section, email, account_type, created_at} = req.body

    if(!id) return res.status(404).json({ msg: 'Invalid id'})

    const results = validationResult(req)
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.query('UPDATE accounts SET account_id = ?, name = ?, password = ?, course = ?, year_and_section = ?, email = ?, account_type = ?, created_at = ? WHERE id = ?', [account_id, name, hashedPassword, course, year_and_section, email, account_type, created_at,  id])
        res.status(200).json({ msg: 'Account updated successfully'})
    } catch (error) {
        console.error('Error cannot update account', error)
    }
}

export const deleteAccount = async (req, res, next) => {
    const id = parseInt(req.params.id)
    if(!id) return res.status(404).json({ msg: 'Invalid id'})
    try {
        await db.query('DELETE FROM accounts WHERE id =?', [id])
        res.status(200).json({ msg: 'Account deleted successfully'})
    } catch (e) {
        const error = new Error(`Unable to fetch accounts`);
        error.status = 404;
        return next(error)
    }
}