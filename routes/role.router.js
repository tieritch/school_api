const {roleRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const {asyncHandler}=require('../utils');
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
 *           example: [1,2,3]
 *         resource_ids:
 *           type: array
 *           example: [2,3]
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
.get('/roles',accessByToken,accessByRole(['READ'],['roles']),
  async(req,res)=>{
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
    
    accessByToken, accessByRole(['READ','CREATE'],['roles']),
    
    [
        body('name').notEmpty().escape().trim().withMessage('role name required')
        .custom(async(value)=>{
            const role=await roleRepository.findBy({name:value.toLowerCase()})
            console.log("role",role)
            if (role) {
                throw new Error('Role already exists');
            };
            return true;
        } ),
        
        body('permission_ids').isArray({min:1}).withMessage('you must at least provide one permission for this role'),
        body('permission_ids.*').isInt().withMessage('An integer permission ID is required'),
        body('resource_ids').isArray({min:1}).withMessage('you must at least provide one resource for this role')
     ],
    
    validateRequest,

    asyncHandler(async(req,res)=>{
        
        req.body.permission_ids=[...new Set(req.body.permission_ids)]; // to avoid duplicates
        req.body.resource_ids=[...new Set(req.body.resource_ids)];
        const {name,by,permission_ids,resource_ids}=req.body;
    
        const role=await roleRepository.create({name,by:req.user.id,permission_ids,resource_ids});
        res.send(role)      
  }))


/**
 * @swagger
 * /roles/update:
 *   patch:
 *     summary: change an existing role
 *     tags: [Roles] 
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
 *               permission_ids:
 *                 type: array
 *                 example: [1,2,3,4]
 *               resource_ids:
 *                 type: array
 *                 example: [1,5,3]
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
.patch('/roles/update', accessByToken,accessByRole(['UPDATE','READ'],['roles']), 
    
   [
     
    body('id').notEmpty().withMessage('role id required').isInt().withMessage(' role id required as integer type')
    .custom(async(value)=>{        
         const role=await roleRepository.findBy({id:value})
         if (role && role.name=='admin') {
             throw new Error('This role is protected');
         }
     } ),

    body('name').notEmpty().withMessage('role name required')
    .custom(async(value)=>{
        const role=await roleRepository.findBy({name:value.trim().toLowerCase()})
        if (role && parseInt(role.id)==value.id) {
            throw new Error('Role already exists');
        }
    } ),
    body('permission_ids.*').isInt().withMessage('An integer permission ID is required'),
    body('resource_ids.*').isInt().withMessage('An integer resource ID is required')

    ],
    
    validateRequest,

    asyncHandler(async(req,res)=>{
       
        req.body.permission_ids=[...new Set(req.body.permission_ids)]; // to avoid duplicates
        req.body.resource_ids=[...new Set(req.body.resource_ids)];
        const {name,id,by,permission_ids,resource_ids}=req.body;
        const role=await roleRepository.updateBy(
            {name,permission_ids,resource_ids,role_id:id},
            {id}
        );
       res.json(role);
}))

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
.delete('/roles/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['roles']),
    
    [
        param('id').notEmpty().withMessage('role id required').isInt().withMessage('role id required as integer type')
          .custom(async(value)=>{
             const role=await roleRepository.findBy({id:value});
             if(role && role.name=='admin'){
                throw new Error('this role is protected');
             }
          })
    ], 
    
    validateRequest,

    asyncHandler(async(req,res)=>{

    const user=await roleRepository.remove({id:req.params.id});
    res.json(user);
}))
module.exports=router;