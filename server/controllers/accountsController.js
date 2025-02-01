import db from '../config/database.js';
import { validationResult } from 'express-validator'

export const getAccounts = async (req, res, next) => {
    try {
        const [accounts] = await db.query('SELECT * FROM accounts');
        res.status(200).json(accounts);
    } catch (e) {
        const error = new Error(`Unable to fetch accounts`);
        error.status = 404;
        return next(error)
    }
}

export const getAccount = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        if(isNaN(id)) return res.sendStatus(400)
        const [account] = await db.query('SELECT * FROM accounts WHERE student_number = ?', id)
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
    try {
      await db.query('INSERT INTO accounts (account_id, name, password, course, year_and_section, email, account_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [account_id, name, password, course, year_and_section, email, account_type])
       res.status(201).json({msg: 'Account Created'})
    } catch (e) {
        console.log('Error Creating a new account', e);
        res.status(400).json({ msg: `Account id ${account_id} already exists` })
    }
}

export const updateAccount = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const { account_id, name, password, course, year_and_section, email, account_type} = req.body

    if(!id) return res.status(404).json({ msg: 'Invalid id'})

    const results = validationResult(req)
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
    }
    
    try {
        await db.query('UPDATE accounts SET account_id = ?, name = ?, password = ?, course = ?, year_and_section = ?, email = ?, account_type = ? WHERE id = ?', [account_id, name, password, course, year_and_section, email, account_type, id])
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