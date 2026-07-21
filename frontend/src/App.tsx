import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ModuleAssessment } from './components/ModuleAssessment';
import { ModuleVision } from './components/ModuleVision';
import { ModuleVoice } from './components/ModuleVoice';
import { ModuleDisaster } from './components/ModuleDisaster';
import { ModuleHospitals } from './components/ModuleHospitals';
import { ModuleAnalytics } from './components/ModuleAnalytics';
import { ModuleSOS } from './components/ModuleSOS';
import { ModuleProfile } from './components/ModuleProfile';
import { Shield, Radio } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('triage');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [activeTriageData, setActiveTriageData] = useState<any>(null);

  const handleTriggerSOS = (triageData?: any) => {
    if (triageData) setActiveTriageData(triageData);
    setIsSOSOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onOpenSOSModal={() => handleTriggerSOS()}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Alert for Simulated Offline ONNX Mode */}
        {isOffline && (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Offline Client-Side ONNX Active
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Network connection bypassed. All triage calculations, PDF exports, and local SOS queuing are executing 100% locally in your browser.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOffline(false)}
              className="text-xs font-mono text-amber-300 hover:text-white underline"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Dynamic Module Renderer */}
        {activeTab === 'triage' && <ModuleAssessment onTriggerSOS={handleTriggerSOS} />}
        {activeTab === 'vision' && <ModuleVision />}
        {activeTab === 'voice' && <ModuleVoice />}
        {activeTab === 'disaster' && <ModuleDisaster />}
        {activeTab === 'hospitals' && <ModuleHospitals />}
        {activeTab === 'analytics' && <ModuleAnalytics />}

      </main>

      {/* Modals */}
      <ModuleSOS
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        triageSummary={activeTriageData}
      />

      <ModuleProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-slate-300">RescueMind AI Emergency Assistant</span>
            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">v1.0.0</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>FastAPI Backend: Ready</span>
            <span>OpenCV Vision: Active</span>
            <span>Whisper NLP: Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
