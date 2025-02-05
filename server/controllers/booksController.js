import db from '../config/database.js'
import { validationResult } from 'express-validator'

export const getBooks = async (req, res, next) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.status(200).json(books);
    } catch (e) {
        const error = new Error(`Unable to fetch books`);
        error.status = 404;
        return next(error)
    }
}

export const getBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const [book] = await db.query('SELECT * FROM books WHERE id = ?', [id])
        res.status(200).json(book)
    } catch (erro) {
        const error = new Error(`Unable to fetch single book`);
        error.status = 404;
        return next(error)
    }
}

export const createBook = async (req, res, next) => {
   const { book_id, author_name, title_name, type, status } = req.body
   const results = validationResult(req)

   if (!results.isEmpty()) {
     return res.status(400).json({ errors: results.errors.map(error => error.msg) });
   }

   try {
     await db.query('INSERT INTO books (book_id, author_name, title_name, type, status) VALUES (?, ?, ?, ?, ?)', [book_id, author_name, title_name, type, status]);
     res.status(201).json({ message: 'Book created successfully' });
   } catch (e) {
    const error = new Error(`Unable to create book, ${book_id} already exists`);
    error.status = 400;
    return next(error)
   }
}

export const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { book_id, author_name, title_name, type, status, created_at } = req.body
    const results = validationResult(req)

    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.errors.map(error => error.msg) });
      }

    try {
        await db.query('UPDATE books SET book_id = ?, author_name = ?, title_name = ?, type = ?, status = ?, created_at = ? WHERE id = ?', [book_id, author_name, title_name, type, status, created_at, id])
        res.status(200).json({ message: 'Book updated successfully' });
    } catch (e) {
        const error = new Error(`Error updating book`);
        error.status = 400;
        return next(error)
    }
}

export const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
        await db.query('DELETE FROM books WHERE id = ?', [id])
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (e) {
        const error = new Error('Error Deleting Book');
        error.status = 400;
        return next(error)
    }
}