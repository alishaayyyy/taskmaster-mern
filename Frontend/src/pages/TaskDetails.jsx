import React, { useEffect, useState } from "react";
import { getTaskById, deleteTask } from "../services/tasks.js";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(id);
      setTask(data);
    } catch (err) {
      setError("Failed to load task.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        navigate("/tasks");
      } catch (err) {
        setError("Failed to delete task.");
      }
    }
  };

  if (loading) return <p className="text-white p-6">Loading task...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!task) return <p className="text-white p-6">Task not found.</p>;

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">{task.title}</h1>

      <div className="bg-black p-6 rounded-lg shadow-md space-y-4 animate-fadeIn">
        <p><span className="font-semibold">Description:</span> {task.description}</p>
        <p><span className="font-semibold">Priority:</span> {task.priority}</p>
        <p><span className="font-semibold">Status:</span> {task.completed ? "✅ Completed" : "❌ Pending"}</p>
        <p><span className="font-semibold">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p><span className="font-semibold">Created At:</span> {new Date(task.createdAt).toLocaleDateString()}</p>
        <p><span className="font-semibold">Updated At:</span> {new Date(task.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          to={`/tasks/${task._id}/edit`}
          className="bg-primary text-black px-4 py-2 rounded hover:scale-105 transition"
        >
          Edit Task
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 px-4 py-2 rounded hover:scale-105 transition"
        >
          Delete Task
        </button>
        <Link
          to="/tasks"
          className="bg-gray-800 px-4 py-2 rounded hover:scale-105 transition"
        >
          Back to Tasks
        </Link>
      </div>
    </div>
  );
}