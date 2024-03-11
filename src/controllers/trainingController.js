const knex = require("../config/database");

const createTraining = async (req, res) => {
  const { training_name } = req.body;

  try {
    const trainingData = {
      training_name: training_name || null,
    };

    const result = await knex("training").insert(trainingData).returning("*");

    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Erro ao criar treino:", err);
    res.status(500).send("Erro ao criar treino");
  }
};

const getAllTrainings = async (req, res) => {
  try {
    const trainings = await knex("training").select("*");
    res.json(trainings);
  } catch (err) {
    console.error("Erro ao obter treinos:", err);
    res.status(500).send("Erro ao obter treinos");
  }
};

const getAttendancesByTraining = async (req, res) => {
  const { trainingId } = req.params;

  try {
    const attendances = await knex("attendance").select("*").where("id", trainingId);

    res.json(attendances);
  } catch (error) {
    console.error("Erro ao obter presenças por treino:", error);
    res.status(500).send("Erro ao obter presenças por treino");
  }
};

const getTrainingById = async (req, res) => {
  const { id } = req.params;
  try {
    const training = await knex("training").select("*").where("id", id).first();
    if (!training) {
      return res.status(404).send("Treino não encontrado");
    }
    res.json(training);
  } catch (err) {
    console.error("Erro ao obter treino por ID:", err);
    res.status(500).send("Erro ao obter treino por ID");
  }
};

const updateTraining = async (req, res) => {
  const { id } = req.params;
  const { training_name } = req.body;
  try {
    const result = await knex("training")
      .where("id", id)
      .update({ training_name})
      .returning("*");
    if (result.length === 0) {
      return res.status(404).send("Treino não encontrado");
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Erro ao editar treino:", err);
    res.status(500).send("Erro ao editar treino");
  }
};

const deleteTraining = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await knex("training").where("id", id).del().returning("*");
    if (result.length === 0) {
      return res.status(404).send("Treino não encontrado");
    }
    res.json({ message: "Treino excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir treino:", err);
    res.status(500).send("Erro ao excluir treino");
  }
};

module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getAttendancesByTraining
};
