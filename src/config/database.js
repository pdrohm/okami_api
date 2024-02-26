const { Pool } = require("pg");

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "okami",
  password: "postgres",
  port: 5432,
});
