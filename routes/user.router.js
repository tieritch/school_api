const {userRepository,refreshTokenRepository}=require('../repositories');
const {accessByToken,accessByRole, validateRequest}=require('../middlewares');
const {query,body,param,validationResult}=require('express-validator');
const {createToken,generateHexStudentNumber}=require('../utils');
const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const router=express.Router();

/**
 * @swagger
 *components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role_id:
 *           type:integer
 *
 */

router

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID
 *                   firstname:
 *                     type: string
 *                     description: The user's name
 *
 */
  .get('/users', accessByToken, accessByRole(['READ'],['users']), async(req,res)=>{
    const users=await userRepository.findAll();
    console.log(users);
    res.send(users);
  })

/**
 * @swagger
 * paths:
 *  /users/{id}:
 *   get:
 *     summary: Get user by his ID
 *     tags: [Users]
 *     operationId: add user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *       - name: cook
 *         in: cookie
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstname:
 *                   type:string
 *                 lastname:
 *                   type:string
 *
 */
  .get('/users/:id',accessByToken,accessByRole(['READ'],['users']),
    async(req,res)=>{
      const users=await userRepository.findAll();
      const user=users.find(value=>value.id==req.params.id);
      res.json(user);
    })

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: creates a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         content:
 *           applicaction/json:
 *             schema:
 *               type: object
 *       401:
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
 *
 */
  .post('/users/create',

    accessByToken, accessByRole(['READ','CREATE'],['users']),

    [
      body('firstname').notEmpty().escape().trim().withMessage('first name required'),
      body('lastname').notEmpty().escape().trim().withMessage('last name required'),

      body('email').optional().trim().isEmail()
        .custom( async(value)=>{
          const user=await userRepository.findBy({email:value});
          if (user) {
            throw new Error('E-mail already in use');
          }
        }),

      body('username').notEmpty().trim().withMessage(' user name required')
        .custom( async(value)=>{
          const user=await userRepository.findBy({username:value});
          if (user) {
            throw new Error('Username already in use');
          }
        }),

      body('password').notEmpty().trim().withMessage(' password required'),

      body('role_id').notEmpty().withMessage('role required'),

    ],

    validateRequest,

    async(req,res)=>{

      const {firstname,lastname,email,password,username,role_id}=req.body;
      console.log(req.body);

      try{

        const user=await userRepository.create({
          firstname,
          lastname,
          email,
          password:await bcrypt.hash(password,10),
          username,
          role_id});
        res.send(user);
      }

      catch(err){
        console.log(err.message);
        res.status(500).json({error:'Server Error'});
      }
    })


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: for login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200 :
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       401:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */
  .post('/users/login',[

    body('username').notEmpty().withMessage(' Username required')
      .custom(async(value,{req})=>{
        const user=await userRepository.findBy({username:value});
        const{password}=req.body;
        if(!user)
        {throw new Error('invalid username');}
        const passawordMatch=await bcrypt.compare(password,user.password);
        if(!passawordMatch){
          throw new Error('Wrong password');
        }}),

    body('password').notEmpty().withMessage('Pass word required'),
  ],

  validateRequest,

  async(req,res)=>{

    const accessToken=createToken.access(user.toJSON());
    const refreshToken=createToken.refresh(user.toJSON());

    await refreshTokenRepository.create({
      token:await bcrypt.hash(refreshToken,10),
      user_id:user.id,
    });

    console.log('successful connection');
    res
      .cookie('accessToken',accessToken,{
        httpOnly:true,
        maxAge:60*60*1000,
        secure:false,
        sameSite:'Lax',
      })
      .cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        secure:false,
        sameSite:'Lax',
      })
      .json({message:'successful Connexion!! '});
  })

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: for logout
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200 :
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *       500:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */
  .post('/users/logout',

    [
      body('id').notEmpty().withMessage(' user id required').isInt().withMessage(' required user id as integer type'),
    ],
    validateRequest,
    async(req,res)=>{

      const { id}=req.body;
      const {refreshToken,accessToken}=req.cookies;

      try{

        await refreshTokenRepository.remove({user_id:id});
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({success:'successful logout'});

      }
      catch(err){

        console.log(err.message);
        res.status(500).json({error:'Server error'});

      }
    })

