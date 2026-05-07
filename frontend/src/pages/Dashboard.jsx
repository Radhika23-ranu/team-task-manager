import { useState, useEffect } from 'react';
import { isBefore, startOfDay } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosInstance.get('/tasks');
        setTasks(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (loading) return <Loader />;

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending' || t.status === 'in-progress').length,
    overdue: tasks.filter(
      (t) => t.status !== 'completed' && isBefore(new Date(t.dueDate), startOfDay(new Date()))
    ).length,
  };

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && isBefore(new Date(t.dueDate), startOfDay(new Date()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
      </div>

      <DashboardStats stats={stats} />

      {overdueTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            Action Required: Overdue Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overdueTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-1">You don't have any tasks assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.slice(0, 6).map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
