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
          table.integer('role_id');
          table.integer('permission_id');
     })
   
     .raw(`INSERT INTO roles(name,by) VALUES('admin',1)`)
   
    // .raw(`INSERT INTO users(username,firstname,lastname,email,password) VALUES('admin',' ',' ','admin@gmail.com',${hashedPass.toString()})`)
   
    // .raw(`INSERT INTO users_roles(user_id,role_id) VALUES(1,1)`)

     .raw(`INSERT INTO permissions(name) VALUES('READ') `) 
     .raw(`INSERT INTO permissions(name) VALUES('CREATE') `)
     .raw(`INSERT INTO permissions(name) VALUES('UPDATE') `)
     .raw(`INSERT INTO permissions(name) VALUES('DELETE') `)

     // admin created by default
     const hashedPass=await bcrypt.hash(process.env.ADMIN_PASS,10);
     await knex('users').insert({
          username:'admin',
          firstname:'admin',
          lastname:' ',
          email:'admin@gmail.com',
          password:hashedPass
     })
     
     // filling in users_roles
     await knex('users_roles').insert({
          role_id:1,
          user_id:1
     })
 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('roles_permissions')
    .dropTableIfExists('users_roles')
    .dropTableIfExists('users')
    .dropTableIfExists('roles')
    .dropTableIfExists('refresh_tokens')
    .dropTableIfExists('permissions')
};
