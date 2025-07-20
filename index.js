const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost',
  credentials:true,
}));
dotenv.config();
require('./db/db_connect');
const port=process.env.PORT||8000;
//console.log(`the port is :${process.env.PORT}`);
app.use(require('./routes/api_docs.router'));
app.use(require('./routes/user.router'));
app.use(require('./routes/role.router'));
app.use(require('./routes/school_year.router'));
app.use(require('./routes/grade.router'));
app.use(require('./routes/student.router'));
app.use(require('./routes/academic_subdivision.router'));
app.use(require('./routes/academic_period.router'));
app.use(require('./routes/resource.router'));
app.use(require('./routes/enrollment.router'));
app.use(require('./routes/course_type.router'));
app.use(require('./routes/course.router'));
app.use(require('./routes/score.router'));
app.use(require('./routes/course_assign.router'));
app.use(require('./routes/evaluation_type.router'));

// error middleware 
app.use((err, req, res, next) => {
  
  console.error(err.message);
  const status = err.status || 500;
  
  // If it's a validation error
  if (err.details) {
    return res.status(status).json({
      error: 'Validation failed',
      details: err.details,
    });
  }
  // Otherwise, a generic server error
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});
app.listen(port,()=>{
  console.log(`server on the port:${port}`);
});
