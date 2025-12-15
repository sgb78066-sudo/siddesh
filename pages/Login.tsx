import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Truck, Shield, User, Leaf, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Side - Brand / Visual */}
        <div className="w-full md:w-1/2 bg-emerald-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-800/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-800/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-emerald-500/20 p-2 rounded-lg backdrop-blur-sm border border-emerald-400/20">
                <Leaf className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-bold tracking-tight">EcoTrack<span className="text-emerald-400">AI</span></span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
              Smarter cities start with smarter waste.
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-md">
              Leverage AI to optimize collection routes, predict overflow events in real-time, and significantly reduce your city's carbon footprint.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex flex-wrap gap-4 text-sm font-medium text-emerald-300">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Real-time Monitoring
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Route Optimization
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Predictive Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Controls */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Please select your role to access the dashboard simulation.</p>
          </div>

          <div className="space-y-4">
            <RoleButton 
              role="City Administrator" 
              description="Full system control, analytics & AI route planning"
              icon={Shield}
              colorClass="emerald"
              onClick={() => login(UserRole.ADMIN)}
            />
            
            <RoleButton 
              role="Waste Collector" 
              description="View assigned routes, update bin status"
              icon={Truck}
              colorClass="blue"
              onClick={() => login(UserRole.COLLECTOR)}
            />
            
            <RoleButton 
              role="Concerned Citizen" 
              description="View public bin map, report issues"
              icon={User}
              colorClass="purple"
              onClick={() => login(UserRole.CITIZEN)}
            />
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 font-medium">
               © 2024 EcoTrack AI. Secure Enterprise Login System.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RoleButtonProps {
  role: string;
  description: string;
  icon: React.ElementType;
  colorClass: 'emerald' | 'blue' | 'purple';
  onClick: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({ role, description, icon: Icon, colorClass, onClick }) => {
  const styles = {
    emerald: {
      wrapper: 'hover:border-emerald-500 hover:bg-emerald-50/50',
      iconBg: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 group-hover:text-emerald-700',
    },
    blue: {
      wrapper: 'hover:border-blue-500 hover:bg-blue-50/50',
      iconBg: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:text-blue-700',
    },
    purple: {
      wrapper: 'hover:border-purple-500 hover:bg-purple-50/50',
      iconBg: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200 group-hover:text-purple-700',
    }
  };

  const style = styles[colorClass];

  return (
    <button 
      onClick={onClick}
      className={`w-full group text-left p-4 rounded-xl border border-slate-200 transition-all duration-200 flex items-center justify-between ${style.wrapper}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg transition-colors ${style.iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{role}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-x-1" />
    </button>
  );
};