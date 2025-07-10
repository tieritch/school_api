/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const dotenv=require('dotenv');
const bcrypt=require('bcrypt');

dotenv.config();
exports.up = async function(knex) {

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

     .createTable('resources',(table)=>{
          table.increments('id');
          table.string('name').notNullable();
     })
     
     .createTable('roles_permissions_resources',(table)=>{
          table.integer('role_id').references('id').inTable('roles').notNullable();
          table.integer('permission_id').references('id').inTable('permissions').notNullable();
          table.integer('resource_id').references('id').inTable('resources').notNullable(); 
     })
     
     .createTable('grades',(table)=>{
          table.increments('id');
          table.string('name');
          table.integer('by');
          table.timestamps(true,true);
     })

     .createTable('school_years',(table)=>{
          table.increments('id');
          table.string('name').notNullable();
          table.integer('by');
          table.timestamps(true,true);
     })

     .createTable('students',(table)=>{
          table.increments('id');
          table.string('firstname').notNullable();
          table.string('lastname').notNullable();
          table.integer('by');
          table.timestamps(true,true);
         // table.integer('grade_id')
     })

    /* .createTable('enrollments',(table)=>{
          table.integer('student_id').references('id').inTable('students').notNullable();
          table.integer('grade_id').references('id').inTable('grades').notNullable();
          table.integer('school_year_id').references('id').inTable('school_years').notNullable();
          table.integer('by');
          table.timestamps(true,true);
     })
    */
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
    .dropTableIfExists('resources')
    .dropTableIfExists('grades')
    .dropTableIfExists('students')
    .dropTableIfExists('school_years')
};

