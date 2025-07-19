/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.alterTable('scores',(table)=>{
     table.integer('academic_period_id').references('id').inTable('academic_periods').notNullable();
   })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('scores',(table)=>{
        table.dropColumn('academic_period_id')
    })
};
