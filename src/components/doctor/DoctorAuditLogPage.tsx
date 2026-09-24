import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  Clock, 
  User, 
  Stethoscope, 
  Cpu, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const DoctorAuditLogPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterRole, setFilterRole] = useState<'All' | 'Patient' | 'Healthcare Worker' | 'System OCR' | 'System Triage'>('All');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.caseId && log.caseId.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterRole !== 'All' && log.actorRole !== filterRole) return false;
    return true;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Responsible AI & Compliance • Section 24
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            System Audit Trail & Immutable Event Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            End-to-end chronological record of patient submissions, speech-to-text processing, OCR extractions, and clinician actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Audit Ledger Active (SHA-256)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Patient', 'Healthcare Worker', 'System OCR', 'System Triage'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRole === role
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or case ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Audit Timeline List (Section 24) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-900" />
            Chronological Audit Log Entries ({filteredLogs.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Synthetic Verification Hash Enabled
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredLogs.map((log) => {
            const isPatient = log.actorRole === 'Patient';
            const isDoctor = log.actorRole === 'Healthcare Worker';
            const isSystem = log.actorRole.startsWith('System');

            return (
              <div key={log.id} className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                
                {/* Timeline Node Dot */}
                <div className={`absolute -left-[27px] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-[10px] text-white shadow-xs ${
                  isPatient ? 'bg-teal-600' :
                  isDoctor ? 'bg-blue-900' :
                  'bg-indigo-600'
                }`}>
                  {isPatient ? 'P' : isDoctor ? 'D' : 'S'}
                </div>

                {/* Event Details */}
                <div className="space-y-1 sm:max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {log.timestamp}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {log.action}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPatient ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                      isDoctor ? 'bg-blue-50 text-blue-900 border border-blue-200' :
                      'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    }`}>
                      {log.actorRole}
                    </span>
                    {log.caseId && (
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Case: {log.caseId}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed font-sans text-xs pt-0.5">
                    {log.details}
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Actor: <strong className="text-slate-600">{log.actor}</strong>
                  </div>
                </div>

                {/* Cryptographic hash badge */}
                <div className="sm:text-right font-mono text-[10px] text-slate-400 flex-shrink-0">
                  <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 block sm:inline">
                    {log.ipHash}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
