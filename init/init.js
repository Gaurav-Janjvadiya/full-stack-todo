const mongoose = require("mongoose");
const Todo = require("../models/todo"); // Assuming your schema is in todo.js
const { faker } = require('@faker-js/faker');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mytodo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  insertFakeData();
});

// Function to insert fake data
const insertFakeData = async () => {
  const todos = [];

  for (let i = 0; i < 10; i++) {
    todos.push({
      todo: faker.lorem.sentence(),
    });
  }

  try {
    await Todo.insertMany(todos);
    console.log("Fake data inserted");
  } catch (error) {
    console.error("Error inserting fake data:", error);
  } finally {
    db.close(); // Close the connection once done
  }
};
