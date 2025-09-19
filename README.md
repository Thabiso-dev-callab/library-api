# Library API

A **RESTful API** for managing a library system with Authors and Books, built using **TypeScript** and **Express**.

This project demonstrates **CRUD operations**, **input validation**, **error handling**, and basic **logging middleware**.

---

## 🚀 Features

* Create, Read, Update, Delete **Authors**
* Create, Read, Update, Delete **Books**
* List all books by a specific author (`GET /authors/:id/books`)
* Input validation (rejects invalid or missing fields)
* Centralized error handling (400, 404, 409, 500)
* Logging middleware (logs HTTP method + URL)
* Optional: filtering, searching, sorting, and pagination for books

---

## 📦 Project Structure

```
library-api/
│
├─ src/
│  ├─ index.ts           # Entry point
│  ├─ routes/
│  │  ├─ authors.ts
│  │  └─ books.ts
│  ├─ models/
│  │  ├─ author.ts
│  │  └─ book.ts
│  ├─ middleware/
│  │  ├─ logger.ts
│  │  ├─ validation.ts
│  │  └─ errorHandler.ts
│  └─ utils/
│     └─ ApiError.ts
│
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/library-api.git
cd library-api
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Server will run at `http://localhost:3000`.

4. Build for production:

```bash
npm run build
npm start
```

---

## 📚 API Endpoints

### Authors

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `/authors`           | Create a new author                      |
| GET    | `/authors`           | List all authors                         |
| GET    | `/authors/:id`       | Get author by ID                         |
| PUT    | `/authors/:id`       | Update author by ID                      |
| DELETE | `/authors/:id`       | Delete author (also deletes their books) |
| GET    | `/authors/:id/books` | List all books for an author             |

### Books

| Method | Endpoint     | Description                                              |
| ------ | ------------ | -------------------------------------------------------- |
| POST   | `/books`     | Create a new book                                        |
| GET    | `/books`     | List all books (supports filtering, sorting, pagination) |
| GET    | `/books/:id` | Get book by ID                                           |
| PUT    | `/books/:id` | Update book by ID                                        |
| DELETE | `/books/:id` | Delete book                                              |

---

## 🔧 Request Examples

**Create Author**

```json
POST /authors
{
  "name": "Chinua Achebe",
  "bio": "Nigerian novelist",
  "birthYear": 1930
}
```

**Create Book**

```json
POST /books
{
  "title": "Things Fall Apart",
  "authorId": 1,
  "year": 1958,
  "summary": "Classic novel"
}
```

---

## ⚠️ Error Handling

* **400 Bad Request** – Invalid or missing fields
* **404 Not Found** – Resource does not exist
* **409 Conflict** – Duplicate book for the same author
* **500 Internal Server Error** – Unexpected server error

Example response:

```json
{
  "error": "Invalid book: 'authorId' is required and must be a number"
}
```

---

## 🛠️ Testing

* Test API using **Postman** or **curl**.
* Example curl request:

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Chinua Achebe","bio":"Nigerian novelist","birthYear":1930}'
```

---

## 📌 Notes

* Data is **stored in-memory**, so all authors and books will reset when the server restarts.
* All endpoints are **JSON only**.
* Logging middleware prints **HTTP method + URL + timestamp** in console.

---

## 📝 License

MIT License
