// src/controllers/studentController.js

const knex = require("../config/database");

const createStudent = async (req, res) => {
  const { name, birthday, email } = req.body;
  try {
    const result = await knex("students")
      .insert({ name, birthday, email })
      .returning("*");
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Erro ao criar estudante:", err);
    res.status(500).send("Erro ao criar estudante");
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await knex("students").select("*");
    res.json(students);
  } catch (err) {
    console.error("Erro ao obter estudantes:", err);
    res.status(500).send("Erro ao obter estudantes");
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await knex("students").select("*").where("id", id).first();
    if (!student) {
      return res.status(404).send("Estudante não encontrado");
    }
    res.json(student);
  } catch (err) {
    console.error("Erro ao obter estudante por ID:", err);
    res.status(500).send("Erro ao obter estudante por ID");
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, birthday } = req.body;
  try {
    const result = await knex("students")
      .where("id", id)
      .update({ name, email, birthday })
      .returning("*");
    if (result.length === 0) {
      return res.status(404).send("Estudante não encontrado");
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Erro ao editar estudante:", err);
    res.status(500).send("Erro ao editar estudante");
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await knex("students").where("id", id).del().returning("*");
    if (result.length === 0) {
      return res.status(404).send("Estudante não encontrado");
    }
    res.json({ message: "Estudante excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir estudante:", err);
    res.status(500).send("Erro ao excluir estudante");
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
