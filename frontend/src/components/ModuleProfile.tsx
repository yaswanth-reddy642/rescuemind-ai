import React, { useState } from 'react';
import { Plus, Trash2, LogIn, Mail, Lock } from 'lucide-react';

interface ModuleProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleProfile: React.FC<ModuleProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login'>('profile');
  const [fullName, setFullName] = useState<string>('Dr. Alex Vance');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [allergies, setAllergies] = useState<string>('Penicillin');
  const [conditions, setConditions] = useState<string>('Asthma');

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Sarah Vance', phone: '+1-555-0122', relationship: 'Spouse' },
    { id: '2', name: 'Dr. Marcus Vance', phone: '+1-555-0188', relationship: 'Primary Physician' }
  ]);

  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRel] = useState<string>('Family');

  if (!isOpen) return null;

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) return;
    setContacts([
      ...contacts,
      { id: Date.now().toString(), name: newContactName, phone: newContactPhone, relationship: newContactRel }
    ]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700/60 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header Tabs */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-slate-400'
              }`}
            >
              Medical Profile & Contacts
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-slate-400'
              }`}
            >
              Auth / Login
            </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-900 rounded-lg">
            ✕ Close
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-5">
            {/* Demographics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chronic Conditions</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Emergency Contacts Management */}
            <div>
              <span className="text-xs font-bold text-slate-200 block mb-2">Saved SOS Emergency Contacts</span>
              <div className="space-y-2 mb-3">
                {contacts.map((c) => (
                  <div key={c.id} className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-white block">{c.name} ({c.relationship})</span>
                      <span className="text-slate-400 text-[11px]">{c.phone}</span>
                    </div>
                    <button onClick={() => handleRemoveContact(c.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Contact Form */}
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="user@rescuemind.ai"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 p-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 p-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In with Email
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-500">Or use OAuth Identity Provider</span>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-2"
            >
              Sign In with Google Account
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
