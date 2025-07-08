/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt=require('bcrypt');
exports.seed=async function(knex){
     
  await knex('roles_permissions_resources').del();
  //await knex('roles_permissions').del();
  await knex('users_roles').del();
  await knex('resources').del();
  await knex('permissions').del();
  await knex('roles').del();
  await knex('users').del();
 
   // Insert admin user
  const hashedPass=await bcrypt.hash(process.env.ADMIN_PASS,10);
  const [{id:adminUserId}] = await knex('users').insert([{ 
       username:'admin',
       firstname: 'admin', 
       lastname:'',
       password:hashedPass,
       email:'admin@gmail.com'
  }]).returning('id');
  // console.log('adminUserId:',adminUser.id)
  // insert admin role
  const [{id:adminRoleId}]=await knex('roles').insert({
            name:'admin',
            by:''
   }).returning('id')

  // Users ↔ Roles
await knex('users_roles').insert([
  { user_id: adminUserId, role_id: adminRoleId },
]) 
   
//insert permissions
  const [{id:readId},{id:createId},{id:updateId},{id:deleteId}]=await knex('permissions').insert([
       {name:'READ'},
       {name:'CREATE'},
       {name:'UPDATE'},
       {name:'DELETE'}
  ]).returning('id') 

// Roles ↔ Permissions
/*const rolePerms=await knex('roles_permissions').insert([
  {role_id:adminRoleId,permission_id:readId},
  {role_id:adminRoleId,permission_id:createId},
  {role_id:adminRoleId,permission_id:updateId},
  {role_id:adminRoleId,permission_id:deleteId}
]).returning('id')
*/
//Insert Resource
const [{id:courseId},{id:studentId}]=await knex('resources').insert([
  {name:'courses'},
  {name:'students'},
  {name:'grades'},
  {name:'school_years'}
]).returning('id')  

// RolePermissionResource
/* await knex('roles_permissions_resources').insert([
  // admin has all permissions on all resources
  {role_permission_id:rolePerms[0].id,recource_id:courseId[0]},
  {role_permission_id:rolePerms[0].id,recource_id:courseId[1]},
  {role_permission_id:rolePerms[1].id,recource_id:courseId[1]},
])*/

}

