/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.alterTable('scores',(table)=>{
        table.decimal('earned_score',5,2).notNullable();
   })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.alterTable('scores',(table)=>{
     table.dropColumn('earned_score')
   })
};
