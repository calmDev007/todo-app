const mongoose = require("mongoose");
require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const Todo = require("./models/Todo");

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const todo = await Todo.create({ text: text.trim() });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text, completed },
      { new: true } // return updated object
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error: ", err));
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});