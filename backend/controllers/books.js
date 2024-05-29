const sharp = require('sharp');
const Book = require('../models/Book');

exports.postBook = async (req, res) => {
    if (!req.body.book || !req.file.fieldname === 'image') {
        return res.status(400).json({ message: 'Must have book and image' });
    }

    const inputBook = JSON.parse(req.body.book);
    delete inputBook._id;
    delete inputBook.userId;

    const imageUrl =
        req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;

    const book = new Book({
        ...inputBook,
        userId: req.auth.userId,
        imageUrl,
    });

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
    console.log('BestRated');
    await Book.find()
        .limit(3)
        .sort({ averageRating: -1 })
        .then((books) => {
            console.log(books);
            res.status(200).json(books);
        })
        .catch((err) => res.status(404).json({ message: 'Books not found' }));
};
