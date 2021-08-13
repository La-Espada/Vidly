const {Movie, validate} = require('../modules/movie');
const {Genre} = require('../modules/genres');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res)=>{
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/',[auth,admin], async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const moiveExist = await Movie.findOne( {title: req.body.title} );
    if(moiveExist) return res.status(400).send('This movie already exist!');

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    let movie = new Movie({
        title: req.body.title,
        genre:{
             id: genre._id,
             name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie= await movie.save();
    res.send(movie);
});

router.put('/:id',[auth,admin], async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id,{name: req.body.name},{
        new: true
    });

    if(!movie) return res.status(404).send('The Movie with the given ID was not found!');
    res.send(movie);
});

router.delete('/:id',[auth,admin], async(req, res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status(404).send('The Movie with the given ID was not found!')
});



module.exports = router;