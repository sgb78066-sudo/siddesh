import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BinStatus } from '../types';
import { getBinStatus } from '../services/mockData';
import { predictOverflowAI } from '../services/geminiService';
import { RefreshCw, Search, Zap } from 'lucide-react';

export const BinManagement: React.FC = () => {
  const { bins, updateBin } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [predictingId, setPredictingId] = useState<string | null>(null);

  const handleEmptyBin = (id: string) => {
    updateBin(id, { fillLevel: 0, lastCollected: new Date().toISOString() });
  };

  const handlePredict = async (bin: any) => {
    setPredictingId(bin.id);
    const prediction = await predictOverflowAI(bin);
    updateBin(bin.id, { predictedOverflow: prediction });
    setPredictingId(null);
  };

  const filteredBins = bins.filter(b => 
    b.locationName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search bins..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Bin ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fill Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Last Collected</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">AI Prediction</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBins.map((bin) => {
                const status = getBinStatus(bin.fillLevel);
                const statusColor = 
                  status === BinStatus.CRITICAL ? 'bg-rose-100 text-rose-700' :
                  status === BinStatus.WARNING ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700';

                return (
                  <tr key={bin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{bin.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{bin.locationName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        bin.type === 'Recycle' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        bin.type === 'Organic' ? 'border-green-200 bg-green-50 text-green-700' :
                        'border-slate-200 bg-slate-50 text-slate-700'
                      }`}>
                        {bin.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              bin.fillLevel > 80 ? 'bg-rose-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} 
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-8">{bin.fillLevel}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(bin.lastCollected).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {bin.predictedOverflow ? (
                        <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded inline-block">
                          Full by: {bin.predictedOverflow}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handlePredict(bin)}
                          disabled={predictingId === bin.id}
                          className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:opacity-50"
                        >
                          <Zap className="h-3 w-3" />
                          {predictingId === bin.id ? 'Thinking...' : 'Predict'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleEmptyBin(bin.id)}
                        className="text-slate-500 hover:text-emerald-600 p-1 rounded hover:bg-emerald-50 transition-colors"
                        title="Mark as Empty"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};