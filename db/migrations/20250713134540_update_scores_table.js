/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('scores',(table)=>{
        table.dropColumn('course_id');
        table.integer('course_assignment_id').references('id').inTable('course_assignments').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('scores',(table)=>{
        table.dropColumn('course_assignment_id');
    })
  
};
