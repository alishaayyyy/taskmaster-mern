import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/tasks.js';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);  // Raw tasks array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state ✅ NEW
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching tasks...');
      const response = await taskService.getAllTasks();
      console.log('Full response:', response);
      
      // Handle backend response format
      let tasksArray = [];
      if (Array.isArray(response)) {
        tasksArray = response;
      } else if (response?.tasks && Array.isArray(response.tasks)) {
        tasksArray = response.tasks;
      } else if (response?.data && Array.isArray(response.data)) {
        tasksArray = response.data;
      } else {
        tasksArray = [];
      }
      
      console.log('✅ Extracted tasks array:', tasksArray);
      setTasks(tasksArray);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setTasks([]);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Create task error:', err);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      console.error('Update task error:', err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
      throw err;
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t._id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  // Apply filters to raw tasks ✅ NEW
  const filteredTasks = tasks.filter(task => {
    // Status filter
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'pending' && !task.completed) ||
      (filters.status === 'completed' && task.completed);
    
    // Priority filter
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider value={{
      tasks: filteredTasks,     // ✅ Filtered tasks (for UI)
      rawTasks: tasks,          // Raw tasks (for mutations)
      loading,
      error,
      filters,                  // ✅ Current filters
      setFilters,               // ✅ Filter setter ✅ FIXED!
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      toggleTask,
      refetch: fetchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};