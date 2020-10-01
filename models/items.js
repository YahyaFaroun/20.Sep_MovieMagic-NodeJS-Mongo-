const mongoose = require('mongoose');
const Schema = mongoose.Schema

const itemSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    poster_path: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    backdrop_path: {
        type: String,
        required: true
    },
    vote_average: {
        type: Number,
        required: true
    },
    popularity: {
        type: Number,
        required: true
    },
    original_title: {
        type: String,
        required: true
    },
    release_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: 'movieMagic' })

//Modell
const movieItems = mongoose.model('movieMagic', itemSchema)

//Modell export
module.exports = movieItems