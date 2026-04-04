import Task from "../models/taskModel.js";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    
    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'Medium',
      dueDate: dueDate,
      completed: completed === 'Yes' || completed === true || false,
      owner: req.user.id
    });
    
    const saved = await task.save();
    return res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      task: saved 
    });
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// ✅ GET ALL TASKS (Owner only)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .lean(); // Faster query
    
    return res.status(200).json({ 
      success: true, 
      tasks 
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tasks' 
    });
  }
};

// ✅ GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      task 
    });
  } catch (err) {
    console.error('Get task error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// ✅ UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Safe completed boolean conversion
    if (updates.completed !== undefined) {
      updates.completed = updates.completed === 'Yes' || updates.completed === true;
    }
    
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: updates },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Task updated successfully',
      task: updated 
    });
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// ✅ DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user.id 
    });
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete task' 
    });
  }
};