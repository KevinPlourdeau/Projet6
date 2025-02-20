const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Livre créé !'
    });
});

app.get('/api/books', (req, res, next) => {
    const book = [
        {
            _id: 'b',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            ratings: [{ userID:'Jean', value: 3 }],
            averageRating: 3,
            title: 'Milwaukee Mission',
            author: 'Elder Cooper',
            year: 2021,
            genre: 'Policier',
            userId: 'Jean',
        },
        {
            _id: 'a',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            ratings: [{ userID:'Jean', value: 4 }],
            averageRating: 4,
            title: 'Book for Esther',
            author: 'Alabaster',
            year: 2022,
            genre: 'Paysage',
            userId: 'Jean',
        },
      
    ];
    res.status(200).json(book);
});

module.exports = app;