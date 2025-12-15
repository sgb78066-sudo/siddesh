import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Trash2, 
  Map, 
  BarChart3, 
  LogOut, 
  Menu,
  Truck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.COLLECTOR, UserRole.CITIZEN] },
    { id: 'bins', label: 'Bin Management', icon: Trash2, roles: [UserRole.ADMIN, UserRole.COLLECTOR] },
    { id: 'routes', label: 'Route Optimization', icon: Map, roles: [UserRole.ADMIN, UserRole.COLLECTOR] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: [UserRole.ADMIN] },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-emerald-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-emerald-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <Truck className="h-6 w-6 text-emerald-400" />
              <span>EcoTrack<span className="text-emerald-400">AI</span></span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-emerald-800 rounded">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-2 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-emerald-300 truncate capitalize">{user?.role.toLowerCase()}</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`mt-4 w-full flex items-center gap-2 px-2 py-2 text-rose-300 hover:bg-emerald-900/50 rounded transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="h-4 w-4" />
            {isSidebarOpen && <span className="text-xs font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800 capitalize">
            {menuItems.find(i => i.id === currentPage)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
             {/* Simulated Notification Bell could go here */}
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};