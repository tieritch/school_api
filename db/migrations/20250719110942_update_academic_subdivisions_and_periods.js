/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('academic_subdivisions',(table)=>{
        table.integer('by').notNullable();
    })
    .alterTable('academic_periods', (table)=>{
        table.integer('by').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('academic_subdivisions',(table)=>{
        table.dropColumn('by');
    })
    .alterTable('academic_periods',(table)=>{
        table.dropColumn('by');
    })
};
