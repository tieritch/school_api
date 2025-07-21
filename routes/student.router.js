const {studentRepository}=require('../repositories');
const {accessByToken,accessByRole, validateRequest}=require('../middlewares');
const {query,body,param}=require('express-validator');
const {generateHexStudentNumber,asyncHandler}=require('../utils');
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
.get('/students',accessByToken, async(req,res)=>{
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
 *               type: object
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
 .post('/students/create',accessByToken, accessByRole(['READ','CREATE'],['students']),
    
    [
        body('firstname').notEmpty().escape().trim().withMessage('first name required'),
        body('lastname').notEmpty().escape().trim().withMessage('last name required'), 
    ],
    
    validateRequest,

    asyncHandler(async(req,res)=>{
        
        req.body.student_number=await generateHexStudentNumber();
        const {firstname,lastname,student_number}=req.body;
        const student=await studentRepository.create({firstname,lastname,student_number,by:req.user.id});
        res.json(student); 
    }))
  
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
.delete('/students/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['students']),
    [
        param('id').notEmpty().withMessage('student id required').isInt({min:1})
        .withMessage('student id must be a positive integer')
    ],
   
    validateRequest,

    asyncHandler(async(req,res)=>{

    const {id}=req.params;
    const student=await studentRepository.remove({id});
    res.json(student);  
  }) ) 

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
 *     responses:
 *       200 :
 *         content:
 *           application/json:
 *             schema:
 *               type: array
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
.patch('/students/update',accessByToken,accessByRole(['READ','UPDATE'],['students']),
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
    
    validateRequest,

    asyncHandler(async(req,res)=>{
      
        const errors=validationResult(req);
        const st=req.body;
        let studProfile={};
        if(st.firstname)
            studProfile.firstname=st.firstname;
        if(st.lastname)
            studProfile.lastname=st.lastname;
        studProfile.by=st.by;
        const stud=await studentRepository.updateBy(studProfile,{student_number:st.student_number})
        res.json(stud);
    }))

module.exports=router;


