const bcrypt = require('bcrypt');

exports.seed = async function (knex) {

  await knex('resources').del();
  await knex('roles').del();
  await knex('users').del();

  //  Insert admin user 
  const hashedPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  const [{ id: adminUserId }] = await knex('users')
    .insert([{
      username: 'admin',
      firstname: 'admin',
      lastname: '',
      password: hashedPass,
      email: 'admin@gmail.com'
    }])
    .returning('id');

  //  Insert admin role
  const [{ id: adminRoleId }] = await knex('roles')
    .insert({ name: 'admin', by: '' })
    .returning('id');

  //  Link user ↔ role
  await knex('users_roles').insert([
    { user_id: adminUserId, role_id: adminRoleId }
  ]);

  // Permissions (idempotent)
  const permissionNames = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
  await knex('permissions')
    .insert(permissionNames.map(name => ({ name: name.toUpperCase() })))
    .onConflict('name')  //  name must be  UNIQUE
    .ignore();

  //  Resources
  const resourceNames = ['courses', 'students', 'grades', 'school_years', 'roles'];
  await knex('resources')
    .insert(resourceNames.map(name => ({ name:name.toLocaleLowerCase() })))
    .onConflict('name')
    .ignore();

};
