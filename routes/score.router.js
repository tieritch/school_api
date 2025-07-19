const {
    scoreRepository,
    courseAssignRepository,
    courseRepository,
    studentRepository,
    evaluationTypeRepository
}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const router=express.Router();
const {asyncHandler}=require('../utils');

/**
 * @swagger
 *components:
 *   schemas:
 *     Score:
 *       type: object
 *       properties:
 *         course_assignment_id:
 *           type: integer
 *           example: 1
 *         earned_score:
 *           type: float
 *           example: 2
 *         student_id:
 *           type: integer
 *           example: 1
 *         evaluation_type_id:
 *           type: integer
 *           example: 1
 *
 */

 router

 /**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Score management endpoints
 */

 /**
 * @swagger
 * /scores:
 *   get:
 *     summary: Get all scores
 *     tags: [Scores]
 *     responses:
 *       200:
 *         description: A list of scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   course_assignment_id:
 *                     type: integer
 *                   student_id:
 *                     type: integer
 *                   evaluation_type_id:
 *                     type: integer
 *
 */
 .get('/scores', accessByToken, accessByRole(['READ'],['scores']), async(req,res)=>{
    const scores=await scoreRepository.findAll();
    res.send(scores);
  })

/**
 * @swagger
 * /scores/create:
 *   post:
 *     summary: creates a score for every student in every course
 *     tags: [Scores] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Score"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the created score
 *       400:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *               
 *                          
 */
.post('/scores/create', accessByToken, accessByRole(['READ','CREATE'],['scores']),
    [
        body('course_assignment_id').notEmpty().withMessage('course assignement ID required')
            .isInt({min:1}).withMessage('course assigment ID must be a positive integer')
            .custom(async(value)=>{
                const assign=await courseAssignRepository.findBy({id:value});
                if(!assign){
                    throw new Error(' this course assignment ID does not exist')
                }
                return true
            }),
        
        body('evaluation_type_id').notEmpty().withMessage('Evaluation type ID required')
        .isInt({min:1}).withMessage('Evaluation type ID must be a positive integer')
        .custom(async(value)=>{
            const type=await evaluationTypeRepository.findBy({id:value});
            if(!type){
                throw new Error(' this evaluation ID does not exist')
            }
            return true
        }),

        body('student_id').notEmpty().withMessage('Student ID required')
        .isInt({min:1}).withMessage('student ID must be a positive integer')
        .custom(async(value)=>{
            const student=await studentRepository.findBy({id:value});
            if(!student){
                throw new Error(' this student ID does not exist')
            }
            return true
        }),
        
        body('earned_score').notEmpty().withMessage('Student ID required').isFloat({min:0}).withMessage('earned score must be positive')
        .custom( async(value,{req})=>{
           
            // first of all let's find the relevant course
            const assign= await courseAssignRepository.findBy({id: req.body.course_assignment_id});
            const course=await courseRepository.findBy({id:assign.course_id});
            
            if (!course) throw new Error('Course not found');
            
            if(value>course.max_score){
                throw new Error(` earned score cannot exceed max:${course.max_score}`);
            }
            return true;
        })

    ],
    
    validateRequest, 
   
    asyncHandler(async(req,res)=>{
        
        const{earned_score,course_assignment_id,student_id,evaluation_type_id}=req.body;
        
        const score=await scoreRepository.create({earned_score,course_assignment_id,student_id,evaluation_type_id,by:req.user.id})
        res.json(score)
    }) )

  module.exports=router;


