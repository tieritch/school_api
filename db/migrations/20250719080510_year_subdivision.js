/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('academic_subdivisions', (table)=>{
    table.increments('id');
    table.string('name').notNullable();
    table.integer('number_of_periods').notNullable();
    table.integer('school_year_id').references('id').inTable('school_years').notNullable();
    table.timestamps(true,true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('academic_subdivision');
};
