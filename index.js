const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()
app.set('view engine', 'ejs');
app.use(express.static('public'));
const fetch = require('node-fetch');
const movieItems = require('./models/items')


// const dbUri = process.env.DBURI;

mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(process.env.PORT || 3029, () => {
            console.log('listening at 3029');
        })
    })
    .catch(err => console.log(err))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/", (req, res) => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.APIKEY}`)
        .then(res => res.json())
        .then((json) => {
            data1 = json.results
            res.render('index', { allMovieData: data1 })
            // console.log(data1);
        })
        .catch(err => console.log(err))
})

app.get("/movieDetails/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.APIKEY}&language=en-US`)
        .then(res => res.json())
        .then((json) => {
            // console.log(json);
            res.render("movieDetails", { movieDetailsData: json })
        })
        .catch(err => console.log(err))

})

app.get("/addfavourites/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.APIKEY}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            const data = json
            movieItems.find({ id: data.id }).
                then(result => {
                    if (result.length > 0) {
                        res.redirect("/favourites")
                    } else {
                        const newmovieItems = new movieItems({
                            id: data.id,
                            title: data.title,
                            overview: data.overview,
                            genres: data.genres,

                            poster_path: data.poster_path,
                            backdrop_path: data.backdrop_path,

                            vote_average: data.vote_average,
                            popularity: data.popularity,
                            original_title: data.original_title,
                            release_date: data.release_date,
                            status: data.status
                        })
                        newmovieItems
                            .save()
                            .then(result => {
                                res.redirect("/favourites")
                            })
                    }
                })
        })
})

app.get("/favourites", (req, res) => {
    movieItems.find()
        .then(result => {
            res.render('favourites', { myMovies: result })
        })
        .catch(err => console.log(err))
})

app.get("/removeFavourite/:id", (req, res) => {
    movieItems.findById(req.params.id)
        .then(result => {
            res.render('removeFavourite', { myMovies: result })
        })
        .catch(err => console.log(err))
})

app.get("/removeFavourite/:id/delete", (req, res) => {
    movieItems.findByIdAndDelete(req.params.id)
        .then(result => {
            res.redirect('/favourites')
        })
        .catch(err => console.log(err))
})

app.post('/search', (req, res) => {
    res.redirect(`/search/${req.body.search}`)
})
app.get('/search/:id', (req, res) => {
    console.log("test", req)
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${req.params.id}&page=1&include_adult=false`)
        .then(res => res.json())
        .then(json => {
            data = json.results
            res.render('search', { searchedMovies: data })
            console.log(data);
        })
        .catch(err => console.log(err))
})





