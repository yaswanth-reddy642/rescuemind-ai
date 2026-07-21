import React, { useState } from 'react';
import { Activity, Heart, Wind, FileDown, Send, CheckCircle2, Info, ShieldAlert, Cpu, AlertTriangle, Stethoscope, User, Sparkles } from 'lucide-react';
import { submitTriageAssessment } from '../services/api';
import { generateEmergencyPDF } from '../services/pdfGenerator';
import type { TriageOutput } from '../services/offlineTriage';

interface ModuleAssessmentProps {
  onTriggerSOS: (triageData: any) => void;
}

export const ModuleAssessment: React.FC<ModuleAssessmentProps> = ({ onTriggerSOS }) => {
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState<string>('Male');
  const [pulse, setPulse] = useState<number>(115);
  const [breathingRate, setBreathingRate] = useState<number>(26);
  const [consciousness, setConsciousness] = useState<string>('alert');
  const [bleedingLevel, setBleedingLevel] = useState<string>('moderate');
  const [injuryType] = useState<string>('Deep Laceration / Trauma');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Chest Pain', 'Shortness of breath']);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TriageOutput | null>(null);

  const availableSymptoms = [
    { label: '🫀 Chest Pain', value: 'Chest Pain' },
    { label: '🫁 Hard to Breathe', value: 'Shortness of breath' },
    { label: '🩸 Severe Bleeding', value: 'Severe bleeding' },
    { label: '💤 Unconscious / Fainted', value: 'Loss of consciousness' },
    { label: '🧠 Head Injury', value: 'Head injury' },
    { label: '🦴 Broken Bone', value: 'Fracture deformity' },
    { label: '🔥 Thermal Burn', value: 'Thermal burn' },
    { label: '💫 Dizzy / Faint', value: 'Dizziness' }
  ];

  const consciousnessOptions = [
    { label: 'Awake & Alert', val: 'alert', desc: 'Patient responds normally' },
    { label: 'Responds to Voice', val: 'voice', desc: 'Disoriented / Lethargic' },
    { label: 'Responds to Pain', val: 'pain', desc: 'Responds only to painful stimuli' },
    { label: 'Unresponsive', val: 'unresponsive', desc: 'No response to stimuli' }
  ];

  const bleedingOptions = [
    { label: 'No Bleeding', val: 'none', desc: 'Skin is intact' },
    { label: 'Light Bleeding', val: 'mild', desc: 'Minor cut or abrasion' },
    { label: 'Active Bleeding', val: 'moderate', desc: 'Continuous blood flow' },
    { label: 'Severe Arterial', val: 'arterial', desc: 'Gushing / Rapid blood loss' }
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAssess = async () => {
    setLoading(true);
    const payload = {
      age,
      gender,
      symptoms: selectedSymptoms,
      injury_type: injuryType,
      pulse,
      breathing_rate: breathingRate,
      consciousness,
      bleeding_level: bleedingLevel
    };

    try {
      const res = await submitTriageAssessment(payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    generateEmergencyPDF({
      age,
      gender,
      symptoms: selectedSymptoms,
      pulse,
      breathing_rate: breathingRate,
      consciousness,
      bleeding_level: bleedingLevel,
      priority: result.priority,
      risk_percent: result.survival_risk_percent,
      confidence: result.confidence_score,
      reasoning: result.reasoning_factors,
      first_aid: result.recommended_first_aid
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Platform Banner Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white flex items-center justify-center shadow-glow-red shrink-0 border border-red-400/40">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500/20 text-red-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-wider">
                  START Triage Clinical Protocol
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">AI Emergency Assessment & Decision Engine</h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Input physiological parameters below. The AI triage engine evaluates pulse, respiration, consciousness, bleeding severity, and symptoms to predict emergency priority and survival risk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 block font-mono">Triage Engine Status</span>
              <span className="text-emerald-400 font-bold">READY (ESI Verified)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intake Wizard */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-7 rounded-3xl border border-slate-800 shadow-xl space-y-7">
            
            {/* Step 1: Demographics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center font-mono">1</span>
                <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider">Patient Demographics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-red-400" /> Patient Age (Years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-black focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-black focus:outline-none focus:border-red-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Vitals Sliders */}
            <div className="border-t border-slate-800/80 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center font-mono">2</span>
                <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider">Vital Signs (Pulse & Breathing)</h3>
              </div>

              {/* Pulse Rate Slider */}
              <div className="space-y-2 mb-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 animate-pulse" /> Heart Pulse Rate
                  </label>
                  <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border ${
                    pulse > 120 || pulse < 45 ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {pulse} BPM {pulse > 120 ? '(CRITICAL HIGH)' : pulse < 45 ? '(CRITICAL LOW)' : '(NORMAL)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Breathing Rate Slider */}
              <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-400" /> Respiration / Breathing Rate
                  </label>
                  <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border ${
                    breathingRate > 30 || breathingRate < 10 ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {breathingRate} BPM {breathingRate > 30 ? '(TACHYPNEA)' : breathingRate === 0 ? '(APNEA)' : '(NORMAL)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={breathingRate}
                  onChange={(e) => setBreathingRate(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Step 3: Consciousness & Bleeding */}
            <div className="border-t border-slate-800/80 pt-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center font-mono">3</span>
                <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider">Consciousness & Bleeding</h3>
              </div>

              {/* Consciousness Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Consciousness Level (AVPU Scale)</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {consciousnessOptions.map((c) => (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setConsciousness(c.val)}
                      className={`p-3.5 rounded-2xl text-left transition-all border ${
                        consciousness === c.val
                          ? 'bg-red-600 text-white border-red-400 shadow-glow-red'
                          : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-extrabold text-xs block">{c.label}</span>
                      <span className="text-[11px] opacity-80 block mt-0.5">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bleeding Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Bleeding Severity Level</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {bleedingOptions.map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setBleedingLevel(b.val)}
                      className={`p-3.5 rounded-2xl text-left transition-all border ${
                        bleedingLevel === b.val
                          ? 'bg-red-600 text-white border-red-400 shadow-glow-red'
                          : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-extrabold text-xs block">{b.label}</span>
                      <span className="text-[11px] opacity-80 block mt-0.5">{b.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Symptoms Selectors */}
            <div className="border-t border-slate-800/80 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center font-mono">4</span>
                <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider">Presenting Symptoms</h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {availableSymptoms.map((sym) => {
                  const active = selectedSymptoms.includes(sym.value);
                  return (
                    <button
                      key={sym.value}
                      type="button"
                      onClick={() => toggleSymptom(sym.value)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all border text-left ${
                        active
                          ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm'
                          : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {active ? '✅ ' : '➕ '} {sym.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleAssess}
              disabled={loading}
              className="w-full py-4.5 bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-glow-red transition-all flex items-center justify-center gap-3 active:scale-98 border border-red-400/40"
            >
              {loading ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>Computing AI Clinical Triage...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                  <span>PREDICT EMERGENCY TRIAGE PRIORITY</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: AI Triage Outcome Card */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="glass-panel p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-7 animate-fadeIn">
              
              {/* Outcome Banner */}
              <div className={`p-7 rounded-3xl border flex flex-col items-center text-center space-y-4 shadow-xl ${
                result.priority === 'RED'
                  ? 'bg-red-950/90 border-red-500 text-white shadow-glow-red'
                  : result.priority === 'ORANGE'
                  ? 'bg-amber-950/90 border-amber-500 text-white'
                  : result.priority === 'YELLOW'
                  ? 'bg-yellow-950/90 border-yellow-500 text-white'
                  : 'bg-emerald-950/90 border-emerald-500 text-white'
              }`}>
                <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center border border-white/20">
                  <AlertTriangle className="w-12 h-12 text-white animate-bounce" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest block opacity-80 mb-1">
                    AI Clinical Triage Rating
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-wide">
                    {result.priority_label}
                  </h3>
                  <p className="text-xs opacity-90 mt-1 max-w-md mx-auto font-medium leading-relaxed">
                    {result.triage_category_description}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/20 text-xs font-mono font-bold">
                    Survival Risk: <span className="text-red-400 font-black text-sm">{result.survival_risk_percent}%</span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/20 text-xs font-mono font-bold">
                    AI Confidence: <span className="text-emerald-300 font-black text-sm">{result.confidence_score}%</span>
                  </div>
                </div>
              </div>

              {/* Explainable Reasoning */}
              <div>
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" /> Explainable AI Decision Reasoning
                </h4>
                <div className="space-y-3">
                  {result.reasoning_factors.map((rf, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {rf.factor}
                        </span>
                        <span className="text-red-400 font-mono bg-red-500/10 px-2.5 py-0.5 rounded-lg border border-red-500/20">
                          {rf.weight} Risk Contribution
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed pl-4">{rf.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* First Aid Instructions */}
              <div>
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Immediate First Aid Instructions
                </h4>
                <div className="space-y-3">
                  {result.recommended_first_aid.map((fa, idx) => (
                    <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-black flex items-center justify-center shrink-0 border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-extrabold text-slate-100 block mb-0.5">{fa.step}</span>
                        <p className="text-slate-400 leading-relaxed text-[11px]">{fa.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleDownloadPDF}
                  className="py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <FileDown className="w-4 h-4 text-blue-400" /> Download PDF Report
                </button>

                <button
                  onClick={() => onTriggerSOS(result)}
                  className="py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow-red border border-red-400/40"
                >
                  <Send className="w-4 h-4" /> DISPATCH SOS ALERT
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-slate-800 shadow-xl text-center flex flex-col items-center justify-center min-h-[520px] space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Awaiting Intake Parameters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Select patient pulse, breathing rate, consciousness level, and symptoms on the left. Then click <strong className="text-red-400">PREDICT EMERGENCY TRIAGE PRIORITY</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
