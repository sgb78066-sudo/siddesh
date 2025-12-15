import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export const Analytics: React.FC = () => {
  const { bins } = useApp();

  // Data Prep for Charts
  const typeData = [
    { name: 'General', value: bins.filter(b => b.type === 'General').length },
    { name: 'Recycle', value: bins.filter(b => b.type === 'Recycle').length },
    { name: 'Organic', value: bins.filter(b => b.type === 'Organic').length },
  ];

  const fillData = bins.map(b => ({
    name: b.locationName.split(' ')[0], // Short name
    fill: b.fillLevel
  }));

  const historyData = [
    { day: 'Mon', collected: 120, overflow: 2 },
    { day: 'Tue', collected: 132, overflow: 1 },
    { day: 'Wed', collected: 101, overflow: 0 },
    { day: 'Thu', collected: 134, overflow: 3 },
    { day: 'Fri', collected: 90, overflow: 1 },
    { day: 'Sat', collected: 230, overflow: 5 },
    { day: 'Sun', collected: 210, overflow: 4 },
  ];

  const COLORS = ['#64748b', '#3b82f6', '#22c55e'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fill Levels Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Real-time Fill Levels</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fillData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="fill" fill="#10b981" radius={[4, 4, 0, 0]} name="Fill %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bin Types Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Bin Distribution by Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Efficiency Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Collection Efficiency</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="collected" stroke="#3b82f6" strokeWidth={2} name="Waste Collected (kg)" />
              <Line type="monotone" dataKey="overflow" stroke="#f43f5e" strokeWidth={2} name="Overflow Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};