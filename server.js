'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')
const { Client } = require('pg')
//postgres://username:password@localhost:5432/databasename
let url = `postgres://duaa:0000@localhost:5432/movies`;
const client = new Client(url)

const PORT = 3008;
const app = express();
app.use(express.json());
app.use(cors());
 app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
//routes
app.get('/', homeHandler);
app.post('/addRecipe',addRecipeHandler);
app.get('/getAllRecipes',getAllRecipesHandler);
app .get('*', errorHandler);


//functions
function errorHandler(err, req, res, next) {
  if (!(res instanceof http.ServerResponse)) {
    return next(err);
  }

  res.status(500);
  res.json({ error: err });
}
function  homeHandler(req,res){
    res.send("welcome to home page ");
}

function addRecipeHandler(req,res){
   
   
    let {name,comments} = req.body;  
    let sql = `INSERT INTO Films  (name,comments)
    VALUES ($1,$2) RETURNING *; `
    let values = [name,comments]
    client.query(sql,values).then((result)=>{
        console.log(result.rows)
       
        res.status(201).json(result.rows)

    }

    ).catch()

}

function getAllRecipesHandler(req,res) {
 
    let sql =`SELECT * FROM Films ;`; //read all data from database table
    client.query(sql).then((result)=>{
        console.log(result.rows);
        res.json(result.rows)
    }).catch()
}



client.connect().then(()=>{
  app.listen(PORT,()=>{
      console.log(`listening on port${PORT}`);
  })

}).catch()