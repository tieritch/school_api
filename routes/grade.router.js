const {gradeRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const router=express.Router();
const {asyncHandler}=require('../utils');
/**
 * @swagger
 *components:
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 6th grade
 *
 *
 */
router
/**
 * @swagger
 * tags:
 *   name: Grades
 *   summary: By grade we mean class
 *   description: Grade management endpoints. By grade we mean class (level).
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: A list of grades
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
  .get('/grades',accessByToken, accessByRole(['READ'],['grades']), async(req,res)=>{
    const grades=await gradeRepository.findAll();
    res.json(grades);
  })

/**
 * @swagger
 * /grades/create:
 *   post:
 *     summary: creates a grade
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Grade"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created grade
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
  .post('/grades/create',accessByToken, accessByRole(['READ','CREATE'],['grades']),
    [
      body('name').notEmpty().escape().trim().withMessage('grade name required')
        .custom(async(value)=>{
          console.log('value',value.trim());
          const year=await gradeRepository.findBy({name:value.trim()});
          if(year){
            throw new Error('School year already exists');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
      const {name}=req.body;
      const grade=await gradeRepository.create({name,by:req.user.id});
      res.json(grade);
    }))


/**
 * @swagger
 * /grades/update:
 *   put:
 *     summary: change an existing grade
 *     tags: [Grades]
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
 *                 example: 2nd grade
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified grade
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
  .put('/grades/update',accessByToken, accessByRole(['READ','UPDATE'],['grades']),
    [
      body('id').notEmpty().withMessage('grade id required')
        .isInt({min:1}).withMessage('id must be a positive integer'),

      body('name').notEmpty().escape().trim().withMessage('grade name required')
        .custom(async(value)=>{
          const grade=await gradeRepository.findBy({name:value});
          if(grade){
            throw new Error('this grade already exists');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
      const {name,id}=req.body;
      const grade=await gradeRepository.updateBy({name,by:req.user.id},{id});
      res.json(grade);
    }))


/**
 * @swagger
 * paths:
 *  /grades/remove/{id}:
 *   delete:
 *     summary: Delete a grade
 *     description: Delete a grade by its ID
 *     tags:
 *       - Grades
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
  .delete('/grades/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['grades']),
    [
      param('id').notEmpty().withMessage('grade id required').isInt({min:1})
        .withMessage('grade id must be a positive integer'),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const {id}=req.params;
      const grade=await gradeRepository.remove({id});
      res.json(grade);
    }));

module.exports=router;
