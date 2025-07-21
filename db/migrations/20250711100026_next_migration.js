/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema

    .createTable('evaluation_types',(table)=>{
      table.increments('id');
      table.string('name').notNullable().unique();
      table.integer('by');
      table.timestamps(true,true);
    })

    .createTable('course_types',(table)=>{
      table.increments('id');
      table.string('name').unique().notNullable();
      table.integer('by');
      table.timestamps(true,true);
    })

    .createTable('courses',(table)=>{
      table.increments('id');
      table.string('name').unique().notNullable();
      table.integer('course_type_id').references('id').inTable('course_types');
    })

    .createTable('course_assignments',(table)=>{
      table.increments('id');
      table.integer('school_year_id').references('id').inTable('school_years');
      table.integer('grade_id').references('id').inTable('grades');
      table.integer('course_id').references('id').inTable('courses');
      table.integer('by');
      table.timestamps(true,true);
    })

    .createTable('scores',(table)=>{
      table.increments('id');
      table.integer('student_id').references('id').inTable('students').notNullable();
      table.integer('course_id').references('id').inTable('courses').notNullable();
      table.integer('evaluation_type_id').references('id').inTable('evaluation_types').notNullable();
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

  return knex.schema

    .dropTableIfExists('scores')
    .dropTableIfExists('course_assignments')
    .dropTableIfExists('courses')
    .dropTableIfExists('evaluation_types')
    .dropTableIfExists('course_types');


};
