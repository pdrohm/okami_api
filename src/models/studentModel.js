const pool = require("./db");

class Student {
  static async createStudent(data) {
    const { name, email, birthday, belt, gender, number, legalGuardian, obs } =
      data;
    const query =
      "INSERT INTO students (name, email, birthday, belt, gender, number, legal_guardian, obs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values = [
      name,
      email,
      birthday,
      belt,
      gender,
      number,
      legalGuardian,
      obs,
    ];
    try {
      const { rows } = await pool.query(query, values);
      return new Student(rows[0]);
    } catch (error) {
      console.error("Erro ao criar estudante:", error);
      throw error;
    }
  }

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.birthday = data.birthday;
    this.belt = data.belt;
    this.gender = data.gender;
    this.number = data.number;
    this.legalGuardian = data.legal_guardian;
    this.obs = data.obs;
  }
}

module.exports = Student;
