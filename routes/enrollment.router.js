const{gradeRepository,schoolYearRepository,
  studentRepository,enrollmentRepository,
}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const { Enrollment } = require('../models');
const {asyncHandler}=require('../utils');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         grade_id:
 *           type: integer
 *           example: 1
 *         school_year_id:
 *           type: integer
 *           example: 1
 *         student_id:
 *           type: integer
 *           example: 1
 *
 *
 */

router
/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment management endpoints
 */


/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: A list of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     description: Student's name
 *                   lastname:
 *                     type: string
 *
 *
 */
  .get('/enrollments', async(req,res)=>{
    let students=await studentRepository.findAll().withGraphFetched('[schoolYears,grades]');
    // as a rule enrolled student is a student whose schoolYears array length > 0 and the same for grades
    students=students.filter(stud=>stud.schoolYears.length>0 && stud.grades.length>0);
    res.send(students);
  })

/**
 * @swagger
 * /enrollments/create:
 *   post:
 *     summary: creates a enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Enrollment"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created enrollment
 *       400:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *       500:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *
 */
  .post('/enrollments/create',accessByToken,accessByRole(['READ','CREATE'],['roles']),

    [
      body('student_id').notEmpty().withMessage(' student id required')
        .isInt({min:1}).withMessage('student id must be a positive integer')
        .custom(async(value,{req})=>{
          const student=await studentRepository.findBy({id:value});
          if(!student){
            throw new Error(' this student does not exist');
          }
          const studEnrol=await enrollmentRepository.findBy({
            student_id:value,
            grade_id:req.body.grade_id,
            school_year_id:req.body.school_year_id,
          });
          if(studEnrol){
            throw new Error(' this student already enrolled');
          }
          return true;
        }),
      body('school_year_id').notEmpty().withMessage('school year id required')
        .isInt({min:1}).withMessage('school id must be a positive integer')
        .custom(async(value)=>{
          const schoolYear=await schoolYearRepository.findBy({id:value});
          if(!schoolYear){
            throw new Error(' this school year does not exist');
          }
          return true;
        }),

      body('grade_id').notEmpty().withMessage(' grade id of student required')
        .isInt({min:1}).withMessage('grade id of student must be a positive integer')
        .custom(async(value)=>{
          const grade=await gradeRepository.findBy({id:value});
          if(!grade){
            throw new Error(' this grade does not exist');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
  
        const {student_id,school_year_id,grade_id}=req.body;
  
        const enrollment=await enrollmentRepository.create({student_id,school_year_id,grade_id});
        const stdWithGraph=await studentRepository
          .findAll().withGraphFetched('[grades,schoolYears]')
          .where({id:student_id});
        console.log(JSON.stringify(stdWithGraph,null,2));
        res.send(stdWithGraph[0]);
    }))

/**
 * @swagger
 * paths:
 *  /enrollments/remove/{id}:
 *   delete:
 *     summary: Delete an enrollment
 *     description: Delete an enrollment by its ID
 *     tags: [Enrollments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *       401:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
  .delete('/enrollments/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['enrolments']),
    [
      param('id').notEmpty().withMessage('enrollment id required').isInt({min:1}).withMessage('enrollment id require is an enteger type')
        .custom(async(value)=>{
          const enroll=await enrollmentRepository.findBy({id:value});
          console.log(enroll);
          if(!enroll){
            throw new Error('No such enrollement ID');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
      // console.log('DELETE HIT', req.params.id);
        const{id}=req.params;
        const enroll=await enrollmentRepository.remove({id});
        const stdWithGraph=await studentRepository
        .findAll().withGraphFetched('[grades,schoolYears]')
        .where({id:enroll[0].student_id});
        res.json(stdWithGraph);   
    }))


/**
 * @swagger
 * /enrollments/update:
 *   patch:
 *     summary: change an enrollment of a student
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               grade_id:
 *                 type: integer
 *                 example: 1
 *               school_year_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified enrollment
 *       400:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
  .patch('/enrollments/update', accessByToken, accessByRole(['READ','UPDATE']),

    [
      body('id').notEmpty().withMessage('enrollment id required').isInt({min:1}).withMessage('enrollment id must be a positive integer')
        .custom(async(value)=>{
          const enroll=await enrollmentRepository.findBy({id:value});
          if(!enroll){
            throw new Error('No such enrollment ID');
          }
          return true;
        }),

      body('grade_id').optional().notEmpty().withMessage('grade id required').isInt({min:1}).withMessage('grade ID must be a positive integer')
        .custom(async(value)=>{
          const grade=await gradeRepository.findBy({id:value});
          if(!grade){
            throw new Error('No such grade ID');
          }
          return true;
        }),

      body('school_year_id').optional().notEmpty().withMessage('school year id required')
        .isInt({min:1}).withMessage('school year ID must be a positive integer')
        .custom(async(value)=>{
          const year=await schoolYearRepository.findBy({id:value});
          if(!year){
            throw new Error('No such school year ID');
          }
          return true;
        }),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const enrollment={};
      if(req.body.grade_id){
        enrollment.grade_id=req.body.grade_id;
      }
      if(req.body.school_year_id){
        enrollment.school_year_id=req.body.school_year_id;
      }
      enrollment.id=req.body.id;
      const enroll=await enrollmentRepository.updateBy(
      {
        grade_id:enrollment.grade_id,
        school_year_id:enrollment.school_year_id,
       },{
          id:enrollment.id,
        });
       const stdWithGraph=await studentRepository
          .findAll().withGraphFetched('[grades,schoolYears]')
          .where({id:enroll[0].student_id});
        res.json(stdWithGraph);
    }));
module.exports=router;
