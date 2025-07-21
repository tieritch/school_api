const {Model}=require("objection");
const knex=require('knex');
const knexfile=require('./knexfile');
function db_connect(environment){
  let knexInstance;
  environment=(environment||'development').trim();
  environment=='development'?
    knexInstance=knex(knexfile.development):knex(knexfile.production);
  Model.knex(knexInstance);
  console.log('Hello from DB connection');
  return knexInstance;
};
const knexInstance=db_connect(process.env.NODE_ENV);
module.exports=knexInstance;
