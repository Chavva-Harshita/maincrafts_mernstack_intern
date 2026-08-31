import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) =>
        console.error("Error fetching tasks:", err.response?.data || err.message)
      );
  }, []);

  // Add new task
  const addTask = () => {
    if (!text) return alert("Task cannot be empty!");

    axios
      .post("http://localhost:5000/add", { text })
      .then((res) => setTasks([...tasks, res.data]))
      .catch((err) =>
        console.error("Error adding task:", err.response?.data || err.message)
      );

    setText(""); // reset input
  };

  // Put selected task into the input field for editing
  const editTask = (task) => {
    setText(task.text);
    setEditId(task._id);
  };

  // Cancel editing and reset input + editId
  const cancelEdit = () => {
    setText("");
    setEditId(null);
  };

  // Send PUT request to update the task
  const updateTask = () => {
    if (!text) return alert("Task cannot be empty!");
    if (!editId) return;

    axios
      .put(`http://localhost:5000/update/${editId}`, { text })
      .then((res) => {
        // Replace the updated task in state immediately (no refresh)
        setTasks(tasks.map((t) => (t._id === editId ? res.data : t)));
        setText(""); // clear input
        setEditId(null); // exit edit mode
      })
      .catch((err) =>
        console.error("Error updating task:", err.response?.data || err.message)
      );
  };

  // Send DELETE request to remove the task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/delete/${id}`)
      .then(() => {
        // Remove the task from state immediately (no refresh)
        setTasks(tasks.filter((t) => t._id !== id));
      })
      .catch((err) =>
        console.error("Error deleting task:", err.response?.data || err.message)
      );
  };

  return (
    <div className="app-container">
      <h1>MERN To-Do App</h1>

      <div className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
        />

        {editId ? (
          <>
            <button className="update-btn" onClick={updateTask}>
              Update
            </button>
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button className="add-btn" onClick={addTask}>
            Add
          </button>
        )}
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <span className="task-text">{t.text}</span>
            <button className="edit-btn" onClick={() => editTask(t)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTask(t._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;