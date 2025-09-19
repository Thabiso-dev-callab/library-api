import { Router } from 'express';
import * as authorModel from '../models/author';
import * as bookModel from '../models/book';
import { validateAuthorPayload } from '../middleware/validation';
import { ApiError } from '../utils/ApiError';

const router = Router();

// Create new author
router.post('/', validateAuthorPayload, (req, res, next) => {
  try {
    const { name, bio, birthYear } = req.body;
    const author = authorModel.createAuthor({ name: name.trim(), bio, birthYear });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
});

// List all authors
router.get('/', (req, res) => {
  res.json(authorModel.authors);
});

// Get author by id
router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const author = authorModel.findAuthorById(id);
  if (!author) return next(new ApiError(404, 'Author not found'));
  res.json(author);
});

// Update author
router.put('/:id', validateAuthorPayload, (req, res, next) => {
  const id = Number(req.params.id);
  const updated = authorModel.updateAuthor(id, req.body);
  if (!updated) return next(new ApiError(404, 'Author not found'));
  res.json(updated);
});

// Delete author (also delete their books)
router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const author = authorModel.findAuthorById(id);
  if (!author) return next(new ApiError(404, 'Author not found'));
  // Remove author's books
  const removedBooks = bookModel.books.filter(b => b.authorId === id).length;
  for (let i = bookModel.books.length - 1; i >= 0; i--) {
    if (bookModel.books[i].authorId === id) bookModel.books.splice(i, 1);
  }
  authorModel.deleteAuthor(id);
  res.json({ message: 'Author and their books deleted', removedBooks });
});

// List books by author
router.get('/:id/books', (req, res, next) => {
  const id = Number(req.params.id);
  const author = authorModel.findAuthorById(id);
  if (!author) return next(new ApiError(404, 'Author not found'));
  const authorBooks = bookModel.books.filter(b => b.authorId === id);
  res.json(authorBooks);
});

export default router;
