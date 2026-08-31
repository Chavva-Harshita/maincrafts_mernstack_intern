const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
app.use(cors());
app.use(express.json());

let Task;

async function startServer() {
  try {
    // Try to connect to MongoDB Atlas first
    let connected = false;
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB Atlas Connected");
      connected = true;
    } catch (atlasErr) {
      console.log("Atlas connection failed, using in-memory MongoDB...");
    }

    // If Atlas failed, use MongoDB Memory Server
    if (!connected) {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("MongoDB Memory Server Connected:", uri);
    }

    Task = mongoose.model(
      "Task",
      new mongoose.Schema({ text: String })
    );

    // Add new task
    app.post("/add", async (req, res) => {
      const newTask = new Task(req.body);
      await newTask.save();

      res.send(newTask);
    });

    // Get all tasks
    app.get("/tasks", async (req, res) => {
      const tasks = await Task.find();

      res.send(tasks);
    });
    // Update task
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { text },
    { new: true }
  );

  res.send(updatedTask);
});

// Delete task
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  await Task.findByIdAndDelete(id);

  res.send({
    message: "Task deleted successfully"
  });
});
    // Update task


    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (err) {
    console.error("Server startup error:", err.message);
    process.exit(1);
  }
}



startServer();