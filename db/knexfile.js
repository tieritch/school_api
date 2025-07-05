// knexfile.js

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const baseConfig={
    client: 'pg',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.USER_NAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
}

module.exports = {
  development: baseConfig,
  production: baseConfig,
};
