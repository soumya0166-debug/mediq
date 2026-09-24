import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Facility } from '../../types';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  FileText, 
  Share2, 
  History, 
  Settings, 
  ShieldCheck, 
  Stethoscope, 
  Layers, 
  Sparkles,
  ChevronRight,
  LogOut,
  Building2,
  FileCheck,
  CheckCircle2,
  CheckSquare,
  HelpCircle,
  Shield,
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';

export const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentDoctor, 
    currentRoute, 
    navigate, 
    logout, 
    setDemoGuideOpen, 
    assessments, 
    currentFacility, 
    facilityId,
    switchFacility, 
    availableFacilities 
  } = useApp();

  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);

  const highPriorityCount = assessments.filter(a => a.riskLevel === 'HIGH' && a.status === 'WAITING_REVIEW').length;
  const waitingCount = assessments.filter(a => a.status === 'WAITING_REVIEW').length;
  const followUpCount = assessments.filter(a => a.followUpQuestions.some(q => q.status === 'ASKED')).length;
  const reviewedCount = assessments.filter(a => a.status === 'REVIEWED').length;
  const referralCount = assessments.filter(a => a.status === 'REFERRED').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR — CAREQ Section 11 Specification                         */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 bg-[#0A1E3F] text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        
        {/* Top: Facility Branding */}
        <div>
          {/* Section 11 Brand Header */}
          <div className="p-5 border-b border-slate-800/80">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate('/doctor/dashboard')}
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-xs">
                <Stethoscope className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                  CAREQ
                </span>
                <span className="text-[11px] font-medium text-teal-400 tracking-normal block">
                  Digital Health Triage
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links — Section 11 Architecture */}
          <nav className="p-3 space-y-4">
            
            {/* GROUP 1: WORKSPACE */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Workspace
              </div>

              {/* Dashboard */}
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/doctor/dashboard'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Dashboard</span>
                </div>
              </button>

              {/* Patient Queue */}
              <button
                onClick={() => navigate('/doctor/queue')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/doctor/queue' && !window.location.search.includes('filter=')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Patient Queue</span>
                </div>
                {waitingCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
                    {waitingCount}
                  </span>
                )}
              </button>

              {/* Priority Cases */}
              <button
                onClick={() => navigate('/doctor/queue?filter=HIGH')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=HIGH')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-red-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Priority Cases</span>
                </div>
                {highPriorityCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-900/80 border border-red-500/50 text-red-200">
                    {highPriorityCount}
                  </span>
                )}
              </button>

              {/* My Reviews */}
              <button
                onClick={() => navigate('/doctor/queue?filter=REVIEWED')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=REVIEWED')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                  <span>My Reviews</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{reviewedCount}</span>
              </button>

              {/* Follow-ups */}
              <button
                onClick={() => navigate('/doctor/queue?filter=WAITING')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=WAITING')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Follow-ups</span>
                </div>
                {followUpCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-200">
                    {followUpCount}
                  </span>
                )}
              </button>

              {/* Referrals */}
              <button
                onClick={() => navigate('/doctor/queue?filter=REFERRED')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=REFERRED')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-teal-400" />
                  <span>Referrals</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{referralCount}</span>
              </button>
            </div>

            {/* GROUP 2: HEALTH INFORMATION */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Health Information
              </div>

              {/* Health Timeline */}
              <button
                onClick={() => navigate('/doctor/queue')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Health Timeline</span>
                </div>
              </button>

              {/* Reports */}
              <button
                onClick={() => navigate('/doctor/reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/doctor/reports'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>Reports</span>
                </div>
              </button>

              {/* Consent */}
              <button
                onClick={() => navigate('/patient/consent')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Consent</span>
                </div>
              </button>
            </div>

            {/* GROUP 3: GOVERNANCE */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Governance
              </div>

              {/* Audit Log */}
              <button
                onClick={() => navigate('/doctor/audit-log')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/doctor/audit-log'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-teal-400" />
                  <span>Audit Log</span>
                </div>
              </button>

              {/* Facility Context / Switcher */}
              <div className="relative">
                <button
                  onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">Facility</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>

                {facilityDropdownOpen && (
                  <div className="p-2 mt-1 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs shadow-xl animate-in fade-in">
                    <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase">
                      Switch Facility (Section 40)
                    </div>
                    {availableFacilities.map((f: Facility) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          switchFacility(f.name, f.id);
                          setFacilityDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded text-[11px] transition-all flex items-center justify-between ${
                          facilityId === f.id
                            ? 'bg-teal-900/40 text-teal-300 font-bold border border-teal-600/30'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="truncate">
                          <div>{f.name}</div>
                          <div className="text-[9px] font-mono text-slate-500">{f.id}</div>
                        </div>
                        {facilityId === f.id && <span className="text-teal-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings / Evaluator Guide */}
              <button
                onClick={() => setDemoGuideOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Evaluation Guide</span>
                </div>
              </button>
            </div>

          </nav>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM: Verified Professional (Section 11 Spec)                          */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-[#081730]">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Verified Professional
            </span>
            <div className="font-bold text-sm text-white truncate">
              {currentDoctor?.name || 'Dr. Ananya Sharma'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Verified • NMC-84920</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate pt-0.5">
              {currentFacility || 'CAREQ Demo Primary Health Centre'}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              ID: {facilityId || 'FAC-DEMO-OD-001'}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};
