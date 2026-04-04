import { useEffect, useState } from 'react';
import { FaPlus, FaCheckCircle, FaClock, FaFilter, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { tasks, loading, error, refetch } = useTasks();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Safe stats calculation
  useEffect(() => {
    if (Array.isArray(tasks)) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed === true).length;
      setStats({ total, completed, pending: total - completed });
    }
  }, [tasks]);

  // Safe filtered tasks
  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter(task => {
        const isCompleted = task.completed === true;
        const matchesFilter = 
          filter === 'all' || 
          (filter === 'completed' && isCompleted) || 
          (filter === 'pending' && !isCompleted);
        
        const matchesSearch = 
          task.title?.toLowerCase().includes(search.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toLowerCase());
        
        return matchesFilter && matchesSearch;
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 yellow-gradient rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="black-card p-8 text-center hover:scale-105 transition-all duration-200">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.total}</div>
          <div className="text-gray-400 text-lg">Total Tasks</div>
        </div>
        <div className="black-card p-8 text-center hover:scale-105 transition-all duration-200">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
          <div className="text-gray-400 text-lg">Completed</div>
        </div>
        <div className="black-card p-8 text-center hover:scale-105 transition-all duration-200">
          <div className="text-3xl font-bold text-red-400 mb-2">{stats.pending}</div>
          <div className="text-gray-400 text-lg">Pending</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="black-card p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              className="input-field pl-12 pr-4 py-3 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {[
              { value: 'all', label: 'All Tasks', count: stats.total },
              { value: 'pending', label: 'Pending', count: stats.pending },
              { value: 'completed', label: 'Completed', count: stats.completed }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-1 text-sm ${
                  filter === item.value
                    ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-400/30 text-yellow-400 border-2 border-yellow-400/50 shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400 border border-gray-700/50 hover:border-yellow-500/50'
                }`}
              >
                <span>{item.label}</span>
                <span className="font-bold text-xs">({item.count})</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-gray-400">
          <span>Showing {filteredTasks.length} of {Array.isArray(tasks) ? tasks.length : 0} tasks</span>
          {error && (
            <button 
              onClick={refetch}
              className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center space-x-1"
            >
              <FaSync size={14} className="animate-spin" />
              <span>Retry</span>
            </button>
          )}
          <Link 
            to="/add-task" 
            className="btn-primary px-6 py-2 flex items-center space-x-2 text-sm"
          >
            <FaPlus />
            <span>Add New Task</span>
          </Link>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="black-card p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-1">
              {filter === 'all' ? 'All Tasks' : 
               filter === 'completed' ? 'Completed Tasks' : 'Pending Tasks'}
            </h2>
            <p className="text-gray-500">{filteredTasks.length} tasks found</p>
          </div>
          <Link 
            to="/task-list" 
            className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center space-x-2 group"
          >
            <span>View All Tasks</span>
            <FaCheckCircle size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <FaClock className="w-24 h-24 text-gray-600 mx-auto mb-8 opacity-40" />
            <h3 className="text-2xl font-bold text-gray-400 mb-3">
              {search ? 'No matching tasks' : 
               filter === 'all' ? 'No tasks yet' : 
               `No ${filter} tasks`}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {search 
                ? 'Try different keywords or clear search' 
                : filter === 'all' 
                  ? 'Get started by creating your first task' 
                  : `You don't have any ${filter} tasks yet`}
            </p>
            <Link 
              to="/add-task" 
              className="btn-primary px-8 py-3 font-semibold text-lg shadow-lg"
            >
              <FaPlus className="inline mr-2" />
              Create First Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.slice(0, 9).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;