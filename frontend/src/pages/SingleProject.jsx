import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Trash2, UserPlus, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import useAuthStore from '../store/authStore';

const SingleProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProjectAndUsers = async () => {
      try {
        const { data } = await axiosInstance.get(`/projects/${id}`);
        setProject(data);
        if (user?.role === 'admin') {
          const usersRes = await axiosInstance.get('/auth/users');
          setUsers(usersRes.data);
        }
      } catch (error) {
        toast.error('Failed to load project details');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndUsers();
  }, [id, navigate, user?.role]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axiosInstance.delete(`/projects/${id}`);
        toast.success('Project deleted');
        navigate('/projects');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitLoading(true);
    try {
      await axiosInstance.post(`/projects/${id}/add-member`, { userId: selectedUser });
      toast.success('Member added');
      const { data } = await axiosInstance.get(`/projects/${id}`);
      setProject(data);
      setIsModalOpen(false);
      setSelectedUser('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await axiosInstance.post(`/projects/${id}/remove-member`, { userId: memberId });
        setProject({
          ...project,
          members: project.members.filter(m => m._id !== memberId)
        });
        toast.success('Member removed');
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  if (loading) return <Loader />;
  if (!project) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-500 text-sm">
              Created by <span className="font-medium text-gray-900">{project.createdBy.name}</span> on{' '}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="prose max-w-none text-gray-600 mb-8">
          <p>{project.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 flex justify-between items-center">
            <span>Team Members ({project.members.length})</span>
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </h3>
          {project.members.length === 0 ? (
            <p className="text-gray-500 italic">No members added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="ml-auto text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Member"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose User --</option>
              {users
                .filter(u => !project.members.some(m => m._id === u._id) && project.createdBy._id !== u._id)
                .map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
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
              disabled={submitLoading || !selectedUser}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {submitLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SingleProject;
