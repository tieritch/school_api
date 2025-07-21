const {academicPeriodRepository,
  academicSubdivisionRepository,
  schoolYearRepository,
}=require('../repositories');
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
 *     AcademicPeriod:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 1st term
 *         academic_subdivision_id:
 *           type: integer
 *           example: 1
 *
 *
 */

router
/**
   * @swagger
   * tags:
   *   name: Academic-Periods
   *   summary: Academic period
   *   description: Academic period management endpoints.
   */

/**
  * @swagger
  * /academic_periods:
  *   get:
  *     summary: Get all academic periods
  *     tags: [Academic-Periods]
  *     responses:
  *       200:
  *         description: A list of academic periods
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

  .get('/academic_periods', accessByToken, accessByRole(['READ'],['academic_periods']),
    async(req,res)=>{
      const subdivs=await academicPeriodRepository.findAll();
      res.json(subdivs);
    })

/**
     * @swagger
     * /academic_periods/create:
     *   post:
     *     summary: creates an academic period
     *     tags: [Academic-Periods]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/AcademicPeriod"
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               description: returns the academic period
     *       400:
     *         content:
     *           applicaction/json:
     *             schema:
     *               type: object
     *
     *
     */
  .post('/academic_periods/create',accessByToken,accessByRole(['READ','CREATE'],['academic_periods']),
    [
      body('academic_subdivision_id').notEmpty().withMessage(' academic subdivision ID required')
        .isInt({min:1}).withMessage('Academic subdivision must be a positive integer')
        .custom(async(value)=>{
          const subdiv=await academicSubdivisionRepository.findBy({id:value});
          if(!subdiv){
            throw Error('This academic subdivision ID does not exist');
          }
          const numberOfPeriods=subdiv.number_of_periods;
          let allPeriods=await academicPeriodRepository.findAll();

          // filter periods of the relevant school year;
          allPeriods=allPeriods.filter(period=>period.academic_subdivision_id==value);

          // prevent insert if number of periods reaches the value set by numberOfPeriods
          if(allPeriods.length==numberOfPeriods){
            throw Error('The number of periods is enough for this school year');
          }
          return true;
        }),

      body('name').notEmpty().withMessage('Name of academic period required').escape()
        .custom(async(value,{req})=>{
          const period=await academicPeriodRepository.findBy({
            name:value.trim().toLowerCase(),
            academic_subdivision_id:req.body.academic_subdivision_id,
          });
          if(period){
            throw new Error('This academic period name already exist for the same school year');
          }
          return true;
        }),


    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const {name,academic_subdivision_id}=req.body;
      const period=await academicPeriodRepository.create({name,academic_subdivision_id,by:req.user.id});
      res.json(period);
    }),
  )


/**
 * @swagger
 * /academic_periods/update:
 *   patch:
 *     summary: change an existing academic period
 *     tags: [Academic-Periods]
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
 *               academic_subdivision_id:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified academic period
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
  .patch('/academic_periods/update',accessByToken, accessByRole(['READ','UPDATE'],['academic_periods']),
    [
      body('id').notEmpty().withMessage('academic period ID required')
        .isInt({min:1}).withMessage('academic period ID must be a positive integer')
        .custom(async(value)=>{
          const period=await academicPeriodRepository.findBy({id:value});
          if(!period){
            throw new Error('This academic period  does not exist');
          }
          return true;
        }),

      body('academic_subdivision_id').optional().notEmpty().withMessage(' academic subdivision ID required')
        .isInt({min:1}).withMessage('academic subdivbision_id must be a positive integer')
        .custom(async(value)=>{
          const subdiv=await academicSubdivisionRepository.findBy({id:value});
          if(!subdiv){
            throw new Error('This academic subdivision does not exist');
          }
          return true;
        }),

      body('name').optional().notEmpty().withMessage('academic period name required').escape()
        .custom(async(value,{req})=>{
          const whereCondition={};
          if(req.body.academic_subdivision_id){
            whereCondition.academic_subdivision_id=req.body.academic_subdivision_id;
          }
          whereCondition.name=value.trim().toLowerCase();
          const period=await academicPeriodRepository.findBy(whereCondition);
          if(period){
            throw new Error('This academic period name already exist for the same school year');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{

      const periodInfo={},whereCondition={};
      if(req.body.name)
      {periodInfo.name=req.body.name;}
      if(req.body.academic_subdivision_id)
      {periodInfo.academic_subdivision_id=req.body.academic_subdivision_id;}
      periodInfo.by=req.user.id;
      whereCondition.id=req.body.id;
      const period=await academicPeriodRepository.updateBy(periodInfo,whereCondition);
      res.json(period);
    }) )

/**
 * @swagger
 * paths:
 *  /academic_periods/remove/{id}:
 *   delete:
 *     summary: Delete an academic period
 *     description: Delete an academic period by its ID
 *     tags: [Academic-Periods]
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
  .delete('/academic_periods/remove/:id',accessByToken, accessByRole(['READ','DELETE'],['academic_periods']),
    [
      param('id').notEmpty().withMessage('academic period ID required').isInt({min:1})
        .isInt({min:1}).withMessage('academic period ID must be a positive integer')
        .custom(async(value)=>{
          const period=await academicPeriodRepository.findBy({id:value});
          if(!period){
            throw new Error('This academic period  does not exist');
          }
          return true;
        }),
    ],

    validateRequest,

    asyncHandler(async(req,res)=>{
      const {id}=req.params;
      const period=await academicPeriodRepository.remove({id});
      res.json(period);
    }));

module.exports=router;


