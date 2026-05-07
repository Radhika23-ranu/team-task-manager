import { Link, Navigate, Outlet } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col hidden md:flex">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">TaskFlow</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t text-sm text-gray-500">
        <p className="font-semibold text-gray-900">{user?.name}</p>
        <p className="capitalize">{user?.role}</p>
      </div>
    </div>
  );
};

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 md:hidden">
        <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
