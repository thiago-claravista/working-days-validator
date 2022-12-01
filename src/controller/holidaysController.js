const mongoose = require("mongoose");
const express = require("express");
const model = require("../mongoose/models/Holiday");
const regexDate = require("../utils/regexDate");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getHolidays = async (req, res) => {
  const { day, month, year } = req.query;
  const query = { day, month };
  const errorMessage = "Erro ao consultar uma data";

  if (day && (isNaN(day) || day < 1 || day > 31)) {
    return res.status(400).json({
      message: errorMessage,
      error: "O dia deve ser um valor numérico entre 1 e 31!",
    });
  }

  if (month && (isNaN(month) || month < 1 || month > 12)) {
    return res.status(400).json({
      message: errorMessage,
      error: "O mês deve ser um valor numérico entre 1 e 12!",
    });
  }

  if (year && isNaN(year)) {
    return res.status(400).json({
      message: errorMessage,
      error: "O ano deve ser um valor numérico!",
    });
  }

  for (const key in query) {
    if (query[key] === undefined) delete query[key];
  }

  if (year) query.$or = [{ year }, { year: null }];

  try {
    const holidays = await model.find(query, "-createdAt -updatedAt").exec();
    res.status(200).json(holidays);
  } catch (error) {
    const err = {
      message: errorMessage,
      error,
    };
    console.log(err);
    res.status(500).send(err);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.insertHolidays = async (req, res) => {
  const { date, description } = req.body;
  const errorMessage = "Erro ao inserir uma data";

  if (typeof date !== "string") {
    return res.status(400).json({
      message: errorMessage,
      error: "O parâmetro 'date' deve ser uma string!",
    });
  }

  if (!date?.trim()) {
    return res.status(400).json({
      message: errorMessage,
      error: "O parâmetro 'date' é obrigatório!",
    });
  }

  if (!description || !String(description)?.trim()) {
    return res.status(400).json({
      message: errorMessage,
      error: "O parâmetro 'description' é obrigatório!",
    });
  }

  if (!regexDate.test(date)) {
    return res.status(400).json({
      message: errorMessage,
      error: `A data '${date}' está fora do padrão aceito! Tente novamente utilizando o formato dd-mm ou dd-mm-aaaa`,
    });
  }

  const [, day, month, , year = null] = date.match(regexDate);
  const currentYear = new Date().getFullYear();
  const _date = new Date(year || currentYear, month - 1, day);

  if (
    Number(day) !== _date.getDate() ||
    Number(month) !== _date.getMonth() + 1
  ) {
    return res.status(400).json({
      message: errorMessage,
      error: `Data '${date}' inexistente no calendário de ${_date.getFullYear()}!`,
    });
  }

  const localeDate = _date
    .toLocaleDateString("pt-br")
    .slice(0, year ? undefined : 5);

  try {
    const foundHoliday = await model.findOne({ day, month }).exec();
    if (foundHoliday) {
      throw { code: 11000 };
    }

    const holiday = await model.create({
      day,
      month,
      year,
      date: localeDate,
      description,
    });

    res.status(201).json(holiday);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: errorMessage,
        error: `A data '${date}' já existe no banco de dados!`,
      });
    }

    const err = {
      message: errorMessage,
      error,
    };
    console.log(err);
    res.status(400).json(err);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.deleteHoliday = async (req, res) => {
  const { id } = req.params;
  const errorMessage = "Erro ao deletar uma data";
  const isValidId = mongoose.isValidObjectId(id);

  if (!isValidId) {
    return res.status(400).json({
      message: errorMessage,
      error: `Identificador não encontrado no banco de dados!`,
    });
  }

  try {
    const holiday = await model
      .findByIdAndDelete(id, { projection: "-createdAt -updatedAt" })
      .exec();

    if (holiday) {
      return res.status(200).json(holiday);
    }

    res
      .status(200)
      .json({ message: "Identificador não encontrado no banco de dados!" });
  } catch (error) {
    const err = {
      message: errorMessage,
      error,
    };
    console.log(err);
    res.status(400).json(err);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.updateHoliday = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const errorMessage = "Erro ao atualizar uma data";
  const isValidId = mongoose.isValidObjectId(id);

  if (!description || !String(description)?.trim()) {
    return res.status(400).json({
      message: errorMessage,
      error: "O parâmetro 'description' é obrigatório!",
    });
  }

  if (!isValidId) {
    return res.status(400).json({
      message: errorMessage,
      error: `Identificador não encontrado no banco de dados!`,
    });
  }

  try {
    const holiday = await model
      .findByIdAndUpdate(id, { description }, { new: true })
      .exec();

    if (holiday) {
      return res.status(200).json(holiday);
    }

    res
      .status(200)
      .json({ message: "Identificador não encontrado no banco de dados!" });
  } catch (error) {
    const err = {
      message: errorMessage,
      error,
    };
    console.log(err);
    res.status(400).json(err);
  }
};
