import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

export default function AddTask() {
  const navigate = useNavigate();
  const { createTask, loading } = useTasks(); // ✅ Loading add
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    completed: false
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      setError("Please fill all required fields!");
      return;
    }

    try {
      await createTask(formData);
      navigate("/dashboard", { replace: true });
       window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 p-3 bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all z-10"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Form Card */}
      <div className="w-full max-w-lg">
        <div className="bg-black/80 backdrop-blur-xl border border-gray-800/50 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Create New Task
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-2xl text-red-300 text-center animate-pulse">
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
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500/50 text-white placeholder-gray-500 text-lg transition-all shadow-inner"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="What needs to be done? Add details..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500/50 text-white placeholder-gray-500 resize-vertical transition-all shadow-inner"
                required
              />
            </div>

            {/* Priority + Due Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500/50 text-white text-lg transition-all shadow-inner appearance-none"
                >
                  <option value="Low" className="text-green-400">🟢 Low Priority</option>
                  <option value="Medium" className="text-yellow-400">🟡 Medium Priority</option>
                  <option value="High" className="text-red-400">🔴 High Priority</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Due Date *
                </label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900/70 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500/50 text-white text-lg transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Completed */}
            <div className="flex items-center p-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl">
              <input
                name="completed"
                type="checkbox"
                checked={formData.completed}
                onChange={handleChange}
                className="w-6 h-6 accent-yellow-500 rounded-lg focus:ring-yellow-500 shadow-md"
                id="completed"
              />
              <label htmlFor="completed" className="ml-3 text-gray-300 cursor-pointer select-none">
                Mark as completed
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-800/70 hover:bg-gray-700 border border-gray-600 py-4 px-6 rounded-2xl font-semibold text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-yellow-500/50 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}