/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const dotenv=require('dotenv');
const bcrypt=require('bcrypt');

dotenv.config();
exports.up = async function(knex) {
     //const hashedPass=await bcrypt.hash(process.env.ADMIN_PASS,10)
     await knex.schema
   
     .createTable('users',(table)=>{
          table.increments('id');
          table.string('username').notNullable().unique();
          table.string('firstname').notNullable();
          table.string('lastname').notNullable();
          table.string("email").unique();
          table.check("email ~ '^[\\w.-]+@[\\w.-]+\\.\\w{2,}$'");
          table.string('password');
          table.string('by');
          table.timestamps(true,true);
     } )
   
     .createTable('refresh_tokens',(table)=>{
          table.string('token').unique();
          table.integer('user_id').notNullable();
          table.timestamps(true,true);
     })
     
     .createTable('roles',(table)=>{
          table.increments('id');
          table.string('name').notNullable().unique();
          table.string('by').notNullable();
          table.timestamps(true,true);
     })
     
     .createTable('users_roles',(table)=>{
          table.integer('user_id').references('id').inTable('users').notNullable();
          table.integer('role_id').references('id').inTable('roles').notNullable();
     })
     
     .createTable('permissions',(table)=>{
          table.increments('id');
          table.string('name');
          table.timestamps(true,true);
     })

     .createTable('roles_permissions',(table)=>{
          table.increments('id');
          table.integer('role_id').references('id').inTable('roles').notNullable();
          table.integer('permission_id').references('id').inTable('permissions').notNullable();
     })

     .createTable('table_resources',(table)=>{
          table.integer('id');
          table.string('name').notNullable();
     })
     
     .createTable('roles_permissions_resources',(table)=>{
          table.integer('role_permission_id').references('id').inTable('roles_permissions').notNullable();
          table.integer('resource_id').references('id').inTbale('table_resources').notNullable() 
     })
   
   //  .raw(`INSERT INTO roles(name,by) VALUES('admin',1)`)
   
    // .raw(`INSERT INTO users(username,firstname,lastname,email,password) VALUES('admin',' ',' ','admin@gmail.com',${hashedPass.toString()})`)
   
    // .raw(`INSERT INTO users_roles(user_id,role_id) VALUES(1,1)`)

   /*  .raw(`INSERT INTO permissions(name) VALUES('READ') `) 
     .raw(`INSERT INTO permissions(name) VALUES('CREATE') `)
     .raw(`INSERT INTO permissions(name) VALUES('UPDATE') `)
     .raw(`INSERT INTO permissions(name) VALUES('DELETE') `)

     // admin created by default
    /* const hashedPass=await bcrypt.hash(process.env.ADMIN_PASS,10);
     await knex('users').insert({
          username:'admin',
          firstname:'admin',
          lastname:' ',
          email:'admin@gmail.com',
          password:hashedPass
     })*/
     
     // filling in users_roles
     /*await knex('users_roles').insert({
          role_id:1,
          user_id:1
     })*/
 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('roles_permissions_resources')
    .dropTableIfExists('roles_permissions')
    .dropTableIfExists('users_roles')
    .dropTableIfExists('users')
    .dropTableIfExists('roles')
    .dropTableIfExists('refresh_tokens')
    .dropTableIfExists('permissions')
    .dropTableIfExists('table_resources');
};

exports.seed=async function(knex){
     
     await knex('role_permission_resources').del();
     await knex('roles_permissions').del();
     await knex('users_roles').del();
     await knex('table_resources').del();
     await knex('permissions').del();
     await knex('roles').del();
     await knex('users').del();
    
      // Insert admin user
     const hashedPass=await bcrypt.hash(process.env.ADMIN_PASS,10);
     const [adminUserId] = await knex('users').insert({ 
          username:'admin',
          firstname: 'admin', 
          lastname:'',
          password:hashedPass,
          email:'admin@gmail.com'
     }).returning('id');
      
     // insert admin role
     const [adminRoleId]=await knex('roles').insert({
               name:'admin',
               by:''
      }).returning('id')

     // Users ↔ Roles
  await knex('users_roles').insert([
     { user_id: adminUserId[0], role_id: adminRoleId[0] },
   ]) 
      
   //insert permissions
     const [readId,createId,updateId,deleteId]=await knex('permissions').insert([
          {name:'READ'},
          {name:'CREATE'},
          {name:'UPDATE'},
          {name:'DELETE'}
     ]).returning('id') 
  
   // Roles ↔ Permissions
   const rolePerms=await knex('roles_permissions').insert([
     {role_id:adminRoleId[0],permission_id:readId[0]},
     {role_id:adminRoleId[0],permission_id:createId[0]},
     {role_id:adminRoleId[0],permission_id:updateId[0]},
     {role_id:adminRoleId[0],permission_id:deleteId[0]}
   ]).returning('id')

  //Insert Resource
  const [courseId,studentId]=await knex('table_resources').insert([
     {name:'courses'},
     {name:'students'}
  ]).returning('id')  

  // RolePermissionResource
 /* await knex('roles_permissions_resources').insert([
     // admin has all permissions on all resources
     {role_permission_id:rolePerms[0].id,recource_id:courseId[0]},
     {role_permission_id:rolePerms[0].id,recource_id:courseId[1]},
     {role_permission_id:rolePerms[1].id,recource_id:courseId[1]},
  ])*/

}
