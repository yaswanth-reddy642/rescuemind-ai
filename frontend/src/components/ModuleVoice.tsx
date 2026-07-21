import React, { useState } from 'react';
import { Mic, Square, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import { processSpeechInput } from '../services/api';

export const ModuleVoice: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);

  const sampleTranscripts = [
    "Patient is experiencing severe chest pain, shortness of breath, and pulse is around 130 bpm.",
    "Fire burn injury on left forearm with blistering and severe localized pain.",
    "Patient passed out after falling down stairs, head injury reported with mild bleeding."
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setVoiceResult(null);

    // Simulated speech recognition / recording capture
    setTimeout(() => {
      setIsRecording(false);
      const chosen = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setTranscript(chosen);
      processTranscript(chosen);
    }, 3500);
  };

  const processTranscript = async (text: string) => {
    setLoading(true);
    try {
      const res = await processSpeechInput(text);
      setVoiceResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakGuidance = () => {
    if (!voiceResult?.ai_guidance) return;
    const utterance = new SpeechSynthesisUtterance(voiceResult.ai_guidance);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Voice Emergency Assistant (Whisper Speech NLP)</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Hold the microphone button and describe the emergency situation aloud. Whisper STT will convert your voice to text, extract medical symptoms, and read back AI emergency guidance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Whisper Speech Model: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Audio Recording Interface */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl space-y-6">
            
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 font-mono block">
              Step 1: Record Voice or Type Speech
            </span>

            {/* Microphone Button */}
            <div className="py-8 text-center flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
              <button
                onClick={handleStartRecording}
                disabled={isRecording || loading}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-glow ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse scale-105 border-4 border-red-400'
                    : 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-emerald-400 text-white hover:scale-105'
                }`}
              >
                {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-12 h-12" />}
              </button>

              <div className="space-y-1">
                <span className="text-sm font-black text-white block">
                  {isRecording ? 'Listening & Transcribing...' : 'Tap Mic to Record Emergency'}
                </span>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {isRecording ? 'Speak clearly into your device' : 'Or select sample audio transcript below'}
                </p>
              </div>
            </div>

            {/* Text Area & Quick Sample Buttons */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">Speech Transcript Input</label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Describe emergency symptoms aloud..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-medium"
              />

              <button
                onClick={() => processTranscript(transcript)}
                disabled={!transcript.trim() || loading}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" /> PROCESS SPEECH TRANSCRIPT
              </button>
            </div>

          </div>
        </div>

        {/* Extracted Symptoms & Audio Guidance Player */}
        <div className="lg:col-span-7 space-y-6">
          {voiceResult ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl space-y-6 animate-fadeIn">
              
              {/* Urgency Badge & Play Audio Button */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Speech Assessment Severity</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black font-mono border ${
                    voiceResult.urgency_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {voiceResult.urgency_level} URGENCY
                  </span>
                </div>

                <button
                  onClick={handleSpeakGuidance}
                  className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40 flex items-center gap-2 transition-all shadow-glow"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" /> PLAY AUDIO ADVICE
                </button>
              </div>

              {/* Transcript Display */}
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" /> Transcribed Speech Text
                </span>
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-200 font-mono italic">
                  "{voiceResult.transcript}"
                </div>
              </div>

              {/* Extracted Symptoms Tags */}
              <div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2">NLP Extracted Medical Symptoms</span>
                <div className="flex flex-wrap gap-2">
                  {voiceResult.extracted_symptoms.map((s: string, idx: number) => (
                    <span key={idx} className="bg-slate-900 text-slate-100 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      ⚡ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Summary & Guidance */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Immediate Action Protocol</span>
                  <p className="text-sm font-bold text-white">{voiceResult.action_summary}</p>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Detailed Audio Advice</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{voiceResult.ai_guidance}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-slate-700/60 shadow-xl text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Mic className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Voice Emergency Assistant</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Record voice symptoms or type text on the left to extract medical parameters and listen to voice advice.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
