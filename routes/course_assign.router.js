const {courseAssignRepository,courseRepository,
    schoolYearRepository,gradeRepository}=require('../repositories');
const {accessByToken,accessByRole,validateRequest}=require('../middlewares');
const {body,param,validationResult}=require('express-validator');
const {asyncHandler,}=require('../utils');
const express=require('express');
//const { access } = require('../utils/gen_token');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     CourseAssign:
 *       type: object
 *       properties:
 *         course_id: 
 *           type: integer
 *           example: 1
 *         grade_id:
 *           type: integer
 *           example: 1
 *         school_year_id:
 *           type: integer 
 *           example: 1
 *        
 *           
 */

router
/**
 * @swagger
 * tags:
 *   name: Course-Assignments
 *   description: course assignment management endpoints.
 */

  /**
  * @swagger
  * /course_assignments:
  *   get:
  *     summary: Get all course assignments
  *     tags: [Course-Assignments]
  *     responses:
  *       200:
  *         description: A list of course assignments
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
  .get('/course_assignments', accessByToken, accessByRole(['READ'],['course_assignments']), 
     async(req,res)=>{
         let courseAssigns=await courseAssignRepository.findAll()
         .withGraphFetched('[courses,schoolYears,grades]')
        courseAssigns=courseAssigns.map( ({id,courses,grades,schoolYears})=>({
            id,
            course:{id:courses.id,name:courses.name},
            school_year:{id: schoolYears.id, name: schoolYears.name },
            grade:{id:grades.id,name:grades.name}
         }) )
         res.json(courseAssigns);
 })

 
  /**
 * @swagger
 * /course_assigns/create:
 *   post:
 *     summary: creates a course assignment
 *     tags: [Course-Assignments] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseAssign"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: returns the created course assignment
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
 .post('/course_assigns/create',accessByToken, accessByRole(['READ'],['course_assignments']),
  [
    body('course_id').notEmpty().withMessage(' course ID required').isInt({min:1}).withMessage(' course ID must be a positive integer')
      .custom(async(value,{req})=>{
          let course=await courseRepository.findBy({id:value});
          if(!course){
            throw new Error('This course ID does not exist')
          }
        // check if a course is alredy assigned to the same school year and the same grade
          const repoAssign=await courseAssignRepository.findBy({
            id:value,
            school_year_id:req.body.school_year_id,
            grade_id:req.body.grade_id})
          if(repoAssign){
            throw new Error(' the course is already assigned to the same school year and grade ')
          }   
          return true
      }),

     body('school_year_id').notEmpty().withMessage(' school year ID required').isInt({min:1}).withMessage(' school year ID must be a positive integer') 
     .custom(async(value)=>{
        let year=await schoolYearRepository.findBy({id:value});
        if(!year){
          throw new Error('This school year ID does not exist')
        }
        return true
    }),

    body('grade_id').notEmpty().withMessage(' grade ID required').isInt({min:1}).withMessage(' grade ID must be a positive integer') 
    .custom(async(value)=>{
        let year=await gradeRepository.findBy({id:value});
        if(!year){
          throw new Error('This grade ID does not exist')
        }
        return true
    }),

  ], 
  validateRequest,
  asyncHandler(async(req,res)=>{
     console.log('eq body,', req.body)
    const {grade_id,school_year_id,course_id}=req.body;
   
        let courseAssign=await courseAssignRepository.create({grade_id,school_year_id,course_id,by:req.user.id})
                        .withGraphFetched('[courses,grades,schoolYears]');
        const {id,courses,grades,schoolYears}=courseAssign;
        const {id:courseId,name:courseName}=courses;
        const {id:gradeId,name:gradeName}=grades;
        const {id:yearId, name:yearName}=schoolYears;
        courseAssign={id,courses:{courseId,courseName}, grades:{gradeId,gradeName},schoolYears:{yearId,yearName}}
        res.json(courseAssign);  
  }))

/**
 * @swagger
 * /course_assigns/update:
 *   patch:
 *     summary: change an existing course assignment
 *     tags: [Course-Assignments] 
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
 *               grade_id:
 *                 type: integer
 *                 example: 1
 *               school_year_id: 
 *                 type: integer
 *                 example: 1
 *               
 *                
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: returns the modified course
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
.patch('/course_assigns/update',accessByToken, accessByRole(['READ','UPDATE'],['course_assignments']), 
   [
    body('id').notEmpty().withMessage(' course assignment ID required').isInt({min:1}).withMessage(' course assignment ID must be a positive integer')
     .custom(async(value)=>{
         const assign=await courseAssignRepository.findBy({id:value});
         if(!assign){
            throw new Error(' This course assignment does not exist')
         }
         return true;
     }),

    body('school_year_id').optional().notEmpty().withMessage(' school year ID required').isInt({min:1}).withMessage(' school year ID must be a positive integer') 
    .custom(async(value)=>{
       let year=await schoolYearRepository.findBy({id:value});
       if(!year){
         throw new Error('This school year ID does not exist')
       }
       return true
    }),
     
    body('grade_id').notEmpty().withMessage(' grade ID required').isInt({min:1}).withMessage(' grade ID must be a positive integer') 
    .custom(async(value)=>{
        let year=await gradeRepository.findBy({id:value});
        if(!year){
          throw new Error('This grade ID does not exist')
        }
        return true
    }),
   ],
   
   validateRequest,

   asyncHandler(async(req,res)=>{
     
    // For a course assignment, you can change the school year (i.e., assign a different year)
     // or assign a different school class (grade) to the course.
        let assign={};
        if(req.body.school_year_id){
           assign.school_year_id=req.body.school_year_id;
        }
        if(req.body.grade_id){
          assign.grade_id=req.body.grade_id;
        }
        assign.by=req.user.id;
        const whereCondition={ id:req.body.id};
        let courseAssign=await courseAssignRepository.updateBy(assign,whereCondition)
                          .withGraphFetched('[courses,grades,schoolYears]');
      courseAssign=courseAssign.map( ({id,courses,grades,schoolYears})=>({
            id,
            course:{id:courses.id,name:courses.name},
            school_year:{id: schoolYears.id, name: schoolYears.name },
            grade:{id:grades.id,name:grades.name}
      }) )
        res.json(courseAssign);

   }))
  
   /**
 * @swagger
 * paths:
 *  /course_assigns/remove/{id}:
 *   delete:
 *     summary: Delete a course assignment
 *     description: Delete a course assignmentby its ID
 *     tags: [Course-Assignments]
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
   .delete('/course_assigns/remove/:id',accessByToken,accessByRole(['READ','DELETE'],['course_assignments']),
   
   [
      param('id').notEmpty().withMessage('course assignment ID required').isInt({min:1})
      .withMessage('course assignment ID id must be a positive integer')
      .custom(async(value)=>{
         const assign=await courseAssignRepository.findBy({id:value});
         if(!assign){
          throw new Error(' This course assignment ID does not exist')
         }
      })
   ], 
   
   validateRequest,

   asyncHandler(async(req,res)=>{
     const {id}=req.params;
       let courseAssign=await courseAssignRepository.remove({id})
      // .withGraphFetched('[courses,grades,schoolYears]');
      /* courseAssign=courseAssign.map( ({id,courses,grades,schoolYears})=>({
             id,
             course:{id:courses.id,name:courses.name},
             school_year:{id: schoolYears.id, name: schoolYears.name },
             grade:{id:grades.id,name:grades.name}
       }) )*/
       res.json(courseAssign);
   }))
 module.exports=router;