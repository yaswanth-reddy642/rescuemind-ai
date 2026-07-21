import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, ShieldAlert, Crosshair } from 'lucide-react';
import { fetchNearbyHospitals } from '../services/api';

export const ModuleHospitals: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 });
  const [hospitalData, setHospitalData] = useState<any>(null);

  useEffect(() => {
    // Attempt browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          loadHospitals(loc.lat, loc.lng);
        },
        () => {
          loadHospitals(37.7749, -122.4194);
        }
      );
    } else {
      loadHospitals(37.7749, -122.4194);
    }
  }, []);

  const loadHospitals = async (lat: number, lng: number) => {
    const data = await fetchNearbyHospitals(lat, lng);
    setHospitalData(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Hospital List & Hotlines */}
      <div className="lg:col-span-6 space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Emergency Trauma Finder</h2>
                <p className="text-xs text-slate-400">Nearby level-1 trauma centers & ER wait times</p>
              </div>
            </div>

            <button
              onClick={() => loadHospitals(userLocation.lat, userLocation.lng)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 flex items-center gap-1.5"
            >
              <Crosshair className="w-4 h-4 text-emerald-400" /> Relocate
            </button>
          </div>

          {/* Emergency Hotlines Cards */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {(hospitalData?.emergency_hotlines || [
              { label: 'National Dispatch', number: '911 / 112' },
              { label: 'Ambulance Hotline', number: '+1-800-555-0199' }
            ]).map((h: any, idx: number) => (
              <a
                key={idx}
                href={`tel:${h.number}`}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-xs flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="text-[10px] text-red-300 font-semibold block">{h.label}</span>
                  <span className="font-mono font-bold text-white text-xs">{h.number}</span>
                </div>
                <Phone className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>

          {/* Hospital Cards List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {hospitalData?.hospitals.map((h: any) => (
              <div key={h.id} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-white">{h.name}</h3>
                    <span className="text-[11px] text-slate-400">{h.type} • {h.address}</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded">
                    {h.distance_km} km ({h.eta_minutes} mins)
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="w-3.5 h-3.5" /> ER Wait: {h.er_wait_time}
                  </span>
                  {h.heliport && (
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                      Helipad Ready
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href={`tel:${h.phone}`}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Direct Dial
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${h.lat},${h.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-xs rounded-lg border border-blue-500/40 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-400" /> Map Directions
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Map Preview Panel */}
      <div className="lg:col-span-6 space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" /> Interactive Radar Map
            </h3>
            <span className="text-xs text-slate-400 font-mono">GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center p-4">
            {/* Visual Radar Map Simulation Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            
            <div className="relative text-center space-y-4">
              <div className="w-20 h-20 rounded-full border-2 border-red-500/40 bg-red-500/10 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>

              <div>
                <span className="font-bold text-white text-sm block">Active GPS Trauma Radius</span>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Found 4 high-capacity emergency centers within 5km of your coordinates. Click any hospital on the left for direct phone hotline or turn-by-turn navigation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
