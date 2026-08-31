import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data));
  }, []);

  // Add new task
  const addTask = () => {
    if (!text) return alert("Task cannot be empty!");

    axios
      .post("http://localhost:5000/add", { text })
      .then((res) => setTasks([...tasks, res.data]));

    setText(""); // reset input
  };

  return (
    <div>
      <h1>MERN To-Do App</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;