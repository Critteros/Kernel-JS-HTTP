const express = require("express");

// Port na którym będzie nasłuchiwać serwer
const PORT = 9000;

// Initializacja aplikacji
const app = express();
app.use(express.json());

const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
  },
];

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  Tutaj należy dodać kod

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Start serwera
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
