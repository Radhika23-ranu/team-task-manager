import { Link } from 'react-router-dom';
import { Users, LayoutList } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
    >
      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
        {project.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-6">
        {project.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium text-xs">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
