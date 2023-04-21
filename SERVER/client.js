const PROTO_PATH = "./proto/todos.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const todoPackageDefinition = grpc.loadPackageDefinition(packageDefinition).todo;

const client = new todoPackageDefinition.TodoService(
    'localhost:50051',
    grpc.credentials.createInsecure(),
);

module.exports = client;
