const express = require('express');
const multer = require('../middleware/multer');
const auth = require('../middleware/authentication');

const router = express.Router();
const bookController = require('../controllers/books');

router.get('/', bookController.getBooks);

router.get('/bestrating', bookController.getBestRated);

router.get('/:id', bookController.getBook);

router.post(
    '/',
    auth,
    multer.uploadImage,
    multer.compressAndSaveImage,
    bookController.postBook
);

router.delete('/:id', auth, multer.uploadImage, bookController.deleteBook);

// router.put("/:id", auth, multer.uploadImage, multer.compressAndSaveImage, );

// router.post("/:id/rating", auth, multer.uploadImage, multer.compressAndSaveImage,  )

module.exports = router;
