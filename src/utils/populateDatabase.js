const holidays = require("../holidays.json");
const model = require("../mongoose/models/Holiday");
const regexDate = require("./regexDate");

const populateDatabase = () => {
  holidays.forEach(({ date, description }) => {
    const [, day, month, , year = null] = date.match(regexDate);
    const currentYear = new Date().getFullYear();
    const _date = new Date(year || currentYear, month - 1, day);
    const localeDate = _date
      .toLocaleDateString("pt-br")
      .slice(0, year ? undefined : 5);

    model
      .create({
        day,
        month,
        year,
        date: localeDate,
        description,
      })
      .catch((error) => {
        if (error.code !== 11000) {
          const err = {
            message: "Erro ao popular o banco de dados",
            error,
          };

          console.log(err);
        }
      });
  });
};

module.exports = populateDatabase;
