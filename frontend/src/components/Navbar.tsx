import React from 'react';
import { ShieldAlert, Activity, Eye, Mic, Flame, MapPin, BarChart3, User, Wifi, WifiOff, PhoneCall } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  onOpenSOSModal: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  onOpenSOSModal,
  onOpenProfile
}) => {
  const navItems = [
    { id: 'triage', label: 'AI Assessment', icon: Activity },
    { id: 'vision', label: 'Injury Scanner', icon: Eye },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'disaster', label: 'Disaster Survival', icon: Flame },
    { id: 'hospitals', label: 'Hospital Finder', icon: MapPin },
    { id: 'analytics', label: 'Live Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('triage')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-red-400 flex items-center justify-center shadow-glow-red border border-red-400/40">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-sans">
                  RescueMind <span className="text-red-500">AI</span>
                </h1>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                  v1.0 EMERGENCY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Offline Triage & Disaster Response Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-glow-red border border-red-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Network Mode, Profile & Big Red SOS Trigger */}
          <div className="flex items-center gap-3">
            
            {/* Mode Switcher Button */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
              title="Toggle client-side offline mode"
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isOffline ? 'OFFLINE ONNX' : 'ONLINE AI'}</span>
            </button>

            {/* Direct SOS Dispatch Button */}
            <button
              onClick={onOpenSOSModal}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase shadow-glow-red transition-all active:scale-95 border border-red-400/40"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>SOS ALERT</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition-all shadow-sm"
              title="Medical Profile & Emergency Contacts"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Tab Row */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 border-t border-slate-800 gap-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  isActive ? 'bg-red-600 text-white border border-red-500' : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
