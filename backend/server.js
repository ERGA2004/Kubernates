require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware');
const BookService = require('./services/bookService');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// Авторизация
app.use('/auth', authController);

// Маршруты для работы с книгами
app.get('/books/popular', authMiddleware, async (req, res) => {
    try {
        const popularBooks = await BookService.getPopularBooks(10);
        res.json(popularBooks);
    } catch (error) {
        console.error('Error fetching popular books:', error);
        res.status(500).send('Server error');
    }
});

app.get('/books/:id', authMiddleware, async (req, res) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        if (book) {
            await BookService.incrementPopularity(req.params.id);
            res.json(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send('Server error');
    }
});

app.post('/books', authMiddleware, async (req, res) => {
    try {
        const newBook = await BookService.addBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).send('Server error');
    }
});

app.put('/books/:id', authMiddleware, async (req, res) => {
    try {
        const updatedBook = await BookService.updateBook(req.params.id, req.body);
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Server error');
    }
});

app.delete('/books/:id', authMiddleware, async (req, res) => {
    try {
        const isDeleted = await BookService.deleteBook(req.params.id);
        if (isDeleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
