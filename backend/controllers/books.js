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
        imageUrl: req.file.path,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Book has been created' });
        })
        .catch((error) =>
            res.status(500).json({ message: 'Something went wrong' })
        );
};

exports.getBooks = async (req, res) => {
    await Book.find()
        .then((books) => res.status(200).json(books))
        .catch((err) =>
            res.status(404).json({ message: 'Books was not found' })
        );
};

exports.getBook = async (req, res) => {
    await Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((err) =>
            res.status(404).json({ message: 'Book was not found' })
        );
};

exports.getBestRated = async (req, res) => {
    await Book.find()
        .limit(3)
        .sort({ averageRating: -1 })
        .then((books) => res.status(200).json(books))
        .catch((err) =>
            res.status(404).json({ message: 'Books were not found' })
        );
};

exports.deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book was not found' });
    } else if (req.auth.userId !== book.userId) {
        return res.status(403).json({
            message: 'This user is not authorized to delete this book',
        });
    }

    const fileName = book.imageUrl.split('/').pop();

    fs.unlink('./images/' + fileName, (err) => {
        if (err)
            return res
                .status(500)
                .json({ message: "Couldn't delete image file" });

        Book.deleteOne({ _id: req.params.id })
            .then(() =>
                res
                    .status(200)
                    .json({ message: 'book was successfully deleted' })
            )
            .catch((err) =>
                res.status(400).json({ message: "Couldn't delete the book" })
            );
    });
};

exports.updateBook = async (req, res) => {
    const newBook = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: req.file.path,
          }
        : { ...req.body };
    delete newBook.userId;

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (req.auth.userId !== book.userId) {
                res.status(403).json({
                    message: 'This user is not authorized to modify this book',
                });
            } else {
                if (req.file) {
                    fs.unlink(
                        'images/' + book.imageUrl.split('/').pop(),
                        (err) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Couldn't delete image file",
                                });
                            }
                        }
                    );
                }

                Book.updateOne(
                    { _id: req.params.id },
                    { ...newBook, _id: req.params.id }
                )
                    .then(() => {
                        res.status(200).json({
                            message: 'Book was successfully modified',
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            err,
                        });
                    });
            }
        })
        .catch((err) => {
            res.status(404).json({ err });
        });
};

exports.reviewBook = async (req, res) => {
    if (0 <= req.body.rating <= 5) {
        Book.findOne({ _id: req.params.id })
            .then((book) => {
                const usersIdArray = book.ratings.map(
                    (rating) => rating.userId
                );
                if (usersIdArray.includes(req.auth.userId)) {
                    res.status(403).json({
                        message: 'already reviewed by this user',
                    });
                } else {
                    const ratingsArray = book.ratings;
                    ratingsArray.push({
                        userId: req.auth.userId,
                        grade: req.body.rating,
                    });

                    let sum = 0;
                    for (let rating of ratingsArray) {
                        sum += rating.grade;
                    }
                    const averageRating = sum / ratingsArray.length;

                    book.ratings = ratingsArray;
                    book.averageRating = averageRating;

                    book.save()
                        .then(() => res.status(200).json(book))
                        .catch((err) =>
                            res.status(500).json({
                                message: "Book didn't get updated",
                            })
                        );
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: 'book was not found',
                });
            });
    } else {
        return res.status(400).json({ message: 'rating value is incorrect' });
    }
};
