const knex = require("../config/database");

const markAttendance = async (req, res) => {
  const { code, training_id } = req.body;

  try {
    const student = await knex("student").select("id").where("code", code).first();
    if (!student) {
      return res.status(404).send("Código de aluno inválido");
    }

    const attendanceData = {
      student_id: student.id,
      training_id: training_id,
      checkin_time: new Date() 
    };

    const result = await knex("attendance").insert(attendanceData).returning("*");

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
    .select("name", "email", "birthday", "belt.belt_description as belt_description",
    "degree.degree_description as degree_description")    
      .leftJoin("belt", "student.belt", "belt.id_belt")
      .leftJoin("degree", "student.degree", "degree.id_degree")
    .where("code", code)
    .first();    if 
    
    (!student) {
      return res.status(404).send("Código de aluno inválido");
    }

    res.json(student);
  } catch (err) {
    console.error("Erro ao verificar aluno:", err);
    res.status(500).send("Erro ao verificar aluno");
  }
};
module.exports = {
  markAttendance, checkStudent
};
