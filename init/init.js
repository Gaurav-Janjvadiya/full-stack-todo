const mongoose = require("mongoose");
const Todo = require("../models/todo"); // Assuming your schema is in todo.js
const { faker } = require("@faker-js/faker");

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
  const tasks = [
    "Water the indoor plants.",
    "Update the resume with recent projects.",
    "Research vacation destinations for the winter.",
    "Plan the menu for the dinner party.",
    "Backup important files to the cloud.",
    "Buy a birthday gift for a friend.",
    "Clean out the email inbox.",
    "Set up a new password for the online banking account.",
    "Read the first three chapters of the new book.",
    "Declutter the living room shelves.",
    "Prepare a presentation for the client meeting.",
    "Call the internet provider about the billing issue.",
    "Organize the digital photos into albums.",
    "Walk the dog in the evening.",
    "Review the notes from last week's meeting.",
    "Plan the weekend hiking trip.",
    "Send out invitations for the upcoming event.",
    "Bake cookies for the office potluck.",
    "Update the project timeline in the tracking tool.",
    "Renew the subscription for the online service.",
  ];

  const todos = [];

  for (let i = 0; i < 20; i++) {
    todos.push({
      // todo: faker.lorem.sentence(),
      todo: tasks[i],
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
