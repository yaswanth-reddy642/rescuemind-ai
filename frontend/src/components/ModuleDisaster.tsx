import React, { useState, useEffect } from 'react';
import { Flame, Waves, Activity, AlertTriangle, ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';
import { fetchDisasterProtocol } from '../services/api';

export const ModuleDisaster: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<string>('flood');
  const [protocol, setProtocol] = useState<any>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProtocol(selectedDisaster);
  }, [selectedDisaster]);

  const loadProtocol = async (type: string) => {
    const data = await fetchDisasterProtocol(type);
    setProtocol(data);
  };

  const toggleChecklist = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const disasters = [
    { id: 'flood', label: 'Flood', icon: Waves, color: 'text-blue-400' },
    { id: 'earthquake', label: 'Earthquake', icon: Activity, color: 'text-amber-400' },
    { id: 'fire', label: 'Wildfire / Structure', icon: Flame, color: 'text-red-400' },
    { id: 'cyclone', label: 'Cyclone / Hurricane', icon: AlertTriangle, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {disasters.map((d) => {
          const Icon = d.icon;
          const isActive = selectedDisaster === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDisaster(d.id)}
              className={`p-4 rounded-2xl glass-panel text-left transition-all border ${
                isActive
                  ? 'border-red-500/50 bg-slate-800/80 shadow-glow'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${d.color} mb-2`} />
              <span className="font-bold text-sm text-white block">{d.label}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Survival Guide</span>
            </button>
          );
        })}
      </div>

      {/* Protocol Details & Checklist */}
      {protocol && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Immediate Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">{protocol.title}</h3>
                <span className="text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded">
                  {protocol.hazard_level}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">Immediate Crisis Actions</span>
              <div className="space-y-2.5">
                {protocol.immediate_actions.map((act: string, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl text-xs flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-slate-200 leading-relaxed">{act}</p>
                  </div>
                ))}
              </div>

              {protocol.communication_tips && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{protocol.communication_tips}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Preparedness Checklist */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Preparedness Checklist
                </h3>
                <span className="text-xs text-slate-400 font-mono">Offline Cached</span>
              </div>

              <div className="space-y-2.5">
                {protocol.checklist.map((item: any) => {
                  const isChecked = completedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-3.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                        <span className={isChecked ? 'line-through text-slate-400' : 'font-medium'}>
                          {item.item}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
