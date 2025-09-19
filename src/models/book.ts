export interface Book {
  id: number;
  title: string;
  authorId: number;
  year?: number;
  summary?: string;
}

export const books: Book[] = [];
let bookIdSeq = 1;

export function createBook(payload: Omit<Book, 'id'>): Book {
  const newBook: Book = { id: bookIdSeq++, ...payload };
  books.push(newBook);
  return newBook;
}

export function findBookById(id: number) {
  return books.find(b => b.id === id) || null;
}

export function updateBook(id: number, payload: Partial<Omit<Book, 'id'>>) {
  const book = findBookById(id);
  if (!book) return null;
  Object.assign(book, payload);
  return book;
}

export function deleteBook(id: number) {
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return false;
  books.splice(idx, 1);
  return true;
}
