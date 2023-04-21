const Todo = require("../models/todo");

const saveTodo = async (data) => {
  try {
    const todo = new Todo(data);
    const newTodo = await todo.save();
    return newTodo;
  } catch (e) {
    throw e;
  }
};

const getAllTodos = async () => {
  try {
    const data = Todo.find().sort({ id: "asc" });
    return data;
  } catch (e) {
    throw e;
  }
};

const getTodo = async (key = "") => {
  try {
    const data = await Todo.findOne({ id: key });
    return data;
  } catch (e) {
    throw e;
  }
};

const deleteTodo = async (key = "") => {
  try {
    const data = await Todo.findOneAndDelete({ id: key });
    return data;
  } catch (e) {
    throw e;
  }
};

const updateTodo = async (key = "", arg) => {
  try {
    const data = await Todo.findOneAndUpdate({ id: key }, arg, { new: true });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  saveTodo,
  getAllTodos,
  getTodo,
  deleteTodo,
  updateTodo,
};
