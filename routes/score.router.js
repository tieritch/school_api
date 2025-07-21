const {
    scoreRepository,
    courseAssignRepository,
    courseRepository,
    studentRepository,
    enrollmentRepository,
    schoolYearRepository,
    evaluationTypeRepository,
    academicPeriodRepository,
    academicSubdivisionRepository
}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const router=express.Router();
const {asyncHandler}=require('../utils');
const schoolYeaRepository = require('../repositories/school_year.repository');

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
 *         academic_period_id:
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
            .custom(async(value,{req})=>{
                const assign=await courseAssignRepository.findBy({id:value});
                if(!assign){
                    throw new Error(' this course assignment ID does not exist')
                }
                const period=await academicPeriodRepository.findBy({id:req.body.academic_period_id});
                const subdiv=await academicSubdivisionRepository.findBy({id:period.academic_subdivision_id});
    
                if(subdiv.school_year_id!=assign.school_year_id){
                    throw new Error('The course assignment and the subdivision must belong to the same school year.')
                }
                //Check whether the student has already received a score for this course and academic period, 
                // and prevent assigning a score a second time
                const score=await scoreRepository.findBy({
                    student_id:req.body.student_id,
                    course_assignment_id:value,
                    academic_period_id:req.body.academic_period_id
                })
                if(score){
                    throw new Error('the student has already received a score for this course and academic period')
                }
                return true
            }),
        
        body('academic_period_id').notEmpty().withMessage('academic period ID required')
            .isInt({min:1}).withMessage('academic period ID required')
            .custom(async(value)=>{
                const period=await academicPeriodRepository.findBy({id:value})
                if(!period){
                    throw new Error(' this academic period ID does not exist')
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
            const student=await enrollmentRepository.findBy({id:value});
            if(!student){
                throw new Error(' this student ID does not exist or the student is not enrolled.')
            }
            return true
        }),
        
        body('earned_score').notEmpty().withMessage('Earned score required').isFloat({min:0}).withMessage('earned score must be positive')
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
        
       const{earned_score,course_assignment_id,student_id,
        evaluation_type_id,academic_period_id}=req.body;
        
        const score=await scoreRepository.create({
            earned_score,
            course_assignment_id,
            student_id,
            evaluation_type_id,
            academic_period_id,
            by:req.user.id})
        res.json(score);
    }) )

  /**
 * @swagger
 * paths:
 *  /scores/remove/{id}:
 *   delete:
 *     summary: Delete a score
 *     description: Delete a score by his ID
 *     tags: 
 *       - Scores
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
  .delete('/scores/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['scores']),
    [
        param('id').notEmpty().withMessage('score ID required')
            .isInt({min:1}).withMessage('score ID must be a positive integer')
            .custom(async(value,{req})=>{
                
                const score=await scoreRepository.findBy({id:value});
                if(!score){
                    throw new Error('This score ID does not exist');
                }
                
                return true

        }),
    ],
 
    validateRequest,

    asyncHandler(async(req,res)=>{

    const {id}=req.params;
    const score=await scoreRepository.remove({id});
    res.json(score);  
}) ) 



/**
 * @swagger
 * /scores/update:
 *   patch:
 *     summary: change an existing score
 *     tags: [Scores]
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
 *               earned_score:
 *                 type: float
 *                 example: 20.5
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified score
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
 .patch('/scores/update',accessByToken,accessByRole(['READ','UPDATE'],['scores']),
    [
        body('id').notEmpty().withMessage('score ID required')
            .isInt({min:1}).withMessage('score ID must be a pisitive integer')
            .custom(async(value,{req})=>{
                const score=await scoreRepository.findBy({id:value});
                if(!score){
                    throw new Error('This score ID does not exist');
                }
                // first of all let's find the relevant course
                const assign=await courseAssignRepository.findBy({id:score.course_assignment_id});
                const course=await courseRepository.findBy({id:assign.course_id});
               
                //Check whether  earned score exceeds max for this course
                // and prevent assigning the score 
                if(req.body.earned_score > course.max_score){
                    throw new Error(` earned score cannot exceed max:${course.max_score}`);
                }
                
                return true

            }),

        body('earned_score').notEmpty().withMessage('Earned score required')
            .isFloat({min:0}).withMessage('earned score must be positive')

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

        let scoreInfo={},whereCondition={};
        scoreInfo.earned_score=req.body.earned_score;
        scoreInfo.by=req.user.id
        whereCondition.id=req.body.id;
        const score=await scoreRepository.updateBy(scoreInfo,whereCondition);
        res.json(score);
    }))   
  
    module.exports=router;


