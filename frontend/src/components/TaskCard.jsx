import { format, isBefore, startOfDay } from 'date-fns';
import { Calendar, AlertCircle, Edit2 } from 'lucide-react';
import clsx from 'clsx';

const TaskCard = ({ task, onStatusChange, onEdit, isAdmin }) => {
  const isOverdue =
    isBefore(new Date(task.dueDate), startOfDay(new Date())) &&
    task.status !== 'completed';

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg p-5 border shadow-sm transition-all hover:shadow-md',
        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900 truncate pr-4">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          {isAdmin && onEdit && (
            <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-indigo-600 transition-colors p-1" title="Edit Task">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <span
            className={clsx(
              'text-xs font-medium px-2.5 py-0.5 rounded-full border',
              statusColors[task.status]
            )}
          >
            {task.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className={clsx(isOverdue && 'text-red-600 font-medium')}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        </div>
        {isOverdue && (
          <div className="flex items-center gap-1 text-red-600 font-medium text-xs bg-red-100 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            Overdue
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <span
          className={clsx(
            'text-xs font-medium px-2 py-1 rounded-md uppercase tracking-wider',
            priorityColors[task.priority]
          )}
        >
          {task.priority} Priority
        </span>

        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-sm border border-gray-300 rounded-md shadow-sm py-1 pl-2 pr-6 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
