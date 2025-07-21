const {courseRepository,courseTypeRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const {asyncHandler}=require('../utils');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Math
 *         max_score:
 *           type: integer
 *           example: 30
 *         course_type_id:
 *           type: integer
 *           example: 1
 *
 *
 */
router
/**
  * @swagger
  * tags:
  *   name: Courses
  *   summary: course
  *   description: course management endpoints.
  */

  /**
  * @swagger
  * /courses:
  *   get:
  *     summary: Get all course
  *     tags: [Courses]
  *     responses:
  *       200:
  *         description: A list of course
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  *                 properties:
  *                   id:
  *                     type: integer
  *                   name:
  *                     type: string
  *
  *
  */
  .get('/courses', accessByToken, accessByRole(['READ'],['courses']),
    async(req,res)=>{
      let courses=await courseTypeRepository.findAll()
        .withGraphFetched('courses(courseInfo)')
        .modifiers({
          courseInfo: builder => {
            builder.select('id','name','max_score','course_type_id');
          }});
      courses=courses.filter(type=>type.courses.length!=0 ).map(({name,id,courses})=>
        ({course_type:name.toUpperCase(),course_type_id:id,
          courses:courses.map(({id,name,max_score})=>({id,name,max_score})),
        }));
      res.json(courses);
    })

  /**
 * @swagger
 * /courses/create:
 *   post:
 *     summary: creates a course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Course"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created course
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
  .post('/courses/create',accessByToken, accessByRole(['READ','CREATE'],['courses']),
    [
      body('name').notEmpty().withMessage('name of course required').escape()
        .custom(async(value)=>{
          const course=await courseRepository.findBy({name:value.trim().toLowerCase()});
          if(course){
            throw new Error('this course already exists');
          }
          return true;
        }),

      body('max_score').notEmpty().withMessage(' max score required').isInt({min:1}).withMessage('max score must be a positive nteger'),

      body('course_type_id').notEmpty().withMessage('course type ID required')
        .isInt({min:1}).withMessage('course type ID must be a positive nteger')
        .custom(async(value)=>{
          const type=await courseTypeRepository.findBy({id:value});
          console.log('type', type);
          if(!type){
            throw new Error(' this course type ID does not exist');
          }
          return true;
        }),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const {name,course_type_id,max_score}=req.body;
      const course=await courseRepository.create({name,course_type_id,max_score,by:req.user.id});
      res.json(course);
    }))

/**
 * @swagger
 * /courses/update:
 *   put:
 *     summary: change an existing course
 *     tags: [Courses]
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
 *               name:
 *                 type: string
 *                 example: History
 *               max_score:
 *                 type: integer
 *                 example: 10
 *               course_type_id:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified course
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
  .put('/courses/update',accessByToken,accessByRole(['READ','UPDATE'],['scores']),
    [
      body('id').notEmpty().withMessage('course ID required').isInt({min:1}).withMessage('course ID must be a positive integer')
        .custom(async(value)=>{
          const course=await courseRepository.findBy({id:value});
          if(!course){
            throw new Error('This course ID does not exist');
          }
          return true;
        }),

      body('name').optional().notEmpty().withMessage('course name required').escape()
        .custom(async(value)=>{
          console.log('value',value);
          const course=await courseRepository.findBy({name:value.trim().toLowerCase()});
          if(course){
            throw new Error('This course name already in use');
          }
          return true;
        }),

      body('course_type_id').optional().notEmpty().withMessage('course type ID required').isInt({min:1}).withMessage('course type ID must be a positive integer')
        .custom(async(value)=>{
          const type=await courseTypeRepository.findBy({id:value});
          if(!type){
            throw new Error('This course type does not exist');
          }
          return true;
        }),

      body('max_score').optional().notEmpty().withMessage('course max_score required').isInt({min:1}).withMessage('max score must be a positive integer'),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const courseInfo={};
      if(req.body.name){
        courseInfo.name=req.body.name;
      }
      if(req.body.course_type_id){
        courseInfo.course_type_id=req.body.course_type_id;
      }
      if(req.body.max_score){
        courseInfo.max_score=req.body.max_score;
      }
      courseInfo.by=req.user.id;
      const whereCondition={id:req.body.id};
      const course=await courseRepository.updateBy(courseInfo,whereCondition);
      res.json(course);
    }))

/**
 * @swagger
 * paths:
 *  /courses/remove/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete a course by its ID
 *     tags: [Courses]
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
  .delete('/courses/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['courses']),
    [
      param('id').notEmpty().withMessage('course ID required').isInt({min:1}).withMessage('courseID must be a positive integer')
        .custom(async(value)=>{
          const course=await courseRepository.findBy({id:value});
          if(!course){
            throw new Error(' this course ID does not exist');
          }
          return true;
        }),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const {id}=req.params;
      const course=await courseRepository.remove({id});
      res.json(course);
    }));

module.exports=router;
