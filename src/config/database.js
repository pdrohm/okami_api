const { Pool } = require("pg");

export const pool = new Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "seu_banco_de_dados",
  password: "sua_senha",
  port: 5432,
});
