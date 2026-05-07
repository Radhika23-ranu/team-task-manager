import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Filter } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import useAuthStore from '../store/authStore';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axiosInstance.get('/tasks'),
        axiosInstance.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (projectsRes.data.length > 0) {
        setFormData((prev) => ({ 
          ...prev, 
          project: projectsRes.data[0]._id,
          assignedTo: ''
        }));
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project._id || task.project,
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingTaskId) {
        await axiosInstance.put(`/tasks/${editingTaskId}`, formData);
        toast.success('Task updated successfully');
      } else {
        await axiosInstance.post('/tasks', formData);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        project: projects[0]?._id || '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
      });
      setEditingTaskId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track all tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingTaskId(null);
                setFormData({
                  title: '',
                  description: '',
                  project: projects[0]?._id || '',
                  assignedTo: '',
                  priority: 'medium',
                  dueDate: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or create a new task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onEdit={handleEditClick} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTaskId ? 'Edit Task' : 'Create New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                required
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value, assignedTo: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Unassigned --</option>
                {projects.find(p => p._id === formData.project)?.members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || projects.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {submitLoading ? (editingTaskId ? 'Updating...' : 'Creating...') : (editingTaskId ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
