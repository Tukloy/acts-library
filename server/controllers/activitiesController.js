import db from '../config/database.js'

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
    if(!account_id || !activity) {
        const error = new Error(`Some fields are missing`);
        error.status = 404;
        return next(error)
    }
    try {
        await db.query('INSERT INTO activities (account_id, activity) VALUES (?,?)', [account_id, activity])
        res.status(201).json({msg: 'Activity Created'})
    } catch (error) {
        console.error('Error creating activity', error)
    }
}

export const updateActivity = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const {account_id, activity} = req.body
    try {
         db.query('UPDATE activities SET account_id = ?, activity = ? WHERE id = ?', [account_id, activity, id])
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