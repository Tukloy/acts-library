import db from '../config/database.js'

// Route /api/search/library?key=''&value=''
// Description: this is for searching academic_papers and books

const searchLibrary = async (req, res, next) => {
     const {key, value} = req.query
        try {
            if (!key || !value) {
                // return res.status(400).json({ msg: 'missing filled'})
                const [results] = await db.query(`SELECT 'academic_papers' AS source, acadp_id AS item_id, author_name, title_name, status, type FROM academic_papers
                    UNION 
                SELECT 'books' AS source, book_id AS item_id, author_name, title_name, status, type FROM books`)
                return res.status(200).json(results);
             }
            const allowedKeys = ['author_name', 'title_name', 'status', 'type']; // Add allowed columns

            if (!allowedKeys.includes(key)) {
             return res.status(400).json({ error: 'Invalid search key' });
            }
            
            const [result] = await db.query(`
                SELECT 'academic_papers' AS source, acadp_id AS item_id, author_name, title_name, status, type FROM academic_papers WHERE ${key} LIKE ? 
                    UNION 
                SELECT 'books' AS source, book_id AS item_id, author_name, title_name, status, type FROM books WHERE ${key} LIKE ? `, [`%${value}%`, `%${value}%`]);

                res.status(200).json(result);
        } catch (e) {
            const error = new Error(`Unable to fetch search results`);
            error.status = 404;
        }
    }


export default searchLibrary;