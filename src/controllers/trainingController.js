const knex = require("../config/database");

const createTraining = async (req, res) => {
  const { training_name, modality } = req.body;

  try {
    const trainingData = {
      training_name: training_name || null,
      modality: modality || null,
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
  const { date } = req.query;

  console.log(`date`, date);

  try {
    let query = knex("attendance")
      .select(
        "attendance.*",
        "student.name as student_name",
        "training.training_name",
        "belt.belt_description",
        "degree.degree_description"
      )
      .leftJoin("student", "attendance.student_id", "student.id")
      .leftJoin("training", "attendance.training_id", "training.id")
      .leftJoin("belt", "student.belt", "belt.id_belt")
      .leftJoin("degree", "student.degree", "degree.id_degree")
      .where("attendance.training_id", trainingId)
      .orderBy("attendance.checkin_time", "desc");

    if (date) {
      query = query.whereRaw(`DATE(attendance.checkin_time) = ?`, [date]);
    }

    const attendances = await query;

    res.json(attendances);
  } catch (error) {
    console.error("Erro ao obter presenças por treino:", error);
    res.status(500).send("Erro ao obter presenças por treino");
  }
};

const getTrainingById = async (req, res) => {
  const { id } = req.params;
  const { checkin_date } = req.query;

  try {
    let query = knex("training")
      .select(
        "training.*",
        "attendance.attendance_id",
        "attendance.student_id",
        "attendance.checkin_time",
        "student.name"
      )
      .leftJoin("attendance", "training.id", "attendance.training_id")
      .leftJoin("student", "attendance.student_id", "student.id")
      .where("training.id", id);

    if (checkin_date) {
      query = query.where("attendance.checkin_time", checkin_date);
    }

    const training = await query.first();

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
  const { training_name, modality } = req.body;
  try {
    const result = await knex("training")
      .where("id", id)
      .update({ training_name, modality })
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

const getDaysWithTraining = async (req, res) => {
  try {
    const trainingDates = await knex("attendance")
      .distinct(knex.raw("DATE(checkin_time) as date"))
      .pluck("date");
    res.json(trainingDates);
  } catch (error) {
    console.error("Erro ao obter datas com registros de treino:", error);
    res.status(500).send("Erro ao obter datas com registros de treino");
  }
};

const getStudentCountPerDayByModality = async (req, res) => {
  const { month } = req.params;
  try {
    const modalities = await knex("training")
      .distinct("modality")
      .pluck("modality");

    const modalityData = {};

    for (const modality of modalities) {
      const studentCountPerDay = await knex("attendance")
        .select(
          knex.raw("DATE_PART('day', attendance.checkin_time) as day"), // Use DATE_PART() function to extract day part
          knex.raw("COUNT(attendance.student_id) as student_count")
        )
        .leftJoin("training", "attendance.training_id", "training.id")
        .where("training.modality", modality)
        .andWhere(
          knex.raw("EXTRACT(month FROM attendance.checkin_time) = ?", [month])
        )
        .groupByRaw("DATE_PART('day', attendance.checkin_time)"); // Group by day part

      modalityData[modality] = studentCountPerDay;
    }

    res.json(modalityData);
  } catch (error) {
    console.error("Error retrieving student count per day by modality:", error);
    res.status(500).send("Error retrieving student count per day by modality");
  }
};

const getAttendancesByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendances = await knex("attendance")
      .select(
        "attendance.checkin_time",
        "training.modality",
        "training.training_name",

      )
      .leftJoin("training", "attendance.training_id", "training.id")
      .where("attendance.student_id", studentId)
      .orderBy("attendance.checkin_time", "desc");

    res.json(attendances);
  } catch (error) {
    console.error("Error retrieving attendances by student:", error);
    res.status(500).send("Error retrieving attendances by student");
  }
};



module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getAttendancesByTraining,
  getDaysWithTraining,
  getStudentCountPerDayByModality,
  getAttendancesByStudent
};
