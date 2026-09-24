import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PATIENTS, MOCK_DOCTORS } from '../../data/mockData';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileBadge, 
  User, 
  Stethoscope, 
  Lock,
  ArrowRight
} from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const { navigate } = useApp();
  const [query, setQuery] = useState('PAT-2026-00124');
  const [searchResult, setSearchResult] = useState<any>(MOCK_PATIENTS[0]);
  const [searchedType, setSearchedType] = useState<'patient' | 'doctor'>('patient');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    
    // Check patients
    const patientFound = MOCK_PATIENTS.find(p => p.id.toUpperCase() === clean || p.phone.includes(clean) || p.name.toUpperCase().includes(clean));
    if (patientFound) {
      setSearchResult(patientFound);
      setSearchedType('patient');
      return;
    }

    // Check doctors
    const doctorFound = MOCK_DOCTORS.find(d => d.id.toUpperCase() === clean || d.medicalRegistrationId.toUpperCase().includes(clean) || d.name.toUpperCase().includes(clean));
    if (doctorFound) {
      setSearchResult(doctorFound);
      setSearchedType('doctor');
      return;
    }

    setSearchResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          Trust & Identity Verification Sandbox
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Health Credential & Identity Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Simulated cryptographic ledger for patient identity verification and medical practitioner license validation
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Synthetic Trust Architecture:</strong>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            All records displayed in this sandbox are synthetic demonstration tokens. Real Aadhaar numbers, biometric vaults, 
            and state medical registers are not connected to protect privacy and comply with competition guidelines.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Search Synthetic Patient ID, Phone, or Doctor Registration
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. PAT-2026-00124 or NMC/ORI/2015/084920"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono tracking-wide text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Validate Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
            <span>Quick test tokens:</span>
            <button
              type="button"
              onClick={() => { setQuery('PAT-2026-00124'); setSearchResult(MOCK_PATIENTS[0]); setSearchedType('patient'); }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono text-[11px] text-teal-800"
            >
              PAT-2026-00124 (Riya Das)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('DOC-NMC-84920'); setSearchResult(MOCK_DOCTORS[0]); setSearchedType('doctor'); }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono text-[11px] text-blue-900"
            >
              DOC-NMC-84920 (Dr. Ananya Sharma)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('PAT-2026-00125'); setSearchResult(MOCK_PATIENTS[1]); setSearchedType('patient'); }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono text-[11px] text-teal-800"
            >
              PAT-2026-00125 (Amit Kumar)
            </button>
          </div>
        </form>

        {/* Certificate Display */}
        {searchResult ? (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 rounded-2xl p-6 border-2 border-emerald-300 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Verified Identity Certificate
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {searchResult.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4">
                  <div className="text-[11px] text-slate-500 font-mono">Ledger ID</div>
                  <div className="text-xs font-mono font-bold text-slate-800">{searchResult.id}</div>
                </div>
              </div>

              {searchedType === 'patient' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Language</span>
                    <span className="font-semibold text-slate-800">{searchResult.preferredLanguage}</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Simulated Aadhaar Token</span>
                    <span className="font-semibold text-slate-800 font-mono">XXXX-XXXX-{searchResult.demoAadhaarLast4}</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consent Status</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Accredited Role</span>
                    <span className="font-semibold text-slate-800">{searchResult.role}</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Number</span>
                    <span className="font-semibold text-slate-800 font-mono">{searchResult.medicalRegistrationId}</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hospital Facility</span>
                    <span className="font-semibold text-slate-800 truncate block">{searchResult.facility}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-emerald-200">
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </span>
                <button
                  onClick={() => navigate(searchedType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard')}
                  className="font-bold text-blue-900 hover:text-blue-950 underline"
                >
                  Open in {searchedType === 'patient' ? 'Patient Portal' : 'Doctor Queue'} →
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="mt-8 text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No matching synthetic record found for "{query}". Try one of the test tokens above.
          </div>
        )}

      </div>

    </div>
  );
};
