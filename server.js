require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Todos = mongoose.model("todos", todoSchema);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connect", () => {
  console.log("MongoDB connected!");
});
mongoose.connection.on("error", (err) => {
  logError(err);
});

//Routes
//The get route
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await Todos.find({});
    res.send({ status: "OK", data: allTodos });
  } catch (error) {
    console.log("error unable to GET todos", error);
  }
});
//The post route
app.post("/todos", async (req, res) => {
  //create a new todo
  const newTodo = {
    title: req.body.title,
    description: req.body.description,
  };
  const addTodo = new Todos(newTodo);
  await addTodo.save();
  res
    .status(200)
    .json({ message: "succesfully added todos: ", todoId: newTodo._id });
});
//put todo reute to update existing todo with the help of a button.
app.put("/todos/:id", async (req, res) => {
  const updateTodo = await Todos.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updateTodo) {
    res.status(200).json({ message: "Updated Succesfully" });
  } else {
    res.status(404).json({ message: "todo not found" });
  }
});

//the delete route
app.delete("/todos/:id", async (req, res) => {
  await Todos.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Deleted succesfully" });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
