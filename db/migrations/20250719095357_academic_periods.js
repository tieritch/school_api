/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable('academic_periods',(table)=>{
    table.increments('id');
    table.string('name').notNullable();
    table.integer('academic_subdivision_id').references('id').inTable('academic_subdivisions').notNullable();
    table.timestamps(true,true);
   })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('academic_periods');
};
