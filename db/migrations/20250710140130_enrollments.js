/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('enrollments',(table)=>{
      table.increments('id');
      table.integer('student_id').references('id').inTable('students').notNullable();
      table.integer('grade_id').references('id').inTable('grades').notNullable();
      table.integer('school_year_id').references('id').inTable('school_years').notNullable();
      table.integer('by');
      table.timestamps(true,true);
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('enrollments');

};
