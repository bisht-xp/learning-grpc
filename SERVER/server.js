const PROTO_PATH = "./proto/todos.proto";

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const db = require("./db");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const dbUrl = process.env.DB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

// const  = {
//   createTodo: (call, callback) => {
//     const todo = call.request;
//     todo.id = string(Math.random());
//     todos.push(todo);
//     callback(null, todo);
//   },
//   readTodos: ({}, callback) => {
//     if (!todos) {
//       return callback({
//         code: grpc.status.NOT_FOUND,
//         details: "No todos found",
//       });
//     }
//     callback(null, { todos });
//   },
//   updateTodo: (call, callback) => {
//     const existiongTodo = todos.find((n) => n.id === call.request.id);
//     if (existiongTodo) {
//       existiongTodo.title = call.request.title;
//       existiongTodo.description = call.request.description;
//       existiongTodo.completed = call.request.completed;
//       callback(null, existiongTodo);
//     } else {
//       callback({
//         code: grpc.status.NOT_FOUND,
//         details: "NOT found",
//       });
//     }
//   },
//   deleteTodo: (call, callback) => {
//     const todoId = todos.findIndex((n) => n.id == call.request.id);
//     if (todoId != -1) {
//       todos.splice(todoId, 1);
//       callback(null, {});
//     } else {
//       callback({
//         code: grpc.status.NOT_FOUND,
//         details: "Not found",
//       });
//     }
//   },
// };

const server = new grpc.Server();

const todos = [
  {
    id: "1",
    title: "learning-grpc",
    description: "Working on it",
    completed: false,
  },
  {
    id: "2",
    title: "learning-grpc",
    description: "done",
    completed: true,
  },
];

server.addService(todoProto.TodoService.service, {
  getTodos: (call, callback) => {
    db.getAllTodos()
      .then((result) => {
        if (!result) {
          callback(null, { todos: [] });
        }
        callback(null, { todos: result });
      })
      .catch((e) => {
        callback(e);
      });
  },
  createTodo: (call, callback) => {
    const todo = call.request;
    db.saveTodo(todo)
      .then(() => {
        callback(null, todo);
      })
      .catch((e) => {
        callback(e);
      });
  },
  getSingleTodo: (call, callback) => {
    const { id } = call.request;
    db.getTodo(id)
      .then((result) => {
        if (!result) {
          callback("Could not find any todo with that id");
        }
        callback(null, result);
      })
      .catch((e) => {
        callback(e);
      });
  },
  deleteTodo: (call, callback) => {
    const { id } = call.request;
    db.deleteTodo(id)
      .then(() => {
        callback(null, {
          status: true,
        });
      })
      .catch((e) => {
        callback(e);
      });
  },
  updateTodo: (call, callback) => {
    const todo = call.request;
    const { id } = todo;
    db.updateTodo(id, todo)
      .then(() => {
        callback(null, {
          status: true,
        });
      })
      .catch((e) => {
        callback(e);
      });
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server started on http://127.0.0.1:50051`);
    server.start();
  }
);
