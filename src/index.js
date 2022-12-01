const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authentication = require("./middlewares/authentication");
const populateDatabase = require("./utils/populateDatabase");
const app = express();
const port = 3002;

const init = async () => {
  // conexão com o MongoDB
  await mongoose.connect("mongodb://localhost:27017/working_days");
  console.log(`Conexão com o banco de dados realizada com sucesso!`);

  // inserir os feriados padrões
  populateDatabase();

  app.use(authentication);
  app.use(cors());
  app.use(express.json());

  // routes
  const holidaysRoute = require("./routes/holidaysRoute");
  const validateRoute = require("./routes/validatorRoute");

  app.use("/holidays", holidaysRoute);
  app.use("/validate", validateRoute);

  app.listen(port, () => console.log(`Rodando na porta ${port}...`));
};

init();
