const express = require('express');
const multer = require('../middleware/multer');
const auth = require('../middleware/authentication');

const router = express.Router();
const bookController = require('../controllers/books');

router.get('/', bookController.getBooks);

router.get('/bestrating', bookController.getBestRated);

router.get('/:id', bookController.getBook);

router.post('/', auth, multer, multer.optimizeImage, bookController.postBook);

router.delete('/:id', auth, multer, bookController.deleteBook);

router.put('/:id', auth, multer, bookController.updateBook);

router.post('/:id/rating', auth, bookController.reviewBook);

module.exports = router;
