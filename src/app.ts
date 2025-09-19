import express from 'express';
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import logger from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

// Not found handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

export default app;
