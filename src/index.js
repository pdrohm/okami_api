const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/students", authenticateToken, studentRoutes);

app.use("/training", authenticateToken, trainingRoutes);

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
