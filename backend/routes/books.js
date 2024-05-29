const express = require('express');
const multer = require('../middleware/multer');
const auth = require('../middleware/authentication');

const router = express.Router();
const bookController = require('../controllers/books');

router.get('/', bookController.getBooks);

router.get('/bestrating', bookController.getBestRated);

router.get('/:id', bookController.getBook);

router.post('/', auth, multer, bookController.postBook);

module.exports = router;
