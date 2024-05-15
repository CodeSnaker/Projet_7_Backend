const express = require('express');

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
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTION'
    );
    app.use(
        helmet({
            crossOriginResourcePolicy: false,
        })
    );
    next();
});

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
