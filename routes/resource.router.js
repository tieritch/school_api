const {resourceRepository}=require('../repositories');
const {accessByToken,accessByRole}=require('../middlewares');
const {query,body,param}=require('express-validator');
const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();

router

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management endpoints. By Resources we mean database tables
 */
/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: A list of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Resource ID
 *                   name:
 *                     type: string
 *                     description: Resource's name
 *
 *
 */
  .get('/resources',async(req,res)=>{
    const resources=await resourceRepository.findAll();
    res.json(resources);
  });
module.exports=router;
