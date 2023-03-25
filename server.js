'use strict';   
const express= require('express');
const cors = require('cors');
 const axios = require('axios');
require('dotenv').config();
const app = express();
const movieData=require(`./movieData.json`);
const {json}= require("express");

const PORT = process.env.PORT;

const apiKey= process.env.API_KEY;
const{Client}=require('pg');
let url = `postgres://duaa:0000@localhost:5432/movies`;
const client=new Client(url);
const bodyParser = require('body-parser')
app.post("/addMovie",addMovieHandler);
app.get("getMovies",getAmovie);
app.use(cors());
app.use(express.json());

app.get ('/favorit',favoritePagehandler);
// app.get('/',HomePageHandler);
app.get('/search',searchHandler);
app.get('/trending',trendingPageHandler );
// app.get('/usually',Film );
app.get('/film',filmHandler);
app .get('*',handleNotFoundError);

function addMovieHandler(req,res)
{
  let {name,comments} = req.body; // destructuring 
  // client.query(sql,values)
  let sql = `INSERT INTO Movie (name,comments)
  VALUES ($1,$2) RETURNING *; `
  let values = [name,comments]
  client.query(sql,values).then((result)=>{
      console.log(result.rows)
    
      res.status(201).json(result.rows)
    }

    ).catch((err)=>{
        errorHandler(err,req,res);
    })

}
function getAmovie(req,res)
{
  let sql =`SELECT * FROM Movi`; //read all data from database table
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    }).catch((err)=>{
        errorHandler(err,req,res)
    })
}

function Movies(title,poster,overview)
{this.title=title;
  this.poster=poster;
  this.overview=overview;

}
function Usmovie(title, overview,releaseDate,vote)
{this.title=title;
  this.overview=overview;
  this.releaseDate=releaseDate;
  this.vote=vote;

}
function Trending(id,title,releaseDate, poster, overview,)
{this.id=id;
  this.title=title;
  this.releaseDate=releaseDate;
  this.poster=poster;
  this.overview=overview;
  
 

}
function Film (name,originCountry, lang,vote,overview)
{this.name=name;
  this.originCountry=originCountry;
  this.lang=lang;
  this.vote=vote;
  this.overview=overview;
}
function filmHandler(req,res)
{
 
  let url =`https://api.themoviedb.org/3/top-rated?api_key=${apikey}&language=en-US&page=1`;
  axios.get(url)
  .then((result)=>{
    console.log(result.data.result)
    let shapeOfdata=result.data.results.map((rated)=>{
      return new Film(rated.name,rated.originCountry, rated.lang, rated.vote,rated.overview)
    })
    res.json(shapeOfdata);
  })
  .catch((err)=>{console.log(err);})

}
function searchHandler(req,res)
{
let reqClient=req.query.title;
let url =`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${clientRequest}&page=2`;
axios.get(url)
.then((result)=>{
  let reqMovie=result.data.results.map((movies)=>{
    return new Movies(movies.title, movies.poster,movies.overview)
  });
  res.json(reqMovie)
})
.catch((err)=>{console.log(err);})
}


function trendingPageHandler(req,res)
{
  let url =`https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}`;
  axios.get(url)
  .then((result)=>{
    let shapeOfdata=result.data.results.map((movies)=>{
  
  if('name' in Movies)
  {
    return new Trending (movies.id,movies.title,movis.releaseDate,movies.poster)

  }
  if('title' in Movies)
  {
    return new Trending (movies.id,movies.title,movis.releaseDate,movies.poster)
  }});
  res.json(shapeOfdata);
})
.catch((err)=>{
  console.log(err);
})

}
function favoritePagehandler(req,res)
{
let result=[];
let newMovie=new movies(movieData.title,movieData.poster,movieData.overview);
result.push(newMovie);
res.send(result);
}
function handleNotFoundError(req,res)
{
res.status(404).send("page is Not Found");

}
app.use (function(err,req,res,next)
{
  console.error(err.stack);
  res.status(500).send({
    status:500,
    responseText:`sorry `
  });
});

// function recipesHandler(req, res){
//   //axios.get(url).then().catch()
//   let url = `https://api.spoonacular.com/recipes/random?apiKey=${apikey}`;
//   axios.get(url)
//   .then((result)=>{
//       console.log(result.data.recipes);

//       let dataRecipes = result.data.recipes.map((recipe)=>{
//           return new DataQuery(recipe.title, recipe.readyInMinutes,recipe.image)
//       })
//       // res.json(result.data.recipes);
//       res.json(dataRecipes);
//   })
//   .catch((err)=>{
//       console.log(err);
//   })

// } 

// function search (req,res)
// {let reqName= req.query.name;
//   let url ='https://api.spoonacular.com/recipes/complexSearch?query=${reqName}&apiKey=${apikey}';
  
//   console.log(reqName);
//  axios.get(url)
//  .then((result)=>{
//   console.log(result.data.results);
//   let response= result.data.results;
//   res.json(response);
// })
// .catch((err)=>{
//   console.log(err)
// })
// }
// function DataQuery(title,time,image){
//   this.title=title;
//   this.time=time;
//   this.image=image;


// }
// axios.get(url)
//   .then(response => {
  
//     const trendingMovie = response.data.results[0];
//     const movieData = {
//       id: trendingMovie.id,
//       title: trendingMovie.title,
//       release_date: trendingMovie.release_date,
//       poster_path: trendingMovie.poster_path,
//       overview: trendingMovie.overview
//     };
//     console.log(movieData);
//   })
//   .catch(error => {
//     console.log(error);
//   });

  
client.connect().then(() => {

  app.listen(PORT, () => {
      console.log(`Server is listening ${PORT}`);
  });
})

