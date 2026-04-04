import React, { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";  // ✅ Context
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaTrash } from "react-icons/fa";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { rawTasks, updateTask, deleteTask } = useTasks();  // ✅ Context
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    completed: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [taskNotFound, setTaskNotFound] = useState(false);

  // Load task from context
  useEffect(() => {
    const task = rawTasks.find(t => t._id === id);
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        completed: Boolean(task.completed)
      });
    } else {
      setTaskNotFound(true);
    }
  }, [id, rawTasks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required!");
      return;
    }

    try {
      setSaving(true);
      await updateTask(id, formData);
      
      // Instant smooth redirect
      window.location.replace('/task-list');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      try {
        await deleteTask(id);
        navigate('/task-list');
      } catch (err) {
        setError("Failed to delete task!");
      }
    }
  };

  if (taskNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
        <div className="bg-black/80 backdrop-blur-xl p-12 rounded-3xl border border-gray-800 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-400 mb-6">Task Not Found</h1>
          <p className="text-gray-500 mb-8">The task has been deleted or doesn't exist.</p>
          <button 
            onClick={() => navigate('/task-list')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-yellow-500/50 transition-all"
          >
            View All Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 p-3 bg-black/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-2xl z-10 hover:scale-105"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Form Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-black/85 backdrop-blur-2xl border border-gray-800/60 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
            Edit Task
          </h1>

          {error && (
            <div className="mb-8 p-5 bg-red-900/50 border-2 border-red-500/50 rounded-2xl text-red-300 text-center animate-pulse shadow-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Task Title *
              </label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-5 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-white placeholder-gray-500 text-lg transition-all shadow-xl hover:shadow-emerald-500/20"
                placeholder="Enter task title"
                required
                disabled={saving}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full p-5 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-white placeholder-gray-500 resize-vertical transition-all shadow-xl hover:shadow-emerald-500/20"
                placeholder="Describe the task..."
                required
                disabled={saving}
              />
            </div>

            {/* Priority + Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-5 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-white text-lg transition-all shadow-xl hover:shadow-emerald-500/20 appearance-none cursor-pointer"
                  disabled={saving}
                >
                  <option value="Low">🟢 Low Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="High">🔴 High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-5 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-white text-lg transition-all shadow-xl hover:shadow-emerald-500/20"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Completed */}
            <div className="flex items-center p-5 bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-inner">
              <input
                name="completed"
                type="checkbox"
                checked={formData.completed}
                onChange={handleChange}
                className="w-7 h-7 accent-emerald-500 rounded-xl focus:ring-emerald-500 shadow-lg transform hover:scale-110 transition-all"
                id="completed"
                disabled={saving}
              />
              <label htmlFor="completed" className="ml-4 text-xl font-semibold text-gray-200 cursor-pointer select-none">
                Mark as Completed
              </label>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/task-list')}
                className="bg-gray-800/70 hover:bg-gray-700 border-2 border-gray-600 py-5 px-8 rounded-2xl font-bold text-gray-200 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all hover:shadow-xl shadow-lg h-14 flex items-center justify-center disabled:opacity-50"
                disabled={saving}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all h-14 flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Update Task</span>
                  </>
                )}
              </button>
            </div>

            {/* Delete Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all hover:scale-[1.02] border border-red-500/30"
              >
                <FaTrash className="inline-block mr-2 w-5 h-5" />
                Delete Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}