'use strict';   
const express= require('express');
const cors = require('cors');

const axios = require('axios');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

const apikey='47020856b0ee092b49ba287b048e44d5';
const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apikey}`;
app. get ('/search', search)
app.get('/', homeHandler);
app.use(cors());


function recipesHandler(req, res){
  //axios.get(url).then().catch()
  let url = `https://api.spoonacular.com/recipes/random?apiKey=${apikey}`;
  axios.get(url)
  .then((result)=>{
      console.log(result.data.recipes);

      let dataRecipes = result.data.recipes.map((recipe)=>{
          return new DataQuery(recipe.title, recipe.readyInMinutes,recipe.image)
      })
      // res.json(result.data.recipes);
      res.json(dataRecipes);
  })
  .catch((err)=>{
      console.log(err);
  })

} 

function search (req,res)
{let reqName= req.query.name;
  let url ='https://api.spoonacular.com/recipes/complexSearch?query=${reqName}&apiKey=${apikey}';
  
  console.log(reqName);
 axios.get(url)
 .then((result)=>{
  console.log(result.data.results);
  let response= result.data.results;
  res.json(response);
})
.catch((err)=>{
  console.log(err)
})
}
function DataQuery(title,time,image){
  this.title=title;
  this.time=time;
  this.image=image;


}
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

  
  
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

