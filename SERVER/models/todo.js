const mongoose = require("mongoose");

const { Schema } = mongoose;

const todoSchema = new Schema({
  id: String,
  title: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
