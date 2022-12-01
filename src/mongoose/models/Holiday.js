const mongoose = require("mongoose");
const regexDate = require("../../utils/regexDate");

const schema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    default: () => null,
  },
  date: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => regexDate.test(value),
      message: (props) =>
        `${props.value} não está em um formato válido de data!`,
    },
  },
  description: {
    type: String,
    required: true,
  },
});

schema.set("timestamps", true);
schema.set("versionKey", false);
schema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("holiday", schema);
