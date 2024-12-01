const db = require('../utils/db');
const redisClient = require('../utils/redisClient');

class BookService {
    static async getBookById(id) {
        const cacheKey = `book:${id}`;
        const cachedBook = await redisClient.get(cacheKey);
        if (cachedBook) return JSON.parse(cachedBook);
        const book = await this.getBookByIdFromDb(id);
        if (book) await redisClient.set(cacheKey, JSON.stringify(book), { EX: 600 });
        return book;
    }

    static async getBookByIdFromDb(id) {
        const query = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    static async addBook(book) {
        const { title, author, price, genre, description } = book;
        const query = `INSERT INTO books (title, author, price, genre, description) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [title, author, price, genre, description]);
        const newBook = { id: result.insertId, ...book };
        await redisClient.set(`book:${newBook.id}`, JSON.stringify(newBook), { EX: 600 });
        return newBook;
    }

    static async updateBook(id, book) {
        const { title, author, price, genre, description } = book;
        const query = `
            UPDATE books SET title = ?, author = ?, price = ?, genre = ?, description = ?
            WHERE id = ?
        `;
        await db.query(query, [title, author, price, genre, description, id]);
        return { id, ...book };
    }

    static async deleteBook(id) {
        const query = 'DELETE FROM books WHERE id = ?';
        await db.query(query, [id]);
        await redisClient.del(`book:${id}`);
        return true;
    }

    static async getPopularBooks(limit = 10) {
        const bookIdsWithScores = await redisClient.zRangeWithScores('popular_books', 0, limit - 1, { REV: true });
        return bookIdsWithScores.map(({ value }) => parseInt(value, 10));
    }

    static async incrementPopularity(id) {
        await redisClient.zIncrBy('popular_books', 1, id.toString());
    }
}

module.exports = BookService;
