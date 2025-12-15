import React from 'react';
import { useApp } from '../context/AppContext';
import { getBinStatus } from '../services/mockData';
import { BinStatus } from '../types';
import { Trash, AlertTriangle, CheckCircle, Truck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { bins, user } = useApp();

  const totalBins = bins.length;
  const criticalBins = bins.filter(b => getBinStatus(b.fillLevel) === BinStatus.CRITICAL);
  const warningBins = bins.filter(b => getBinStatus(b.fillLevel) === BinStatus.WARNING);
  const avgFill = Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / totalBins);

  const stats = [
    { label: 'Total Bins', value: totalBins, icon: Trash, color: 'bg-blue-500' },
    { label: 'Critical Levels', value: criticalBins.length, icon: AlertTriangle, color: 'bg-rose-500' },
    { label: 'Avg Fill Level', value: `${avgFill}%`, icon: BarChart3Icon, color: 'bg-emerald-500' },
    { label: 'Active Trucks', value: '2', icon: Truck, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            Critical Alerts ( > 80% Full )
          </h3>
          <div className="space-y-3">
            {criticalBins.length === 0 ? (
              <p className="text-slate-400 text-sm">No critical alerts. Good job!</p>
            ) : (
              criticalBins.map(bin => (
                <div key={bin.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <div>
                    <p className="font-semibold text-rose-900">{bin.locationName}</p>
                    <p className="text-xs text-rose-600">{bin.type} Waste • ID: {bin.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-rose-200 text-rose-800 text-xs font-bold rounded">
                      {bin.fillLevel}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity / Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            System Health
          </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">IoT Sensors Online</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Network Latency</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">24ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Last Database Sync</span>
                <span className="text-slate-800 font-medium text-sm">Just now</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Total Waste Collected Today</p>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 kg</span>
                  <span>1,250 kg</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}