import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { optimizeRouteAI } from '../services/geminiService';
import { CollectionRoute } from '../types';
import { MapPin, Navigation, Truck, Loader2 } from 'lucide-react';

export const RouteOptimization: React.FC = () => {
  const { bins, addRoute, routes } = useApp();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeRoute, setActiveRoute] = useState<CollectionRoute | null>(null);

  const handleGenerateRoute = async () => {
    setIsOptimizing(true);
    const newRoute = await optimizeRouteAI(bins);
    if (newRoute) {
      addRoute(newRoute);
      setActiveRoute(newRoute);
    }
    setIsOptimizing(false);
  };

  // Schematic Map Constants
  const MAP_SIZE = 100; // 0-100 coordinate system

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Panel: Controls & Route List */}
      <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-2">AI Route Planner</h2>
          <p className="text-sm text-slate-500 mb-4">
            Use Gemini AI to calculate the most efficient path for bins > 50% full.
          </p>
          <button
            onClick={handleGenerateRoute}
            disabled={isOptimizing}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Optimizing...
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5" /> Generate Optimized Route
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Active Routes</h3>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {routes.length === 0 ? (
              <p className="text-center text-slate-400 text-sm mt-10">No routes generated yet.</p>
            ) : (
              routes.map(route => (
                <div 
                  key={route.id} 
                  onClick={() => setActiveRoute(route)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    activeRoute?.id === route.id 
                      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-400">{route.id}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{route.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {route.stops.length} Stops</span>
                    <span>•</span>
                    <span>{route.totalDistance}</span>
                    <span>•</span>
                    <span>{route.estimatedTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Map Visualization */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded shadow text-xs font-semibold text-slate-500">
          Schematic City View
        </div>
        
        {/* Interactive Schematic Map */}
        <div className="flex-1 bg-slate-50 relative p-8">
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-5" 
               style={{ 
                 backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
               }} 
          />

          {/* Depot */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs">HQ</span>
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-600">DEPOT</span>
          </div>

          {/* Route Lines (SVG Overlay) */}
          {activeRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <polyline 
                  points={
                    `50% 50%, ` + // Start at Depot (Center)
                    activeRoute.stops.map(stop => `${stop.coordinates.x}% ${stop.coordinates.y}%`).join(', ') + 
                    `, 50% 50%`   // Return to Depot
                  }
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="8"
                  strokeLinecap="round"
                  className="animate-pulse"
               />
            </svg>
          )}

          {/* Bins */}
          {bins.map(bin => {
            const isCritical = bin.fillLevel > 80;
            const isStop = activeRoute?.stops.some(s => s.id === bin.id);
            const stopIndex = activeRoute?.stops.findIndex(s => s.id === bin.id);

            return (
              <div 
                key={bin.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${isStop ? 'z-20 scale-110' : 'z-10'}`}
                style={{ left: `${bin.coordinates.x}%`, top: `${bin.coordinates.y}%` }}
              >
                {/* Badge for Route Order */}
                {isStop && stopIndex !== undefined && (
                  <div className="absolute -top-3 -right-3 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-30">
                    {stopIndex + 1}
                  </div>
                )}

                {/* Bin Icon */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 
                  ${isCritical ? 'bg-rose-500 border-rose-600 text-white' : 
                    isStop ? 'bg-emerald-500 border-emerald-600 text-white' : 
                    'bg-white border-slate-300 text-slate-400'}
                `}>
                  <MapPin className="h-4 w-4" />
                </div>
                
                {/* Label */}
                <div className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap
                  ${isStop ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600 opacity-0 hover:opacity-100'}
                `}>
                  {bin.fillLevel}% - {bin.locationName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};