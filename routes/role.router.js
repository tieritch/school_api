const {roleRepository}=require('../repositories');
const {accessByToken,accessByRole}=require('../middlewares');
const {query,body,param,validationResult}=require('express-validator');
const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const router=express.Router();


/**
 * @swagger
 *components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         name: 
 *           type: string
 *         permission_ids:
 *           type: array
 *         by:
 *           type:integer
 *           
 */

 /**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */
router

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Role ID
 *                   name:
 *                     type: string
 *                     description: Role's name
 * 
 *                  
 */
.get('/roles',async(req,res)=>{
    const roles=await roleRepository.findAll();
    console.log(roles);
    res.json(roles);
})

/**
 * @swagger
 * /roles/create:
 *   post:
 *     summary: creates a role
 *     tags: [Roles] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Role"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the created role
 *       400:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *               
 *                          
 */
.post('/roles/create',
    accessByToken,accessByRole('admin','create'),
    [
        body('name').notEmpty().escape().trim().withMessage('role name required')
        .custom(async(value)=>{
            const role=await roleRepository.findBy({name:value.trim().toLowerCase()})
            if (role) {
                throw new Error('Role already exists');
            }
        } ),
        body('permission_ids').isArray({min:1}).withMessage('you must at least provide one permission for this role'),
        body('permission_ids.*').isInt().withMessage('An integer permission ID is required')
     ],

    async(req,res)=>{
        
        req.body.permission_ids=[...new Set(req.body.permission_ids)]; // to avoid duplicates
        const {name,by,permission_ids}=req.body;
        const errors = validationResult(req);            
        if (!errors.isEmpty()) {
           
           console.log(errors.array())
           return res.status(400).json({ errors: errors.array() });
        
        }
        
        try{
            const role=await roleRepository.create({name,by,permission_ids});
            console.log(role)
            res.send(role);
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:err.message});
        }
})


/**
 * @swagger
 * /roles/update:
 *   put:
 *     summary: change an existing role
 *     tags: [Roles] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *               name:
 *                 type: string
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
.put('/roles/update', accessByToken, [
     
    body('role_id').notEmpty().withMessage('role id required').isInt().withMessage(' role id required as integer type'),
    body('name').notEmpty().withMessage('role name required')
    .custom(async(value)=>{
        const role=await roleRepository.findBy({name:value.trim().toLowerCase()})
        if (role) {
            throw new Error('Role already exists');
        }
    } )

    ],
    
    async(req,res)=>{
        console.log('req.body');
        console.log(req.body);
        const {name,role_id}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){

            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        
        }
        try{

            const role=await roleRepository.updateBy({name},{id:role_id});
            console.log(role)
            res.json(role);

        }
       catch(err){
            
            console.log(err);
            res.status(500).json({error:'Server error'})
       }
})

/**
 * @swagger
 * paths:
 *  /roles/remove/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by his ID
 *     tags: 
 *       - Roles
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
.delete('/roles/remove/:id',accessByToken,accessByRole('admin','delete'),
    
    [
        param('id').notEmpty().withMessage('role id required').isInt().withMessage('role id required as integer type')
    ], 
     
    async(req,res)=>{
       
        console.log(req.params)
        const errors=validationResult(req);
        
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try{
            const user=await roleRepository.remove({id:req.params.id});
            console.log('deleted user:',user)
            res.json(user);
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:err.message})
        }
})
module.exports=router;