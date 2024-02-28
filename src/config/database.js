// database.js

const knex = require("knex");

const config = {
  DATABASE_URL:
    "postgres://okami:L7BzpoypoIUTbGbVAWcC7tKd1tHrk1hi@dpg-cnedt9ol5elc73docm0g-a.ohio-postgres.render.com/okami",
  DB_HOST: "dpg-cnedt9ol5elc73docm0g-a.ohio-postgres.render.com",
  DB_PORT: 5432,
  DB_USER: "okami",
  DB_NAME: "okami",
  DB_PASSWORD: "L7BzpoypoIUTbGbVAWcC7tKd1tHrk1hi",
  DB_SSL: true,
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
    ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
  },
});

module.exports = pg;
