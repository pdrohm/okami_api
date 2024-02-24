// src/controllers/studentController.js

const { pool } = require("../config/database");

const createStudent = async (req, res) => {
  const { name, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, age) VALUES ($1, $2) RETURNING *",
      [name, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar estudante:", err);
    res.status(500).send("Erro ao criar estudante");
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter estudantes:", err);
    res.status(500).send("Erro ao obter estudantes");
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Estudante não encontrado");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao obter estudante por ID:", err);
    res.status(500).send("Erro ao obter estudante por ID");
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  try {
    const result = await pool.query(
      "UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *",
      [name, age, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Estudante não encontrado");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao editar estudante:", err);
    res.status(500).send("Erro ao editar estudante");
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
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
