const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {express.NextFunction}
 */
const authentication = (req, res, next) => {
  const { authorization } = req.headers;
  const errorMessage = "Erro de autenticação";

  if (!authorization?.trim()) {
    return res.status(401).json({
      message: errorMessage,
      error: "Token de acesso ausente!",
    });
  }

  const [bearer, token] = authorization.split(" ");
  const convertedToken = Buffer.from(token, "base64").toString();

  if (bearer?.toLowerCase() !== "bearer") {
    return res.status(401).json({
      message: errorMessage,
      error: "Token mal formatado!",
    });
  }

  if (convertedToken !== "Claravista@2022") {
    return res.status(401).json({
      message: errorMessage,
      error: "Token incorreto!",
    });
  }

  return next();
};

module.exports = authentication;
