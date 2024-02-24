const express = require("express");
const bodyParser = require("body-parser");
const studentRoutes = require("./src/routes/studentRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/students", studentRoutes);
app.use("/payments", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
