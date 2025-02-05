import db from '../config/database.js'
import { validationResult } from 'express-validator'

export const getTransactions = async (req, res, next) => {
    try {
        const [transactions] = await db.query('SELECT * FROM transactions')
        res.status(200).json(transactions)
    } catch (e) {
        const error = new Error('Error Fetching transactions')
        error.status = 500
        return next(error)
    }
}

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
    const { account_id, transaction_id, item_id, status } = req.body
    const results = validationResult(req)

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
    const id = parseInt(req.params.id)
    const { account_id, transaction_id, item_id, borrow_date, due_date, status, created_at } = req.body
    const results = validationResult(req)

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) })
    }
    try {
        // Update query
        await db.query(
            `UPDATE transactions
             SET account_id = ?, 
                 transaction_id = ?, 
                 item_id = ?, 
                 borrow_date = ?, 
                 due_date = IFNULL(?, DATE_ADD(?, INTERVAL 7 DAY)), 
                 status = ? ,
                 created_at = ?
             WHERE id = ?`,
            [account_id, transaction_id, item_id, borrow_date, due_date, borrow_date, status, created_at, id]
        );
        res.status(200).json({ msg: `Transaction with id of ${id} is updated` })
    } catch (e) {
        const error = new Error('Error Updating transaction ')
        error.status = 400
        return next(error)
    }
}

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