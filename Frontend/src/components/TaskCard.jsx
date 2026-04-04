import { useState, useCallback } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TaskCard = ({ task = {} }) => {
  const [hovered, setHovered] = useState(false);
  
  const priorityColors = {
    Low: 'border-green-500 bg-green-500/10',
    Medium: 'border-yellow-500 bg-yellow-500/10',
    High: 'border-red-500 bg-red-500/10'
  };

  const getPriorityColor = (priority = 'Medium') => priorityColors[priority] || 'border-gray-500 bg-gray-500/10';

  // ✅ useCallback se wrapped - red line gayab!
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
      className={`black-card p-6 border-l-4 ${getPriorityColor(task.priority)} group hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          task.priority === 'High' ? 'text-red-400 bg-red-500/20' :
          task.priority === 'Medium' ? 'text-yellow-400 bg-yellow-500/20' :
          'text-green-400 bg-green-500/20'
        }`}>
          {task.priority || 'Medium'}
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {task.title || 'Untitled Task'}
        </h3>
        {task.description && (
          <p className="text-gray-400 text-sm line-clamp-2">{task.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <FaCalendar size={14} />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        </div>
        {task.completed && (
          <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;