/**
 * @swagger
 * /users/by_admin:
 *   patch:
 *     summary: this endpoint is used by admin to change role of user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               role_id:
 *                 type: integer
 *               by:
 *                 type: integer
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
  .patch('/users/by_admin', accessByToken, accessByRole(['READ','UPDATE'],['users']),

    [

      body('user_id').notEmpty().withMessage('user id required').isInt().withMessage('user id required as integer type'),
      body('role_id').notEmpty().withMessage('role id required').isInt().withMessage('role id required as integer type'),
    ],
    validateRequest,
    async(req,res)=>{

      const {user_id,role_id}=req.body;
      try{
        const user=await userRepository.updateBy(
          {
            role_id,by:req.user.id,
          },{
            user_id,
          });
        res.json(user);
      }
      catch(err){
        console.log(err.message);
        res.status(500).json({error:'Server error'});
      }
    })

/**
 * @swagger
 * /users/profile/{id}:
 *   patch:
 *     summary: this endpoint is used user to change his profile
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password:
 *                 type: string
 *               new_pass:
 *                 type: string
 *               confirm_pass:
 *                 type: string
 *               email:
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
 *       401:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *       500:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */
  .patch('/users/profile/:id', accessByToken, accessByRole(['READ','UPDATE'],['users']),
    [
      param('id').notEmpty().withMessage('ID is required')

        .isInt().withMessage('ID must be an integer')

        .custom(async (value,{req}) => {
          const userFromDB = await userRepository.findBy({ id: value });
          if (!userFromDB) {
            throw new Error('User does not exist');
          }
          const user = req.body;

          // Si des champs liés au password sont présents
          if (user.password || user.new_pass || user.confirm_pass) {
            if (!user.password || !user.new_pass || !user.confirm_pass) {
              throw new Error('Old, new, and confirmation passwords are all required to update password');
            }
            if (user.new_pass !== user.confirm_pass) {
              throw new Error('New password and confirmation do not match');
            }
            const isPasswordValid = await bcrypt.compare(user.password, userFromDB.password);
            if (!isPasswordValid) {
              throw new Error('You provided a wrong old password');
            }

            // Vérifie l'identité du user
            const userId = parseInt(req.params.id, 10);
            if (req.user.id !== userId) {
              throw new Error('You are only allowed to update your own profile');
            }

            // Préparer la valeur pour une mise à jour plus tard
            req.hashedPassword = await bcrypt.hash(user.new_pass, 10);
          }

          return true;

        }),

      body('firstname')
        .optional().escape().trim()
        .notEmpty().withMessage('First name cannot be empty'),

      body('lastname')
        .optional().escape().trim()
        .notEmpty().withMessage('Last name cannot be empty'),

      body('email')
        .optional().escape().trim()
        .isEmail().withMessage('Invalid email address'),

      body('password')
        .optional().escape().trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

      body('new_pass')
        .optional().escape().trim()
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

      body('confirm_pass')
        .optional().escape().trim()
        .isLength({ min: 6 }).withMessage('Confirmation password must be at least 6 characters long'),

    ],
    validateRequest,

    async (req, res) => {


      const userProfile = {};
      const user=req.body;
      if (user.firstname) {userProfile.firstname = user.firstname;}
      if (user.lastname) {userProfile.lastname = user.lastname;}
      if (user.email) {userProfile.email = user.email;}

      userProfile.by = req.user.id;
      const {id}=req.params;
      const whereCondition={id};
      try {

        const userUpd = await userRepository.updateBy(userProfile, whereCondition);

        return res.json(userUpd);
      } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
    },
  )

/**
 * @swagger
 * paths:
 *  /users/remove/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by his ID
 *     tags:
 *       - Users
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
  .delete('/users/remove/:id',accessByToken,accessByRole(['DELETE'],['users']),
    [
      param('id').notEmpty().withMessage('user id required').isInt().withMessage('user id require as integer type'),
    ],
    async(req,res)=>{
      const {id}=req.params;
      const errors=validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      try{
        const admin=await userRepository.findBy({id,username:'admin'});
        // we don't delete the default admin use (whose username is admin);
        if(!admin){
          const user=await userRepository.remove({id});
          console.log('deleted user:',user);
          res.json(user);
        }
      }
      catch(err){
        console.log(err.message);
        res.status(500).json({error:err.message});
      }

    });
module.exports=router;
