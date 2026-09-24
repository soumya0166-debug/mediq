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
  CheckCircle2,
  Calendar,
  Database,
  ArrowUpDown
} from 'lucide-react';

export const DoctorAuditLogPage: React.FC = () => {
  const { auditLogs } = useApp();
  
  // Section 37 Filters: User, Action, Date, Case
  const [filterUser, setFilterUser] = useState<string>('All');
  const [filterAction, setFilterAction] = useState<string>('All');
  const [searchCase, setSearchCase] = useState('');

  const usersList = ['All', 'Patient (Riya Das)', 'Dr. Ananya Sharma', 'CAREQ Ingestion Engine', 'CAREQ OCR Subsystem'];
  const actionsList = ['All', 'SUBMISSION', 'TRIAGE_PROCESSED', 'REVIEW_OPENED', 'FOLLOW_UP_REQUESTED', 'FOLLOW_UP_RESPONSE', 'CASE_REVIEWED'];

  const filteredLogs = auditLogs.filter(log => {
    // Search match by Case or general text
    const matchesSearch = 
      !searchCase ||
      (log.caseId && log.caseId.toLowerCase().includes(searchCase.toLowerCase())) ||
      log.action.toLowerCase().includes(searchCase.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchCase.toLowerCase()) ||
      log.details.toLowerCase().includes(searchCase.toLowerCase());

    if (!matchesSearch) return false;

    // Filter user
    if (filterUser !== 'All') {
      if (filterUser.includes('Patient') && log.actorRole !== 'Patient') return false;
      if (filterUser.includes('Dr.') && log.actorRole !== 'Healthcare Worker') return false;
      if (filterUser.includes('CAREQ') && !log.actorRole.includes('System')) return false;
    }

    // Filter action
    if (filterAction !== 'All') {
      if (!log.action.toUpperCase().includes(filterAction)) return false;
    }

    return true;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* Section 37: Header                                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            Governance & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Activity & Audit Trail (Section 37)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Immutable enterprise audit log recording all user access, AI extractions, clinician reviews, and data transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Audit Ledger Active (SHA-256)
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 37 Filters: User, Action, Date, Case                              */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Filter 1: User */}
          <div>
            <label className="text-slate-500 block text-[11px] font-medium mb-1">
              Filter User:
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
            >
              {usersList.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Action */}
          <div>
            <label className="text-slate-500 block text-[11px] font-medium mb-1">
              Filter Action:
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
            >
              {actionsList.map((a) => (
                <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Filter 3: Date */}
          <div>
            <label className="text-slate-500 block text-[11px] font-medium mb-1">
              Date Filter:
            </label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>24 Sep 2026 (Live Session)</span>
            </div>
          </div>

          {/* Filter 4: Case Search */}
          <div>
            <label className="text-slate-500 block text-[11px] font-medium mb-1">
              Case Reference:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchCase}
                onChange={(e) => setSearchCase(e.target.value)}
                placeholder="e.g. PAT-2026-00124 or CASE-991"
                className="w-full pl-8 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* Section 37: Timeline/Table Hybrid Display                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-teal-700" />
            Audit Ledger ({filteredLogs.length} Events)
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">
            Cryptographic Integrity Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 w-24">Time</th>
                <th className="py-3 px-4 w-44">User / Actor</th>
                <th className="py-3 px-4">Action & Operational Event</th>
                <th className="py-3 px-4 w-36">Case Ref</th>
                <th className="py-3 px-4 text-right w-32">Hash Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Time (Section 37 Example: 14:32) */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  {/* User / Actor (Section 37 Example: Patient, CAREQ, Dr. Sharma) */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {log.actorRole === 'Patient' && <User className="w-3.5 h-3.5 text-teal-600" />}
                      {log.actorRole === 'Healthcare Worker' && <Stethoscope className="w-3.5 h-3.5 text-blue-600" />}
                      {log.actorRole.includes('System') && <Cpu className="w-3.5 h-3.5 text-purple-600" />}
                      <span>{log.actor}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.actorRole}</span>
                  </td>

                  {/* Action & Details (Section 37 Example: Submitted symptoms, Processed voice, Opened case) */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {log.action}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {log.details}
                    </p>
                  </td>

                  {/* Case */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {log.caseId || 'GLOBAL'}
                  </td>

                  {/* Hash */}
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 text-right">
                    sha256:{log.id.slice(-6)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
