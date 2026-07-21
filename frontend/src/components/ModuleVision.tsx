import React, { useState } from 'react';
import { Eye, Upload, Image as ImageIcon, CheckCircle, Cpu, Sparkles } from 'lucide-react';
import { analyzeInjuryImage } from '../services/api';

export const ModuleVision: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visionData, setVisionData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setVisionData(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const res = await analyzeInjuryImage(selectedFile);
      setVisionData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleImage = (type: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 400, 300);

      if (type === 'bleeding') {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(180, 140, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(150, 130, 80, 20);
      } else if (type === 'burn') {
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.ellipse(200, 150, 70, 40, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(100, 120, 200, 40);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], `sample_${type}.jpg`, { type: 'image/jpeg' });
          setSelectedFile(sampleFile);
          setPreviewUrl(URL.createObjectURL(sampleFile));
          setVisionData(null);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Intro Banner Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0 shadow-glow-blue">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Injury Visual Analyzer (OpenCV Computer Vision)</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Upload an image of an injury (burn, laceration, swelling). The computer vision engine highlights affected regions with bounding box overlays and classifies severity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
          <Cpu className="w-5 h-5 text-blue-400" />
          <div className="text-xs">
            <span className="text-slate-400 block font-mono">Computer Vision Status</span>
            <span className="text-blue-400 font-bold font-mono">OPENCV MODEL ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload & Quick Demo Pickers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center font-mono">1</span>
              <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider">Upload Injury Photo</h3>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-3xl p-6 text-center transition-all bg-slate-950/60 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Injury Preview"
                    className="max-h-56 mx-auto rounded-2xl object-cover border border-slate-800 shadow-md"
                  />
                  <span className="inline-block mt-3 text-xs text-slate-300 font-mono font-bold bg-slate-900 px-3.5 py-1 rounded-full border border-slate-800">
                    📷 {selectedFile?.name} (Ready for AI Scan)
                  </span>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 text-blue-400 flex items-center justify-center mx-auto border border-slate-800">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Click or Drag & Drop Injury Photo</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Sample Pickers */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Or test with instant demo scan:</label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => loadSampleImage('bleeding')}
                  className="py-3 px-2 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-bold rounded-2xl border border-slate-800 text-center transition-all"
                >
                  🩸 Bleeding
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleImage('burn')}
                  className="py-3 px-2 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-bold rounded-2xl border border-slate-800 text-center transition-all"
                >
                  🔥 Burn Injury
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleImage('fracture')}
                  className="py-3 px-2 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-bold rounded-2xl border border-slate-800 text-center transition-all"
                >
                  🦴 Deformity
                </button>
              </div>
            </div>

            {/* Analyze Trigger Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className={`w-full py-4.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedFile && !loading
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-glow-blue border border-blue-400/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {loading ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>Processing Computer Vision Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>ANALYZE INJURY IMAGE NOW</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Output Canvas & Clinical Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {visionData ? (
            <div className="glass-panel p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
              
              {/* Header Result */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Primary Vision Finding</span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {visionData.primary_injury}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Detection Confidence</span>
                  <span className="text-2xl font-black text-blue-400 font-mono">{visionData.overall_confidence}%</span>
                </div>
              </div>

              {/* Visual Bounding Box Canvas Overlay */}
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-2">OpenCV Bounding Box Visual Overlay</span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black max-h-72 flex items-center justify-center shadow-inner">
                  <img
                    src={visionData.annotated_image_url}
                    alt="Annotated Scan"
                    className="max-h-72 object-contain"
                  />
                </div>
              </div>

              {/* Detected Regions Breakdown */}
              <div>
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider block mb-3">Detected Wound Regions</span>
                <div className="space-y-2.5">
                  {visionData.all_detections.map((det: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-slate-100 block">{det.injury_type}</span>
                        <span className="text-slate-400 text-[11px]">{det.clinical_notes}</span>
                      </div>
                      <span className="font-mono text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-xl font-bold">
                        {det.confidence}% Confidence
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Instructions */}
              <div>
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider block mb-2">Targeted Care Recommendations</span>
                <ul className="space-y-2">
                  {visionData.recommended_treatment.map((t: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-slate-800 shadow-xl text-center flex flex-col items-center justify-center min-h-[440px] space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ImageIcon className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Upload Injury Photo</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Upload an image on the left or click a sample button to run computer vision detection and draw visual bounding boxes.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
