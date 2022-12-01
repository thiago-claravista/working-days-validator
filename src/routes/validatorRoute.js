const express = require("express");
const router = express.Router();
const controller = require("../controller/validatorController");

router.get("/", controller.validateDate);

module.exports = router;
