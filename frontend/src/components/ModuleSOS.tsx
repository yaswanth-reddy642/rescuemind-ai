import React, { useState } from 'react';
import { AlertTriangle, Send, X, CheckCircle2, MapPin, PhoneCall } from 'lucide-react';
import { triggerSOSAlert } from '../services/api';

interface ModuleSOSProps {
  isOpen: boolean;
  onClose: () => void;
  triageSummary?: any;
}

export const ModuleSOS: React.FC<ModuleSOSProps> = ({ isOpen, onClose, triageSummary }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<any>(null);

  if (!isOpen) return null;

  const handleSendSOS = async () => {
    setLoading(true);
    const payload = {
      user_name: "Emergency User",
      user_phone: "+1-555-0199",
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco Emergency Zone",
      priority: triageSummary?.priority || "RED",
      medical_summary: triageSummary?.priority_label || "Immediate Triage Assessment Dispatch",
      contacts: [
        { name: "Dr. Sarah Jenkins", phone: "+1-800-555-0199", relationship: "Primary Doctor" },
        { name: "Family Response", phone: "+1-555-0144", relationship: "Emergency Contact" }
      ]
    };

    try {
      const res = await triggerSOSAlert(payload);
      setDispatchReceipt(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-red-500/50 shadow-glow space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-glow animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">EMERGENCY SOS DISPATCH</h2>
            <p className="text-xs text-slate-400">Broadcast distress payload to contacts & dispatch</p>
          </div>
        </div>

        {dispatchReceipt ? (
          <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>SOS ALERT DISPATCHED!</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {dispatchReceipt.distress_message}
            </p>

            <div className="border-t border-slate-800 pt-2 text-xs text-slate-400">
              <span>Recipients Notified: <strong>{dispatchReceipt.recipients_notified} contacts</strong></span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg border border-slate-700"
            >
              Close Confirmation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> GPS Location:
                </span>
                <span className="font-mono text-[11px] text-slate-400">37.7749, -122.4194</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" /> Contacts:
                </span>
                <span className="font-mono text-[11px] text-slate-400">2 Contacts Loaded</span>
              </div>
            </div>

            <button
              onClick={handleSendSOS}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-xl shadow-glow tracking-wider uppercase flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              {loading ? (
                <span>Broadcasting GPS Signal...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Confirm & Send Immediate SOS
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
