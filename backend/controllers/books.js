const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Book = require('../models/Book');

exports.postBook = (req, res) => {
    console.log(req.body);
    if (!req.body.book || !req.body.image) {
        return res.status(400).json({ message: 'Must have book and image' });
    }

    const inputBook = JSON.parse(req.body.book);

    // const { buffer, fileName } = req.body.image;
    // console.log(fileName);
    // console.log(inputBook);
    // const storage = multer.memoryStorage();
    // const covers = multer({ storage });

    // fs.access("./images", (error) => {
    //     if (error) {
    //         fs.mkdirSync("./images");
    //     }
    // });

    // const timestamp = new Date().toISOString();
    // const ref = fileName + "-" + timestamp + ".webp";
    // await sharp(buffer)
    //     .webp({ quality: 20 })
    //     .toFile("./images/" + ref);
    const link = 'http://127.0.0.1:4000/images/ + ref';

    const book = new Book({
        userId: inputBook.userId,
        title: inputBook.title,
        author: inputBook.author,
        imageUrl: link,
        year: inputBook.year,
        genre: inputBook.genre,
        ratings: inputBook.ratings,
        averageRating: inputBook.averageRating,
    });

    // book.save()
    // .then(() => res.status(201).json({ message: "Book has been created" }))
    // .catch((error) =>
    //     res.status(500).json({ message: "Something went wrong" })
    // );
};

exports.getBooks = async (req, res, next) => {
    // Book.find({})
    //     .then((books) => {
    //         console.log(books);
    //         res.status(200).json(books);
    //     })
    //     .catch((error) => res.status(404).json({ error: error }));

    const books = await Book.find();
    console.log(books);

    if (!books) return res.status(404).json({ message: 'No books found' });

    res.status(200).json(books);
};

exports.createBook = (req, res) => {
    console.log('createBook');
    // const book = JSON.parse(req.body.bodyFormData);
    console.log(req.body);
};
