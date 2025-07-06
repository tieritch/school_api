const {schoolYearRepository}=require('../repositories');
const {accessByToken,accessByRole}=require('../middlewares');
const {query,body,param,validationResult}=require('express-validator');
const {createToken,}=require('../utils');
const express=require('express');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     SchoolYear:
 *       type: object
 *       properties:
 *         name: 
 *           type: string
 *         by:
 *           type: integer
 *        
 *           
 */

 router

 /**
  * @swagger
  * tags:
  *   name: School-Years
  *   description: School year management endpoints
  */

 /**
 * @swagger
 * /school_years:
 *   get:
 *     summary: Get all school years
 *     tags: [School-Years]
 *     responses:
 *       200:
 *         description: A list of school years
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The school year ID
 *                  
 *                  
 */
 .get('/school_years', async(req,res)=>{
    const years=await schoolYearRepository.findAll();
    console.log(years);
    res.json(years);
 })

 /**
 * @swagger
 * /school_years/create:
 *   post:
 *     summary: creates a school year
 *     tags: [School-Years] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SchoolYear"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the created school year
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
 .post('/school_years/create',accessByToken,
    [
     body('name').notEmpty().escape().trim().withMessage('year name required')
      .custom(async(value)=>{
        const year=await schoolYearRepository.findBy({name:value})
        if(year){
            throw new Error('School year already exists')
        }
        return true;
      })
    ], 
    async(req,res)=>{
        const {name}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const schoolYear=await schoolYearRepository.create({
                name,
                by:req.user.id,
            })
            res.json(schoolYear)
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({error:'Server error'})
        }
    })
 
  .put('/school_years/update',accessByToken,
    
    [
        body('id').notEmpty().withMessage('school year id required')
            .isInt({min:1}).withMessage('id must be a positive integer'),
        
        body('name').notEmpty().escape().trim().withMessage('school year name required')
            .custom(async(value)=>{
            const year=await schoolYearRepository.findBy({name:value})
            if(year){
                throw new Error('School year already exists')
            }
            return true;
        })
    ],
    
    async(req,res)=>{
        
        const {name,id}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const schoolYear=await schoolYearRepository.update({name},{id});
            res.json(schoolYear);
        }
        catch(err) {
            console.log(err.message);
            res.status(500).json({error:'Server error'})
        }
    })
 module.exports=router