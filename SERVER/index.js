const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cros = require('cors');

const client = require("./client");

const app = express();

app.use(cros());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   client.getUsers(null, (err, data) => {
//     if (!err) {
//       res.send(data);
//     } else {
//       console.log(err);
//       res.status(500).send({
//         msg: "not found",
//       });
//     }
//   });
// });

app.get("/api/", (req, res) => {
  client.getTodos({}, (error, result) => {
    if (!error) {
      res.status(200).json(result);
    } else {
      res.status(400).json(error);
    }
  });
});

app.post("/api/todos", (req, res) => {
  const { body } = req;
  let id = Math.floor(Math.random() * 1000000) + 1;
  id = id.toString();
  const newTodo = {
    id,
    title: body.title,
    completed: false,
  };
  client.createTodo(newTodo, (error, todo) => {
    if (!error) {
      res.status(201).json(todo);
    } else {
      res.status(400).json(error);
    }
  });
});

app.get("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  client.getSingleTodo({ id }, (error, result) => {
    if (!error) {
      res.status(200).json(result);
    } else {
      res.status(400).json(error);
    }
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  client.deleteTodo({ id }, (error, result) => {
    if (!error) {
      res.status(200).json(result);
    } else {
      res.status(400).json(error);
    }
  });
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = {
    id,
    title,
    completed,
  };
  client.updateTodo(todo, (error, result) => {
    if (!error) {
      res.status(200).json(result);
    } else {
      res.status(400).json(error);
    }
  });
});

app.listen(8080, () => {
  console.log("listen on port 8080");
});
