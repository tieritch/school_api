/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.alterTable('courses',(table)=>{
    table.integer('max_score').notNullable();
    table.integer('by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('courses',(table)=>{
    table.dropColumn('max_score');
    table.dropColumn('by');
  });
};
