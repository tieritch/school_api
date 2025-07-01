const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerDef=require('../docs/swagger_def');

//const swaggerDocument = require('./swagger.json');
//console.log(swaggerDef)
const options={
  swaggerDefinition:swaggerDef,
  apis:['./routes/*.js'],
}
const express=require('express');
const router=express.Router();
const swaggerSpec=swaggerJsDoc(options);
//console.log(swaggerSpec);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports=router;