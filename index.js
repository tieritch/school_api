const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser');
//const {db_connect}=require('./db/db_connect');
const app=express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost',
    credentials:true
}))
dotenv.config();
//db_connect(process.env.NODE_ENV);
const port=process.env.PORT||8000;
console.log(`the port is :${process.env.PORT}`)
//process.env.PORT
const xss = require('xss');
/**
 *  fait la securisation des donnees
 * @param {string} input 
 * @returns {object}
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    console.log(' on est dasn 1ere conditon le string:'+input)
    return xss(input.trim());
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  } else if (input !== null && typeof input === 'object') {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
}
//app.use(require('./routes/user.router'));
app.use(require('./routes/api_docs.router'));
app.use(require('./routes/user.router'));
app.use(require('./routes/role.router'));
app.listen(port,()=>{
    console.log(`server on the port:${port}`)
})