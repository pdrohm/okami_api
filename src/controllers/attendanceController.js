const knex = require("../config/database");

const markAttendance = async (req, res) => {
  const { code, training_id } = req.body;

  try {
    const student = await knex("student")
      .select("id")
      .where("code", code)
      .first();
    if (!student) {
      return res.status(404).send("Código de aluno inválido");
    }

    const attendanceData = {
      student_id: student.id,
      training_id: training_id,
      checkin_time: new Date(),
    };

    const result = await knex("attendance")
      .insert(attendanceData)
      .returning("*");

    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Erro ao marcar presença:", err);
    res.status(500).send("Erro ao marcar presença");
  }
};

const checkStudent = async (req, res) => {
  const { code } = req.body;

  try {
    const student = await knex("student")
      .select(
        "name",
        "email",
        "birthday",
        "belt.belt_description as belt_description",
        "degree.degree_description as degree_description"
      )
      .leftJoin("belt", "student.belt", "belt.id_belt")
      .leftJoin("degree", "student.degree", "degree.id_degree")
      .where("code", code)
      .first();
    if (!student) {
      return res.status(404).send("Código de aluno inválido");
    }

    res.json(student);
  } catch (err) {
    console.error("Erro ao verificar aluno:", err);
    res.status(500).send("Erro ao verificar aluno");
  }
};

const getTopStudentsByTraining = async (req, res) => {
  try {
    const topStudentsByModality = await knex("attendance")
      .select("student_id", "student.name", "student.email", "student.birthday", "training.modality")
      .count("* as attendance_count")
      .join("training", "attendance.training_id", "training.id")
      .join("student", "attendance.student_id", "student.id")
      .groupBy("training.modality", "student_id", "student.name", "student.email", "student.birthday")
      .orderBy("training.modality")
      .orderBy("attendance_count", "desc")
      .limit(5);

    const result = {};

    topStudentsByModality.forEach((student) => {
      if (!result[student.modality]) {
        result[student.modality] = [];
      }
      result[student.modality].push({
        name: student.name,
        email: student.email,
        birthday: student.birthday,
        attendance_count: student.attendance_count,
      });
    });

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  markAttendance,
  checkStudent,
  getTopStudentsByTraining,
};
