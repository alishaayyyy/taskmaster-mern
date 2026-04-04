import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaClock, 
  FaPlus 
} from "react-icons/fa";

export default function TaskList() {
  const { tasks, loading, filters, setFilters, deleteTask, toggleTask } = useTasks();
  const navigate = useNavigate();
  
  const [localFilter, setLocalFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    setFilters({
      status: localFilter,
      priority: priorityFilter,
      search: ''
    });
  }, [localFilter, priorityFilter, setFilters]);

  const filteredTasks = tasks;

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleToggle = async (taskId) => {
    try {
      await toggleTask(taskId);
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white px-6 py-8 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin shadow-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header - UNCHANGED */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
            All Tasks ({filteredTasks.length})
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Manage, edit and track your tasks</p>
        </div>
        <Link 
          to="/add-task"
          className="btn-primary px-8 py-4 flex items-center space-x-3 shadow-2xl hover:shadow-yellow-500/50 text-lg font-bold self-start sm:self-auto"
        >
          <FaPlus />
          <span>Add New Task</span>
        </Link>
      </div>

      {/* Filters - UNCHANGED */}
      <div className="glass-card p-8 shadow-2xl">
        {/* ... filters code same ... */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-gray-900/50 backdrop-blur-sm rounded-2xl p-3 border border-gray-800/50 shadow-lg">
            {[
              { value: "all", label: "All Tasks", count: filteredTasks.length },
              { value: "pending", label: "Pending", count: filteredTasks.filter(t => !t.completed).length },
              { value: "completed", label: "Completed", count: filteredTasks.filter(t => t.completed).length }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setLocalFilter(item.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md text-sm flex items-center space-x-1 ${
                  localFilter === item.value
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-yellow-500/50 scale-105'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 hover:shadow-yellow-500/25 border border-transparent hover:border-yellow-500/50'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs font-bold bg-black/50 px-2 py-1 rounded-full min-w-[28px] text-center">
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-900/70 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-yellow-500/40 focus:border-yellow-500/50 shadow-lg text-lg font-semibold transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Priorities ({filteredTasks.length})</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all shadow-lg hover:shadow-yellow-500/25"
              title="Refresh tasks"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="glass-card p-8 shadow-2xl">
        {filteredTasks.length === 0 ? (
          // Empty state unchanged
          <div className="text-center py-24 px-8">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-400 mb-4">No tasks found</h3>
            <p className="text-gray-500 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
              {localFilter === 'all' ? 'No tasks yet. Create your first task to get started!' : 
               `No ${localFilter} tasks match your current filters.`}
            </p>
            <Link 
              to="/add-task"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              <FaPlus className="w-6 h-6" />
              <span>Create First Task</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTasks.map(task => (
              <div key={task._id} className={`group relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all backdrop-blur-sm border-2 h-full ${
                task.completed 
                  ? 'border-green-500/40 bg-green-500/5 shadow-green-500/20 hover:shadow-green-500/40' 
                  : task.priority === 'High' 
                    ? 'border-red-500/40 bg-red-500/5 shadow-red-500/20 hover:shadow-red-500/40' 
                    : task.priority === 'Medium' 
                      ? 'border-yellow-500/40 bg-yellow-500/5 shadow-yellow-500/20 hover:shadow-yellow-500/40' 
                      : 'border-blue-500/40 bg-blue-500/5 shadow-blue-500/20 hover:shadow-blue-500/40'
              } hover:scale-[1.02] hover:shadow-3xl`}>
                
                {/* Priority Badge */}
                <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform rotate-[-5deg] ${
                  task.priority === 'High' ? 'bg-red-500/90 text-white shadow-red-500/50' :
                  task.priority === 'Medium' ? 'bg-yellow-500/90 text-black shadow-yellow-500/50' :
                  'bg-green-500/90 text-white shadow-green-500/50'
                }`}>
                  {task.priority}
                </div>

                <div className="relative z-10 h-full flex flex-col space-y-4">
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white line-clamp-2 pr-4">
                        {task.title}
                      </h3>
                    </div>

                    {task.description && (
                      <p className="text-gray-400 text-lg leading-relaxed line-clamp-3">
                        {task.description}
                      </p>
                    )}

                    {/* Status & Date */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 mt-auto">
                      <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                        task.completed 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {task.completed ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaClock className="w-4 h-4" />
                        )}
                        <span>{task.completed ? 'Completed' : 'Pending'}</span>
                      </div>
                      <div className="text-gray-500 font-mono text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* ✅ Buttons ALWAYS VISIBLE - No hover! */}
                  <div className="pt-6 border-t border-gray-800/30">
                    <div className="flex gap-3">
                      <Link
                        to={`/edit-task/${task._id}`}
                        className="flex-1 bg-gradient-to-r from-emerald-500/90 to-teal-600/90 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-bold shadow-xl hover:shadow-emerald-500/50 text-sm flex items-center justify-center space-x-2 transition-all backdrop-blur-sm border border-emerald-500/30 hover:scale-[1.02]"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="flex-1 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-bold shadow-xl hover:shadow-red-500/50 text-sm flex items-center justify-center space-x-2 transition-all backdrop-blur-sm border border-red-500/30 hover:scale-[1.02]"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}