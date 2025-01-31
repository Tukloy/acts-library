import db from '../config/database.js'

const searchResult = (tbl_name) => {
    return async (req, res, next) => {
        try {
            const {key, value} = req.query
            if (!key && !value) {
               return next()
            }
            const [result] = await db.query(`SELECT * FROM ${tbl_name} WHERE ${key} LIKE ?`, [`%${value}%`])
            res.status(200).json(result)
        } catch (e) {
            const error = new Error(`Unable to fetch search results for ${tbl_name}`);
            error.status = 404;
        }
    }
}

export default searchResult;