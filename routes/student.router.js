const {studentRepository}=require('../repositories');
const {accessByToken,accessByRole}=require('../middlewares');
const {query,body,param,validationResult}=require('express-validator');
const {createToken,generateHexStudentNumber}=require('../utils');
const express=require('express');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         firstname: 
 *           type: string
 *         lastname:
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
 *   name: Students
 *   description: Student management endpoints.
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                    
 *                  
 */
.get('/students',async(req,res)=>{
    const students=await studentRepository.findAll();
    console.log(students);
    res.json(students);
})

 /**
 * @swagger
 * /students/create:
 *   post:
 *     summary: register a student
 *     tags: [Students] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Student"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the created student
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
 .post('/students/create',accessByToken,
    
    [
        body('firstname').notEmpty().escape().trim().withMessage('first name required'),
        body('lastname').notEmpty().escape().trim().withMessage('last name required'), 
    ],
    
    async(req,res)=>{
        req.body.student_number=await generateHexStudentNumber();
        const {firstname,lastname,student_number}=req.body;
        console.log(req.body);

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const student=await studentRepository.create({firstname,lastname,student_number,by:req.user.id});
            res.json(student);
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({error:'Server Error'});
        }
    })
  
  /**
 * @swagger
 * paths:
 *  /students/remove/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Delete a student by his ID
 *     tags: 
 *       - Students
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
.delete('/students/remove/:id',accessByToken,
    [
        param('id').notEmpty().withMessage('student id required').isInt({min:1})
        .withMessage('student id must be a positive integer')
    ],
  async(req,res)=>{

    const {id}=req.params;
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    try{
       const student=await studentRepository.remove({id});
       res.json(student); 
    }   
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Server Error'});
    }
  })  

 /**
 * @swagger
 * /students/by_admin:
 *   patch:
 *     summary: this endpoint is used by admin to modify student's profile
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_number:
 *                 type: string
 *                 example: 2025-000-000-0A1
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               by: 
 *                 type: integer
 *     responses:
 *       200 :
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
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
.patch('/students/by_admin',accessByToken,
    [
        body('student_number').notEmpty().withMessage('student_number required')
            .custom( async(value)=>{
                const student=await studentRepository.findBy({student_number:value.trim().toUpperCase()})
                if (!student) {
                   throw new Error('Student does not exist');
                 }
                 return true;
             }),

        body('firstname')
            .optional().escape().trim()
            .notEmpty().withMessage('First name cannot be empty'),
  
        body('lastname').optional().escape().trim()
            .notEmpty().withMessage('Last name cannot be empty'),

    ],
    async(req,res)=>{
      
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const st=req.body;
            let studProfile={};
            if(st.firstname)
                studProfile.firstname=st.firstname;
            if(st.lastname)
                studProfile.lastname=st.lastname;
            studProfile.by=st.by;
            const stud=await studentRepository.updateBy(studProfile,{student_number:st.student_number})
            res.json(stud);
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({error:'Server Error'});
        }
    }
)

module.exports=router;


