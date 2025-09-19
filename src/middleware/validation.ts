import { Request, Response, NextFunction } from 'express';
import { authors } from '../models/author';
import { books } from '../models/book';
import { ApiError } from '../utils/ApiError';

export function validateAuthorPayload(req: Request, res: Response, next: NextFunction) {
  const { name, bio, birthYear } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ApiError(400, 'Invalid author: "name" is required and must be a non-empty string'));
  }
  if (birthYear !== undefined && typeof birthYear !== 'number') {
    return next(new ApiError(400, 'Invalid author: "birthYear" must be a number'));
  }
  next();
}

export function validateBookPayload(req: Request, res: Response, next: NextFunction) {
  const { title, authorId, year, summary } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return next(new ApiError(400, 'Invalid book: "title" is required and must be a non-empty string'));
  }
  if (authorId === undefined || typeof authorId !== 'number') {
    return next(new ApiError(400, 'Invalid book: "authorId" is required and must be a number'));
  }
  // Check author exists
  const authorExists = authors.some(a => a.id === authorId);
  if (!authorExists) {
    return next(new ApiError(400, `Invalid book: referenced authorId ${authorId} does not exist`));
  }
  if (year !== undefined && typeof year !== 'number') {
    return next(new ApiError(400, 'Invalid book: "year" must be a number'));
  }
  // Conflict: duplicate title for same author
  const conflict = books.some(b => b.title.toLowerCase() === title.toLowerCase() && b.authorId === authorId && (req.method === 'POST'));
  if (conflict) {
    return next(new ApiError(409, 'Conflict: book with same title already exists for this author'));
  }

  next();
}
