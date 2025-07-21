/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
     DO $$
     BEGIN
       IF NOT EXISTS (
         SELECT 1 FROM pg_constraint WHERE conname = 'permissions_name_unique'
       ) THEN
         ALTER TABLE permissions ADD CONSTRAINT permissions_name_unique UNIQUE(name);
       END IF;
     END;
     $$;
   `);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`
     DO $$
     BEGIN
       IF EXISTS (
         SELECT 1 FROM pg_constraint WHERE conname = 'permissions_name_unique'
       ) THEN
         ALTER TABLE permissions DROP CONSTRAINT permissions_name_unique;
       END IF;
     END;
     $$;
   `);
};
