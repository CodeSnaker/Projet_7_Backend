const express = require('express');

const path = require('path');

const helmet = require('helmet');

const app = express();

const mongoose = require('mongoose');

const booksRoutes = require('./routes/books');

const userRoutes = require('./routes/user');

require('dotenv').config();

mongoose
    .connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    })
    .then(() => console.log('Database is connected'))
    .catch(() => console.log('Database not connected'));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );

    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;
