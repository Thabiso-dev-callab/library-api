export interface Author {
  id: number;
  name: string;
  bio?: string;
  birthYear?: number;
}

export const authors: Author[] = [];
let authorIdSeq = 1;

export function createAuthor(payload: Omit<Author, 'id'>): Author {
  const newAuthor: Author = { id: authorIdSeq++, ...payload };
  authors.push(newAuthor);
  return newAuthor;
}

export function findAuthorById(id: number) {
  return authors.find(a => a.id === id) || null;
}

export function updateAuthor(id: number, payload: Partial<Omit<Author, 'id'>>) {
  const author = findAuthorById(id);
  if (!author) return null;
  Object.assign(author, payload);
  return author;
}

export function deleteAuthor(id: number) {
  const idx = authors.findIndex(a => a.id === id);
  if (idx === -1) return false;
  authors.splice(idx, 1);
  return true;
}
