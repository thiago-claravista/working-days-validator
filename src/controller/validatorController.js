const express = require("express");
const model = require("../mongoose/models/Holiday");
const regexDate = require("../utils/regexDate");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.validateDate = async (req, res) => {
  const { date, holidays } = req.query;
  const currentYear = new Date().getFullYear();
  const [, day, month, , year = currentYear] = date.match(regexDate);
  const errorMessage = `Erro ao validar a data '${date}'`;

  if (!date?.trim()) {
    return res.status(400).json({
      message: errorMessage,
      error: "O parâmetro 'date' é obrigatório!",
    });
  }

  if (!regexDate.test(date)) {
    return res.status(400).json({
      message: errorMessage,
      error: `Formato de data inválido! Os padrões aceitos são dd-mm ou dd-mm-aaaa`,
    });
  }

  // verifica se é final de semana
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const isMidweek = dayOfWeek > 0 && dayOfWeek < 6;

  if (!isMidweek) {
    return res
      .status(200)
      .json({ valid: false, description: "Final de semana" });
  }

  if (holidays?.toLowerCase() === "true") {
    try {
      const holiday = await model
        .findOne({ day, month, $or: [{ year }, { year: null }] })
        .exec();

      return res
        .status(200)
        .json({ valid: !holiday, description: holiday?.description });
    } catch (error) {
      const err = {
        message: errorMessage,
        error,
      };
      console.log(err);
      res.status(500).json(err);
    }
  }

  res.status(200).json({ valid: true });
};
