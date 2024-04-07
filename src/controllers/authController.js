const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const knex = require("../config/database");

const generateToken = (user) => {
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  return jwt.sign(tokenPayload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, forneça nome de usuário e senha." });
    }
    const existingUser = await knex("users").where({ username }).first();
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este nome de usuário já está em uso." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex("users").insert({
      username,
      password: hashedPassword,
      email,
      name,
    });
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro durante o registro do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await knex("users").where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro durante o login do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autenticação não fornecido." });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticação inválido." });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < currentTime) {
    const user = await knex("users").where({ id: decodedToken.userId }).first();
    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuário associado ao token não encontrado." });
    }
    const newToken = generateToken(user);
    res.set("Authorization", newToken);
  }

  next();
};

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
};
