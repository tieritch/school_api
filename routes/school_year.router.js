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
        const year=await schoolYearRepository.findBy({name:value.trim()})
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
 
    /**
 * @swagger
 * /school_years/update:
 *   put:
 *     summary: change an existing school year
 *     tags: [School-Years] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school_year_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: 2024-2025 or 2024/2025
 *              
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modifiedd role
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
  .put('/school_years/update',accessByToken,
    
    [
        body('school_year_id').notEmpty().withMessage('school year id required')
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
        
        const {name,school_year_id}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const schoolYear=await schoolYearRepository.update(
                {name},
                {id:school_year_id}
           );
            res.json(schoolYear);
        }
        catch(err) {
            console.log(err.message);
            res.status(500).json({error:'Server error'})
        }
    })

  /**
 * @swagger
 * paths:
 *  /school_years/remove/{id}:
 *   delete:
 *     summary: Delete school year
 *     description: Delete a school year by its ID
 *     tags: 
 *       - School-Years
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
  .delete('/school_years/remove/:id',accessByToken,
    [
        param('id').notEmpty().withMessage('school year id required').isInt({min:1}).withMessage('school year id must be a positive integer')
    ],
    async(req,res)=>{

        const {id}=req.params;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
         }
        try{
            const schoolYear=await schoolYearRepository.remove({id});
            console.log('________________')
            console.log(schoolYear);
            res.json(schoolYear);
        } 
        catch(err){
            console.log(err.message);
            res.status(500).json({error:err.message});
        }
  })  
 module.exports=router