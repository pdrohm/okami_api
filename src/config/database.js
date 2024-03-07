// database.js

const knex = require("knex");
require("dotenv/config");

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SSL: false,
};

const pg = knex({
  client: "pg",
  connection: {
    connectionString: config.DATABASE_URL,
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    ssl: false,
  },
});

module.exports = pg;
