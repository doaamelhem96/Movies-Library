'use strict';   
const express= require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
const movieData=require(`./movieData.json`);
const {json}= require("express");
const http = require('http');
const PORT = process.env.PORT || 3000;
const apikey= process.env.API_KEY;
const{Client}=require('pg');
let url = `postgres://duaa:0000@localhost:5432/movies`;
const client=new Client(url);
//to read json file
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// using http methods for movie table lab-13
app.post('/addMovie' , addMovieHandler);
app.get('/getMovies' , getMovie);
//using http methods for movie table - Lab14
app.get('/getMovie/:getMoId', getIdAmovie);
app.put('/UPDATE/:updateMoId' , updateMovieHandler);
app.delete('/DELETE/:deltMoId' , deleteMovieHandler);

 app.get('/',HomePageHandler);
//using http method for movie - Lab12
app.get ('/favorit',favoritePagehandler);//
app.get('/search',searchHandler);
app.get('/trending',trendingPageHandler );
// app.get('/usually',Film );
app.get('/film',filmHandler);
app .get('*',handleNotFoundError);
function HomePageHandler(req,res)
{
console.log ("hi");
}
function addMovieHandler(req,res)
{
  console.log(req.body);
  let {title,poster,overview,comments} = req.body; // destructuring 
  // client.query(sql,values)
  let sql = `INSERT INTO movi (title,poster,overview,comments)
  VALUES ($1,$2,$3,$4) RETURNING *; `
  let values = [title,poster,overview,comments]
  client.query(sql,values).then((result)=>{
      console.log(result.rows)
    
      res.status(201).json(result.rows)
    }

    ).catch()
  }
    function updateMovieHandler(req,res)
    {console.log("hi");
      let updateMovies= req.params.updateMoId;
      let {title,poster,overview,comments}=req.body;
      let sql =`UPDATE movi SET title=$1 ,poster=$2, overview=$3,comments=$4
      WHERE id = $5 RETURNING *;`
      let values =[title,poster,overview,comments,updateMovies];
      client.query(sql,values) .then(result=>{
      
        res.send(result.rows)
    }).catch()
       
    }


function deleteMovieHandler(req,res)
{
  //let {recipeName} = req.params; //destructuring
  
  let deltMoId = req.params.deltMoId
  let sql=`DELETE FROM movi WHERE id = $1;` 
  let value = [deltMoId];
  client.query(sql,value).then(result=>{
      res.status(204).send("deleted");
  }).catch()
}
function getIdAmovie(req,res)
{
  
  let getMoId = req.params.getMoId;
  let sql =`SELECT * FROM movi WHERE id = $1 ;`
  let value=[getMoId];
  client.query(sql,value).then((result)=>{
      res.send(result.rows)
  })
  .catch()
  }


function getMovie(req,res)


{
  let sql =`SELECT * FROM movi`; //read all data from database table
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    }).catch()
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
  .catch();
 // .catch((err)=>{console.log(err);})

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
.catch()
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
.catch()


}
function favoritePagehandler(req,res)
{
let result=[];
let newMovie=new Movies(movieData.title,movieData.poster,movieData.overview);
result.push(newMovie);
res.send(result);
}
// function handleNotFoundError(req,res)
// {
// res.status(404).send("page is Not Found");

// }
function errorHandler(err, req, res, next) {
  if (!(res instanceof http.ServerResponse)) {
    return next(err);
  }

  res.status(500);
  res.json({ error: err });
}

// app.use (function(err,req,res,next)
// {
//   console.error(err.stack);
//   res.status(500).send({
//     status:500,
//     responseText:`sorry `
//   });
// });
function handleNotFoundError(error,req,res){
   
  res.status(500).send(error)
}



  
client.connect().then(()=>{
  app.listen(PORT,()=>{
      console.log(`listening on port${PORT}`);
  })

}).catch()

