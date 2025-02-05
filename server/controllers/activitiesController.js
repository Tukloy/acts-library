import db from '../config/database.js'
import { validationResult } from 'express-validator'

export const getActivities = async (req, res, next) => {
    try {
      const [activities] = await db.query('SELECT * FROM activities')
      res.status(200).json(activities)
    } catch (error) {
        console.error('Error Fetching Activities', error)
    }
}

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