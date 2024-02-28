const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importe o pacote cors
const studentRoutes = require("./routes/studentRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

app.use("/students", studentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
