import db from '../config/database.js';

const checkId = (tbl_name) => {
    return async (req, res, next) => {
        try {
            const id = req.params.id;

            const [rows] = await db.query(`SELECT * FROM ${tbl_name} WHERE id = ?`, [id]);

            if(isNaN(id)) return res.status(400).json({ msg: 'Invalid id'})

            if (rows.length === 0) {
                return res.status(404).json({ msg: `Couldn't find ID ${id} in ${tbl_name}` });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Server error' });
        }
    };
};

export default checkId;