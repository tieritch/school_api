// knexfile.js

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("DATABASE_URL =", process.env.DATABASE_URL);
const baseConfig = {
  client: "postgresql",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // 🔐 Nécessaire pour Neon
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: path.resolve(__dirname, "./migrations"),
  },
};

module.exports = {
  development: baseConfig,
  production: baseConfig,
};
