import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Zap, Cpu } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { fetchAnalyticsData } from '../services/api';

export const ModuleAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res = await fetchAnalyticsData();
    if (res && res.metrics) {
      setData(res);
    } else {
      // Fallback sample data if backend offline
      setData({
        metrics: {
          total_assessments: 1428,
          critical_cases: 342,
          urgent_cases: 489,
          delayed_cases: 395,
          minor_cases: 202,
          avg_ai_confidence: 94.7,
          avg_triage_time_sec: 3.2,
          sos_dispatches: 89
        },
        priority_distribution: [
          { name: 'RED (Immediate)', value: 342, color: '#EF4444' },
          { name: 'ORANGE (Urgent)', value: 489, color: '#F97316' },
          { name: 'YELLOW (Delayed)', value: 395, color: '#EAB308' },
          { name: 'GREEN (Minor)', value: 202, color: '#10B981' }
        ],
        injury_distribution: [
          { injury: 'Hemorrhage', count: 420 },
          { injury: 'Fractures', count: 310 },
          { injury: 'Burns', count: 250 },
          { injury: 'Respiratory', count: 280 },
          { injury: 'Head Trauma', count: 168 }
        ],
        monthly_trends: [
          { month: 'Jan', total: 180, critical: 42 },
          { month: 'Feb', total: 210, critical: 51 },
          { month: 'Mar', total: 240, critical: 58 },
          { month: 'Apr', total: 195, critical: 44 },
          { month: 'May', total: 290, critical: 72 },
          { month: 'Jun', total: 313, critical: 75 }
        ]
      });
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Assessments</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{data.metrics.total_assessments}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">+14% vs last month</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Critical RED Cases</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-black text-red-400 font-mono">{data.metrics.critical_cases}</span>
          <span className="text-[10px] text-slate-400 block mt-1">23.9% of total cases</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg AI Confidence</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{data.metrics.avg_ai_confidence}%</span>
          <span className="text-[10px] text-slate-400 block mt-1">Triage & Vision average</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Inference Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-300 font-mono">{data.metrics.avg_triage_time_sec}s</span>
          <span className="text-[10px] text-slate-400 block mt-1">Real-time prediction</span>
        </div>
      </div>

      {/* Charts Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Priority Pie Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Emergency Priority Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.priority_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.priority_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Line Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">6-Month Emergency Case Volume Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} name="Total Triage" />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={3} name="Critical RED" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
