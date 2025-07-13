const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const knexInstance=require('./db/db_connect');
const app=express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost',
    credentials:true
}))
dotenv.config();
const port=process.env.PORT||8000;
console.log(`the port is :${process.env.PORT}`)
app.use(require('./routes/api_docs.router'));
app.use(require('./routes/user.router'));
app.use(require('./routes/role.router'));
app.use(require('./routes/school_year.router'));
app.use(require('./routes/grade.router'));
app.use(require('./routes/student.router'));
app.use(require('./routes/resource.router'));
app.use(require('./routes/enrollment.router'));
app.use(require('./routes/course_type.router'));
app.use(require('./routes/course.router'));
app.listen(port,()=>{
    console.log(`server on the port:${port}`)
})