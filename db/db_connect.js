const {Model}=require("objection");
const knex=require('knex');
const knexfile=require('./knexfile');
function db_connect(environment){
    let knexConnection;
    environment=(environment||'development').trim();
    environment=='development'?
    knexConnection=knex(knexfile.development):knex(knexfile.production)
    Model.knex(knexConnection);
    console.log('Hello from DB connection')
};
module.exports={db_connect};