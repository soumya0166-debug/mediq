import React from 'react';
import { useApp } from '../../context/AppContext';
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
  FileCheck
} from 'lucide-react';

export const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDoctor, currentRoute, navigate, logout, setDemoGuideOpen, assessments } = useApp();

  const highPriorityCount = assessments.filter(a => a.riskLevel === 'HIGH' && a.status === 'WAITING_REVIEW').length;
  const waitingCount = assessments.filter(a => a.status === 'WAITING_REVIEW').length;

  const navItems = [
    { label: 'Dashboard', route: '/doctor/dashboard', icon: Activity },
    { label: 'Patient Queue', route: '/doctor/queue', icon: Clock, badge: waitingCount },
    { label: 'Priority Cases', route: '/doctor/queue?filter=HIGH', icon: AlertCircle, badge: highPriorityCount, badgeColor: 'bg-red-500 text-white' },
    { label: 'Lab OCR Vault', route: '/doctor/reports', icon: FileCheck },
    { label: 'Referrals Archive', route: '/doctor/queue?filter=REFERRED', icon: Share2 },
    { label: 'Audit Trail', route: '/doctor/audit-log', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* DESKTOP SIDEBAR (Section 13) */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        
        {/* Top: Facility Branding */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">
                  SwasthyaSetu
                </span>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">
                  Clinical Triage Hub
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinical Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section 13: Verified Healthcare Worker Profile Card */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          
          {/* Quick Judge Demo Trigger */}
          <button
            onClick={() => setDemoGuideOpen(true)}
            className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Judge Demo Walkthrough</span>
          </button>

          {/* Practitioner Credential Card */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Verified Clinician
              </span>
              <span className="text-[10px] text-slate-400 font-mono">11y exp</span>
            </div>
            
            <div className="font-extrabold text-sm text-white truncate">
              {currentDoctor?.name || 'Dr. Ananya Sharma'}
            </div>
            
            <div className="text-[11px] text-slate-300 truncate">
              {currentDoctor?.facility || 'Capital Hospital & CHC, Unit-6'}
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-400 font-medium">
              <span>✓ Professional ID Verified</span>
              <span className="font-mono text-slate-400">NMC-84920</span>
            </div>
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};
