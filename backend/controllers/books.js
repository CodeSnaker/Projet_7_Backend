const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.postBook = async (req, res) => {
    if (!req.body.book || !req.file.fieldname === 'image') {
        return res.status(400).json({ message: 'Must have book and image' });
    }

    const inputBook = JSON.parse(req.body.book);
    delete inputBook._id;
    delete inputBook.userId;

    const book = new Book({
        ...inputBook,
        userId: req.auth.userId,
        imageUrl:
            req.protocol +
            '://' +
            req.get('host') +
            '/images/' +
            'optimized_' +
            req.file.filename,
    });

    console.log(book.imageUrl);

    book.save()
        .then(() => res.status(201).json({ message: 'Book has been created' }))
        .catch((error) =>
            res.status(500).json({ message: 'Something went wrong' })
        );
};

exports.getBooks = async (req, res) => {
    await Book.find()
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: 'Books not found' }));
};

exports.getBook = async (req, res) => {
    await Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: 'Book not found' }));
};

exports.getBestRated = async (req, res) => {
    await Book.find()
        .limit(3)
        .sort({ averageRating: -1 })
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: 'Books not found' }));
};

exports.deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(400).json({ message: 'book does not exist' });
    } else if (req.auth.userId !== book.userId) {
        return res.status(403).json({
            message: 'This user is not authorized to delete this book',
        });
    }

    const fileName = book.imageUrl.split('/').pop();

    fs.unlink('./images/' + fileName, (err) => {
        if (err) return res.status(500).json({ err });

        Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'book was deleted' }))
            .catch((err) => res.status(400).json({ err }));
    });
};

exports.updateBook = async (req, res) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(400).json({ message: 'book does not exist' });
    } else if (req.auth.userId !== book.userId) {
        return res.status(403).json({
            message: 'This user is not authorized to modify this book',
        });
    }

    if (req.body.hasOwnProperty('book')) {
        // parse JSON, replace image, update book
        console.log('AYO');
    }

    const fileName = book.imageUrl.split('/').pop();
};
