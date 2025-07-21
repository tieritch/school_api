const {academicSubdivisionRepository,schoolYearRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const {asyncHandler}=require('../utils');
const { SchoolYear } = require('../models');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     AcademicSubdivision:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: semester
 *         school_year_id:
 *           type: integer
 *           example: 1
 *         number_of_periods:
 *           type: integer
 *           example: 3
 *
 *
 */

router
/**
  * @swagger
  * tags:
  *   name: Academic-Subdivisions
  *   summary: Academic subdivision
  *   description: Academic subdivision management endpoints.
  */

/**
  * @swagger
  * /academic_subdivisions:
  *   get:
  *     summary: Get all academic subdivisions
  *     tags: [Academic-Subdivisions]
  *     responses:
  *       200:
  *         description: A list of academic subdivisions
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
  */

  .get('/academic_subdivisions', accessByToken, accessByRole(['READ'],['academic_subdivisions']),
    async(req,res)=>{
      const subdivisions=await academicSubdivisionRepository.findAll();
      res.json(subdivisions);
    })

/**
     * @swagger
     * /academic_subdivisions/create:
     *   post:
     *     summary: creates an academic subdivision
     *     tags: [Academic-Subdivisions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/AcademicSubdivision"
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               description: returns the academic subdivision
     *       400:
     *         content:
     *           applicaction/json:
     *             schema:
     *               type: object
     *
     *
     */
  .post('/academic_subdivisions/create',accessByToken, accessByRole(['READ','CREATE'],['academic_subdivisions']),
    [
      body('school_year_id').notEmpty().withMessage('school year ID required').isInt({min:1}).withMessage('school year ID must be a positive integer')
        .custom(async(value)=>{
          const schoolYear=await schoolYearRepository.findBy({id:value});
          if(!schoolYear){
            throw new Error('This school year ID does not exist');
          }
          const academicSub=await academicSubdivisionRepository.findBy({school_year_id:value});
          if(academicSub){
            throw new Error('an academic subdivision already exist for this school year');
          }
          return true;
        }),

      body('name').notEmpty().withMessage('academic subdivision name required').escape()
        .custom(async(value)=>{
          const subdivision=await academicSubdivisionRepository.findBy({name:value.trim().toLowerCase()});
          if(subdivision){
            throw new Error('This academic subdivision already exist');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
      const {name,school_year_id,number_of_periods}=req.body;
      const subdivision=await academicSubdivisionRepository.create({name,school_year_id,number_of_periods,by:req.user.id});
      res.json(subdivision);
    }))

/**
 * @swagger
 * /academic_subdivisions/update:
 *   patch:
 *     summary: change an existing academic subdivision
 *     tags: [Academic-Subdivisions]
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
 *                 example: semester
 *               number_of_periods:
 *                 type: integer
 *                 example: 2
 *               school_year_id:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified academic subdivision
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
  .patch('/academic_subdivisions/update',accessByToken,accessByRole(['READ','UPDATE'],['academic_subdivisions']),
    [
      body('id').notEmpty().withMessage('academic subdivision ID required')
        .isInt({min:1}).withMessage('academic subdivision ID must be a positive integer')
        .custom(async(value)=>{
          const subdivision=await academicSubdivisionRepository.findBy({id:value});
          if(!subdivision){
            throw new Error('This academic subdivision does not exist');
          }
          return true;
        }),

      body('name').optional().notEmpty().withMessage('academic subdivision name required').escape()
        .custom(async(value)=>{
          const subdivision=await academicSubdivisionRepository.findBy({name:value.trim().toLowerCase()});
          if(subdivision){
            throw new Error('This academic subdivision already exist');
          }
          return true;
        }),

      body('number_of_periods').optional().notEmpty()
        .withMessage('Number of periods required')
        .isInt({min:1}).withMessage('Number of periods must be a positive integer'),

      body('school_year_id').optional().notEmpty().withMessage('school year ID required')
        .isInt({min:1}).withMessage('school year ID must be a positive integer')
        .custom(async(value)=>{
          const year=await schoolYearRepository.findBy({id:value});
          if(!year){
            throw new Error(' This school year ID does not exist');
          }
          return true;
        }),

    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const subdivisionInfo={},whereCondition={};
      if(req.body.name){
        subdivisionInfo.name=req.body.name;
      }
      if(req.body.number_of_periods){
        subdivisionInfo.number_of_periods=req.body.number_of_periods;
      }
      if(req.body.school_year_id){
        subdivisionInfo.school_year_id=req.body.school_year_id;
      }
      whereCondition.id=req.body.id;

      const academicSub=await academicSubdivisionRepository.updateBy(subdivisionInfo,whereCondition);
      res.json(academicSub);
    }))

/**
 * @swagger
 * paths:
 *  /academic_subdivisions/remove/{id}:
 *   delete:
 *     summary: Delete an academic subdivision
 *     description: Delete an academic subdivision by its ID
 *     tags: [Academic-Subdivisions]
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
  .delete('/academic_subdivisions/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['academic_subdivisions']),
    [
      param('id').notEmpty().withMessage('academic subdivision ID required')
        .isInt({min:1}).withMessage('academic subdivision ID must be a positive integer')
        .custom(async(value)=>{
          const subdivision=await academicSubdivisionRepository.findBy({id:value});
          if(!subdivision){
            throw new Error('This academic subdivision does not exist');
          }
          return true;
        }),
    ],
    validateRequest,

    asyncHandler(async(req,res)=>{

      const {id}=req.params;
      const subdivision=await academicSubdivisionRepository.remove({id});
      res.json(subdivision);
    }));

module.exports=router;
