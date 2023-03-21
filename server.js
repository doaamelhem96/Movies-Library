'use strict';   
const express= require('express');
const cors = require('cors');
const axios = require('axios');
const query = 'The Shawshank Redemption';
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const apikey='47020856b0ee092b49ba287b048e44d5';
const url ="const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`";

axios.get(url)
  .then(response => {
  
    const trendingMovie = response.data.results[0];
    const movieData = {
      id: trendingMovie.id,
      title: trendingMovie.title,
      release_date: trendingMovie.release_date,
      poster_path: trendingMovie.poster_path,
      overview: trendingMovie.overview
    };
    console.log(movieData);
  })
  .catch(error => {
    console.log(error);
  });

   
  axios.get(url)
    .then(response => {
     
      const movie = response.data.results[0];
      const movieData = {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        overview: movie.overview
      };
      console.log(movieData);
    })
    .catch(error => {
      console.log(error);
    });
  
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

