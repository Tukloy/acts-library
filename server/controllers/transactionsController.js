import db from '../config/database.js'
import { validationResult } from 'express-validator'

export const getTransactions = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.search ? `%${req.query.search}%` : null;
        let sortBy = req.query.sort_by || 'created_at';
        let order = req.query.order && req.query.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const validSortColumns = ['transaction_id', 'item_id', 'borrow_date', 'due_date', 'status', 'created_at'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'created_at';
        }

        let query = `SELECT * FROM transactions`;
        let countQuery = `SELECT COUNT(*) AS total FROM transactions`;
        let params = [];

        if (search) {
            query += ` WHERE transaction_id LIKE ? OR item_id LIKE ? OR borrow_date LIKE ? OR due_date LIKE ? OR status LIKE ?`;
            countQuery += ` WHERE transaction_id LIKE ? OR item_id LIKE ? OR borrow_date LIKE ? OR due_date LIKE ? OR status LIKE ?`;
            params.push(search, search, search, search, search);
        }

        query += ` ORDER BY ${sortBy} ${order}`;

        if (limit && limit > 0) {
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const [transactions] = await db.query(query, params);
        const [[{ total }]] = await db.query(countQuery, search ? [search, search, search, search, search] : []);

        res.status(200).json({
            records: transactions,
            total: total
        });
    } catch (e) {
        console.error("Database Error:", e);
        const error = new Error("Unable to fetch transactions");
        error.status = 500;
        return next(error);
    }
};

export const getTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        const [transaction] = await db.query('SELECT * FROM transactions WHERE id = ?', [id])
        res.status(200).json(transaction)
    } catch (e) {
        const error = new Error('Error fetching transaction')
        error.status = 500
        return next(error)
    }
}

export const createTransaction = async (req, res, next) => {
    const { account_id, transaction_id, item_id } = req.body
    const results = validationResult(req)
    const status = 'pending'

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) })
    }
    try {
        await db.query(
            `INSERT INTO transactions (account_id, transaction_id, item_id, status, borrow_date, due_date) 
             VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))`,
            [account_id, transaction_id, item_id, status]
        );
        res.status(201).json({ msg: 'Transaction created' })
    } catch (e) {
        const error = new Error(`Error creating transaction ${transaction_id} id already exists`)
        error.status = 400
        return next(error)
    }
}

export const updateTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { account_id, transaction_id, item_id, borrow_date, due_date, created_at, return_date } = req.body;
    const results = validationResult(req);

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }

    try {
        // Calculate the new status based on borrow_date, due_date, and return_date
        const currentDate = return_date ? new Date(return_date) : new Date();
        const dueDate = new Date(due_date);
        let newStatus = '';
        let dayDifference = 0;

        if (currentDate < dueDate) {
            // Returned early
            dayDifference = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
            newStatus = `returned early (${dayDifference} days)`;
        } else if (currentDate.toDateString() === dueDate.toDateString()) {
            // Returned on time
            newStatus = 'returned on time';
        } else if (currentDate > dueDate) {
            // Overdue
            dayDifference = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
            newStatus = `overdue (${dayDifference} days)`;
        }

        // Update the transaction
        await db.query(
            `UPDATE transactions
             SET account_id = ?, 
                 transaction_id = ?, 
                 item_id = ?, 
                 borrow_date = ?, 
                 due_date = IFNULL(?, DATE_ADD(?, INTERVAL 7 DAY)), 
                 status = ?, 
                 created_at = ?,
                 return_date = ?
             WHERE id = ?`,
            [account_id, transaction_id, item_id, borrow_date, due_date, borrow_date, newStatus, created_at, return_date || null, id]
        );

        // Fetch the updated transaction to include in the response
        const [updatedTransaction] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);

        res.status(200).json({ msg: `Transaction with id of ${id} is updated`, transaction: updatedTransaction });
    } catch (e) {
        const error = new Error('Error Updating transaction');
        error.status = 400;
        return next(error);
    }
};



export const deleteTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        await db.query('DELETE FROM transactions WHERE id =?', [id])
        res.status(200).json({ msg: `Transaction with id of ${id} is deleted` })
    } catch (e) {
        const error = new Error('Error deleting transaction')
        error.status = 400
        return next(error)
    }
}