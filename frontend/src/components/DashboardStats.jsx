import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-full ${bgColorClass} ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon={ListTodo}
        colorClass="text-blue-600"
        bgColorClass="bg-blue-100"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        colorClass="text-green-600"
        bgColorClass="bg-green-100"
      />
      <StatCard
        title="Pending"
        value={stats.pending}
        icon={Clock}
        colorClass="text-yellow-600"
        bgColorClass="bg-yellow-100"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        icon={AlertCircle}
        colorClass="text-red-600"
        bgColorClass="bg-red-100"
      />
    </div>
  );
};

export default DashboardStats;
