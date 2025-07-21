const {evaluationTypeRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const router=express.Router();
const {asyncHandler}=require('../utils');

/**
 * @swagger
 *components:
 *   schemas:
 *     EvaluationType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Course Work"
 *
 *
 */

router
/**
  * @swagger
  * tags:
  *   name: Evaluation-Types
  *   summary: evaluation type
  *   description: evaluation type management endpoints.
  */

/**
 * @swagger
 * /evaluation_types:
 *   get:
 *     summary: Get all evaluation types
 *     tags: [Evaluation-Types]
 *     responses:
 *       200:
 *         description: A list of evaluation types
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
  .get('/evaluation_types', accessByToken,accessByRole(['READ'],['evaluation_type']),

    async(req,res)=>{

      const evaluationTypes=await evaluationTypeRepository.findAll();
      res.json(evaluationTypes);
    })


/**
 * @swagger
 * /evaluation_types/create:
 *   post:
 *     summary: creates an evaluation type
 *     tags: [Evaluation-Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EvaluationType"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created evaluation type
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
  .post('/evaluation_types/create', accessByToken,accessByRole(['READ','CREATE'],['evaluation_types']),
    [
      body('name').notEmpty().withMessage('Evaluation\'s name required').escape()
        .custom(async(value)=>{
          const type=await evaluationTypeRepository.findBy({name:value.trim().toLowerCase()});
          if(type){
            throw new Error('this course type already exists');
          }
          return true;
        }),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      console.log('req body:',req.body);
      const {name}=req.body;
      const type=await evaluationTypeRepository.create({name,by:req.user.id});
      res.json(type);
    },
    ))

/**
 * @swagger
 * paths:
 *  /evaluation_types/remove/{id}:
 *   delete:
 *     summary: Delete aan evaluation type
 *     description: Delete a evaluation type by its ID
 *     tags: [Evaluation-Types]
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
  .delete('/evaluation_types/remove/:id', accessByToken,accessByRole(['READ','DELETE'],['evaluation_types']),
    [
      param('id').notEmpty().withMessage('Evaluation type ID required').isInt({min:1}).withMessage('Evaluation type ID must be an positive integer')
        .custom(async(value)=>{
          const type=await evaluationTypeRepository.findBy({id:value});
          if(!type){
            throw new Error('This evaluation type does not exist ');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const {id}=req.params;
      const type=await evaluationTypeRepository.remove({id});
      res.json(type);
    },
    ))

/**
 * @swagger
 * /evaluation_types/update:
 *   put:
 *     summary: change an existing evaluation type
 *     tags: [Evaluation-Types]
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
 *                 example: Exam
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
  .put('/evaluation_types/update',accessByToken,accessByRole(['READ','UPDATE'],['evaluation_types']),

    [
      body('id').notEmpty().withMessage('Evaluation type ID required').isInt({min:1}).withMessage('Evaluation type ID must be a positive integer')
        .custom(async(value)=>{
          const type=await evaluationTypeRepository.findBy({id:value});
          if(!type){
            throw new Error('This evaluation type ID does not exist ');
          }
          return true;
        }),

      body('name').notEmpty().withMessage('Evaluation name required')
        .custom(async(value)=>{
          const type=await evaluationTypeRepository.findBy({name:value.trim().toLowerCase()});
          if(type){
            throw new Error('This evaluation type already exists ');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler( async(req,res)=>{

      const {name,id}=req.body;
      console.log(req.body);
      const whereCondition={},entityInfo={};
      entityInfo.name=name;
      whereCondition.id=id;
      const type=await evaluationTypeRepository.updateBy(entityInfo,whereCondition);
      res.json(type);
    }),
  );

module.exports=router;
