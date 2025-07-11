exports.up = async function(knex) {
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'resources_name_unique'
      ) THEN
        ALTER TABLE resources ADD CONSTRAINT resource_name_unique UNIQUE(name);
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
        SELECT 1 FROM pg_constraint WHERE conname = 'resources_name_unique'
      ) THEN
        ALTER TABLE resources DROP CONSTRAINT resources_name_unique;
      END IF;
    END;
    $$;
  `);
};
