const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const knex = require("../config/database");

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
  console.log(req.body);
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
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    };

    const userProfile = await knex("user_profile")
      .where({ user_id: user.id })
      .first();

    if (userProfile) {
      const profile = await knex("profile")
        .where({ id: userProfile.profile_id })
        .first();
      tokenPayload.profile = profile;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro durante o login do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
