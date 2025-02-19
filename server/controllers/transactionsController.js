import db from '../config/database.js';
import { validationResult } from 'express-validator';
import moment from 'moment';

export const getTransactions = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        limit = Number.isInteger(limit) && limit > 0 ? limit : 10; // Default to 10

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

        query += ` ORDER BY \`${sortBy}\` ${order}`;

        if (limit) {
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const [transactions] = await db.query(query, params);
        const [[{ total }]] = await db.query(countQuery, search ? [search, search, search, search, search] : []);

        // Format the dates properly
        const formattedTransactions = transactions.map(transaction => ({
            ...transaction,
            borrow_date: transaction.borrow_date ? moment(transaction.borrow_date).format('YYYY-MM-DD HH:mm:ss') : null,
            due_date: transaction.due_date ? moment(transaction.due_date).format('YYYY-MM-DD HH:mm:ss') : null,
            return_date: transaction.return_date ? moment(transaction.return_date).format('YYYY-MM-DD HH:mm:ss') : null,
            created_at: transaction.created_at ? moment(transaction.created_at).format('YYYY-MM-DD HH:mm:ss') : null,
        }));

        res.status(200).json({ records: formattedTransactions, total });
    } catch (e) {
        console.error("Database Error:", e);
        return next(new Error("Unable to fetch transactions"));
    }
};

export const getTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const [transaction] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);

        if (!transaction.length) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Format the date fields
        const formattedTransaction = {
            ...transaction[0],
            borrow_date: transaction[0].borrow_date ? moment(transaction[0].borrow_date).format('YYYY-MM-DD HH:mm:ss') : null,
            due_date: transaction[0].due_date ? moment(transaction[0].due_date).format('YYYY-MM-DD HH:mm:ss') : null,
            return_date: transaction[0].return_date ? moment(transaction[0].return_date).format('YYYY-MM-DD HH:mm:ss') : null,
            created_at: transaction[0].created_at ? moment(transaction[0].created_at).format('YYYY-MM-DD HH:mm:ss') : null,
        };

        res.status(200).json(formattedTransaction);
    } catch (e) {
        console.error("Error fetching transaction:", e);
        return next(new Error('Error fetching transaction'));
    }
};

export const createTransaction = async (req, res, next) => {
    const { account_id, transaction_id, item_id } = req.body;
    const results = validationResult(req);
    const status = 'pending';

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }

    try {
        await db.query(
            `INSERT INTO transactions (account_id, transaction_id, item_id, status, borrow_date, due_date) 
             VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))`,
            [account_id, transaction_id, item_id, status]
        );
        res.status(201).json({ msg: 'Transaction created' });
    } catch (e) {
        console.error("Error creating transaction:", e);
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'Transaction ID already exists' });
        }
        return next(new Error('Error creating transaction'));
    }
};

export const updateTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { account_id, transaction_id, item_id, borrow_date, due_date, created_at, return_date } = req.body;
    const results = validationResult(req);

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }

    try {
        const formattedBorrowDate = borrow_date ? moment(borrow_date).format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedDueDate = due_date ? moment(due_date).format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedCreatedAt = created_at ? moment(created_at).format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedReturnDate = return_date && return_date !== "null" ? moment(return_date).format('YYYY-MM-DD HH:mm:ss') : null;

        let newStatus = 'pending';

        if (formattedReturnDate) {
            const returnMoment = moment(formattedReturnDate);
            const dueMoment = moment(formattedDueDate || moment(formattedBorrowDate).add(7, 'days'));
            let dayDifference = 0;

            if (returnMoment.isBefore(dueMoment)) {
                dayDifference = dueMoment.diff(returnMoment, 'days');
                newStatus = `returned early (${dayDifference} days)`;
            } else if (returnMoment.isSame(dueMoment, 'day')) {
                newStatus = 'returned on time';
            } else {
                dayDifference = returnMoment.diff(dueMoment, 'days');
                newStatus = `overdue (${dayDifference} days)`;
            }
        }

        const [updateResult] = await db.query(
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
            [account_id, transaction_id, item_id, formattedBorrowDate, formattedDueDate, formattedBorrowDate, newStatus, formattedCreatedAt, formattedReturnDate, id]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ msg: `Transaction with id ${id} not found` });
        }

        res.status(200).json({ msg: `Transaction with id ${id} is updated` });
    } catch (e) {
        console.error("Error updating transaction:", e);
        return next(new Error('Error updating transaction'));
    }
};

export const deleteTransaction = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const [deleteResult] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ msg: `Transaction with id ${id} not found` });
        }

        res.status(200).json({ msg: `Transaction with id ${id} is deleted` });
    } catch (e) {
        console.error("Error deleting transaction:", e);
        return next(new Error('Error deleting transaction'));
    }
};
