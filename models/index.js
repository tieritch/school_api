const Role=require('./role');
const User=require('./user');
const Permission=require('./permission');
const RefreshToken=require('./refresh_token');
const Grade=require('./grade');
const Student=require('./student');
const SchoolYear=require('./school_year');
const Enrollment=require('./enrollment');
const Resource=require('./resource');
const CourseType=require('./course_type');
const Course=require('./course');
const StudentSequence=require('./stud_seq');
const CourseAssign=require('./course_assign');
const EvaluationType=require('./evaluation_type');
const Score=require('./score');
const AcademicSubdivision=require('./academic_subdivision');
const AcademicPeriod=require('./academic_period');
const academicPeriod = require('./academic_period');
module.exports={
    Role,
    User,
    Permission,
    RefreshToken,
    Grade,
    Student,
    SchoolYear,
    Enrollment,
    Resource,
    CourseType,
    Course,
    StudentSequence,
    CourseAssign,
    EvaluationType,
    Score,
    AcademicSubdivision,
    academicPeriod
}