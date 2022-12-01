const express = require("express");
const router = express.Router();
const controller = require("../controller/holidaysController");

router.get("/", controller.getHolidays);
router.post("/", controller.insertHolidays);
router.delete("/:id", controller.deleteHoliday);
router.put("/:id", controller.updateHoliday);

module.exports = router;
