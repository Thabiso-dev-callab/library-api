import { Router } from 'express';
import * as bookModel from '../models/book';
import * as authorModel from '../models/author';
import { validateBookPayload } from '../middleware/validation';
import { ApiError } from '../utils/ApiError';

const router = Router();

// Create new book
router.post('/', validateBookPayload, (req, res, next) => {
  try {
    const { title, authorId, year, summary } = req.body;
    const book = bookModel.createBook({ title: title.trim(), authorId, year, summary });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// List all books with optional query filters: title, author, year, sort, page, limit
router.get('/', (req, res) => {
  let results = [...bookModel.books];

  const { title, author, year, sort, page = '1', limit = '10' } = req.query as Record<string, string>;

  if (title) {
    const q = title.toLowerCase();
    results = results.filter(b => b.title.toLowerCase().includes(q));
  }

  if (author) {
    const q = author.toLowerCase();
    // match by author name
    results = results.filter(b => {
      const a = authorModel.authors.find(x => x.id === b.authorId);
      return a ? a.name.toLowerCase().includes(q) : false;
    });
  }

  if (year) {
    const y = Number(year);
    if (!Number.isNaN(y)) results = results.filter(b => b.year === y);
  }

  if (sort) {
    const [field, dir] = sort.split(':');
    results.sort((a: any, b: any) => {
      if (!a[field] && !b[field]) return 0;
      if (!a[field]) return -1;
      if (!b[field]) return 1;
      if (a[field] < b[field]) return dir === 'desc' ? 1 : -1;
      if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
      return 0;
    });
  }

  // pagination
  const p = Math.max(1, Number(page));
  const lim = Math.max(1, Number(limit));
  const start = (p - 1) * lim;
  const paged = results.slice(start, start + lim);

  res.json({ total: results.length, page: p, limit: lim, data: paged });
});

// Get book by id
router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const book = bookModel.findBookById(id);
  if (!book) return next(new ApiError(404, 'Book not found'));
  res.json(book);
});

// Update book
router.put('/:id', validateBookPayload, (req, res, next) => {
  const id = Number(req.params.id);
  const book = bookModel.findBookById(id);
  if (!book) return next(new ApiError(404, 'Book not found'));

  // If authorId changed, ensure new author exists
  if (req.body.authorId && !authorModel.authors.some(a => a.id === req.body.authorId)) {
    return next(new ApiError(400, `Referenced authorId ${req.body.authorId} does not exist`));
  }

  // Conflict check for updates (title + author)
  const duplicate = bookModel.books.some(b => b.id !== id && b.title.toLowerCase() === req.body.title.toLowerCase() && b.authorId === req.body.authorId);
  if (duplicate) return next(new ApiError(409, 'Conflict: another book with same title exists for this author'));

  const updated = bookModel.updateBook(id, req.body);
  res.json(updated);
});

// Delete book
router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const ok = bookModel.deleteBook(id);
  if (!ok) return next(new ApiError(404, 'Book not found'));
  res.json({ message: 'Book deleted' });
});

export default router;
