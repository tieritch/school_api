const {courseTypeRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const router=express.Router();
const {asyncHandler}=require('../utils');
/**
 * @swagger
 *components:
 *   schemas:
 *     CourseType:
 *       type: object
 *       properties:
 *         name: 
 *           type: string
 *           example: technical
 *        
 *           
 */
 router
 /**
  * @swagger
  * tags:
  *   name: Course-Types
  *   summary: course type
  *   description: course type management endpoints.
  */
 /**
 * @swagger
 * /course_types:
 *   get:
 *     summary: Get all course types
 *     tags: [Course-Types]
 *     responses:
 *       200:
 *         description: A list of course types
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
 .get('/course_types', accessByToken, accessByRole(['READ'],['course_types']), 
    async(req,res)=>{
        const types=await courseTypeRepository.findAll();
        res.json(types);
})

 /**
 * @swagger
 * /course_types/create:
 *   post:
 *     summary: creates a course type
 *     tags: [Course-Types] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseType"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created course type
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object         
 *                          
 */
.post('/course_types/create',accessByToken, accessByRole(['READ','CREATE'],['course_types']),
    [
        body('name').notEmpty().withMessage('name of course type required')
            .custom(async(value)=>{
                const type=await courseTypeRepository.findBy({name:value.trim().toLowerCase()});
                if(type){
                    throw new Error('this course type already exists')
                }
                return true;
            }),

    ], 
    
    validateRequest,

    asyncHandler(async(req,res)=>{
    
        const {name}=req.body;
        
        const course=await courseTypeRepository.create({name,by:req.user.id});
        res.json(course);
 }))


/**
 * @swagger
 * /course_types/update:
 *   put:
 *     summary: change an existing course type
 *     tags: [Course-Types] 
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
 *                 example: General
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified course type
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
.put('/course_types/update',accessByToken,accessByRole(['READ','UPDATE'],['course_types']),
    [
        body('id').notEmpty().withMessage('id of course type required').isInt({min:1}).withMessage('id must be a positive integer')
        .custom(async(value)=>{
            const type=await courseTypeRepository.findBy({id:value});
            if(!type){
                throw new Error('this course type does not exist')
            }
            return true;
        }),
        
        body('name').notEmpty().withMessage(' course type name required')
        .custom(async(value)=>{
            const type=await courseTypeRepository.findBy({name: value.trim().toLowerCase()});
            if(type){
                throw new Error('this course type already exist')
            }
        })
    ],
    
    validateRequest,

    asyncHandler(async(req,res)=>{
        
        const {name,id}=req.body;
        const type=await courseTypeRepository.updateBy({name},{id});
        res.json(type);
  }))

/**
 * @swagger
 * paths:
 *  /course_types/remove/{id}:
 *   delete:
 *     summary: Delete a course type
 *     description: Delete a course type by its ID
 *     tags: [Course-Types]
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
.delete('/course_types/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['course_types']),
  [
    param('id').notEmpty().withMessage('course type ID required').isInt({min:1})
        .withMessage('course type ID id must be a positive integer')
  ],

  validateRequest,

  asyncHandler(async(req,res)=>{
        const {id}=req.params;

        const type=await courseTypeRepository.remove({id});
        res.json(type);
  }))
module.exports=router;