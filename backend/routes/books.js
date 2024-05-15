const express = require('express');

const router = express.Router();
const bookController = require('../controllers/books');

router.get('/', bookController.getBooks);

// router.post("/", bookController.postBook);

router.post('/', bookController.createBook);

module.exports = router;
