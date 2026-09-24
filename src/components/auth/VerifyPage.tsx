import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PATIENTS, MOCK_DOCTORS } from '../../data/mockData';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1E3F] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
          Public Health Trust & Verification
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Credential & Identity Verification Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Cryptographic validation sandbox for patient identity tokens and medical practitioner licenses
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm">
        <form onSubmit={handleSearch} className="space-y-4 text-xs">
          <label className="block font-bold text-slate-700 uppercase tracking-wider">
            Search Patient ID, Phone, or Doctor Medical Council ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. PAT-2026-00124 or NMC/ORI/2015/084920"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-careq-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#0A1E3F]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white rounded-careq-sm font-bold transition-colors shadow-careq-xs flex items-center justify-center gap-1.5"
            >
              <span>Validate Record</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span>Quick test tokens:</span>
            <button
              type="button"
              onClick={() => { setQuery('PAT-2026-00124'); setSearchResult(MOCK_PATIENTS[0]); setSearchedType('patient'); }}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono text-teal-800"
            >
              PAT-2026-00124 (Riya Das)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('DOC-NMC-84920'); setSearchResult(MOCK_DOCTORS[0]); setSearchedType('doctor'); }}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[#0A1E3F]"
            >
              DOC-NMC-84920 (Dr. Ananya Sharma)
            </button>
          </div>
        </form>

        {/* Certificate Display */}
        {searchResult ? (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="bg-slate-50 rounded-careq-md p-5 border border-slate-200 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-careq-sm bg-emerald-700 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Verified Identity Certificate
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {searchResult.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 text-xs font-mono">
                  <span className="text-slate-400 block text-[10px]">CAREQ Token</span>
                  <span className="font-bold text-slate-900">{searchResult.id}</span>
                </div>
              </div>

              {searchedType === 'patient' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Language</span>
                    <span className="font-semibold text-slate-800">{searchResult.preferredLanguage}</span>
                  </div>
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Simulated Aadhaar</span>
                    <span className="font-semibold font-mono text-slate-800">XXXX-XXXX-{searchResult.demoAadhaarLast4}</span>
                  </div>
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Consent Status</span>
                    <span className="font-semibold text-emerald-700">🟢 Active Consent Signed</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Clinical Role</span>
                    <span className="font-semibold text-slate-800">{searchResult.role}</span>
                  </div>
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Medical Council ID</span>
                    <span className="font-semibold font-mono text-slate-800">{searchResult.medicalRegistrationId}</span>
                  </div>
                  <div className="bg-white p-3 rounded-careq-sm border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Facility</span>
                    <span className="font-semibold text-slate-800 truncate block">{searchResult.facility}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-200">
                <span className="font-mono text-[10px] text-slate-500">
                  SHA-256 Ledger Hash: 7f83b165...126d9069
                </span>
                <button
                  onClick={() => navigate(searchedType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard')}
                  className="font-bold text-[#0A1E3F] hover:underline"
                >
                  Open in {searchedType === 'patient' ? 'Patient Portal' : 'Clinical Queue'} →
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="mt-6 text-center p-6 bg-slate-50 rounded-careq-md border border-slate-200 text-slate-500 text-xs">
            No matching synthetic record found for "{query}".
          </div>
        )}

      </div>

    </div>
  );
};
