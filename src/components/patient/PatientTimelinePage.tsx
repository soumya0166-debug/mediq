import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calendar, 
  Activity, 
  FileText, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export const PatientTimelinePage: React.FC = () => {
  const { currentPatient, assessments, navigate } = useApp();
  const { t } = useLanguage();

  const timelineEntries = [
    {
      date: '24 Sep',
      time: '10:42 AM',
      event: 'Multimodal Assessment Submitted',
      description: 'Acute fever, cough, and breathing discomfort recorded with Odia voice audio track.',
      source: 'Patient (Self-Report)',
      action: 'Structured Triage Note Synthesized',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      date: '24 Sep',
      time: '10:43 AM',
      event: 'CBC Report Attached & Processed',
      description: 'blood_report.pdf OCR parsed: WBC 14,200 /µL, Neutrophils 82%, ESR 38 mm/hr.',
      source: 'Central Diagnostic Lab',
      action: 'Parameters Verified by CAREQ OCR Engine',
      status: 'Processed',
      statusColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      date: '24 Sep',
      time: '10:45 AM',
      event: 'Clinical Case Opened for Review',
      description: 'Case workspace accessed by Dr. Ananya Sharma at CAREQ Demo PHC Jatni.',
      source: 'Dr. Ananya Sharma',
      action: 'Assigned to Urgent Clinical Queue',
      status: 'In Progress',
      statusColor: 'bg-amber-100 text-amber-800'
    },
    {
      date: '24 Sep',
      time: '10:47 AM',
      event: 'Clinician Follow-Up Inquiry Sent',
      description: 'Inquiry requested regarding pulse oximeter SpO2 reading and temperature grade.',
      source: 'Dr. Ananya Sharma',
      action: 'Awaiting Patient Response',
      status: 'Pending Reply',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      date: '18 Sep',
      time: '11:15 AM',
      event: 'General OPD Routine Consult',
      description: 'Routine follow-up consultation and vitals documentation.',
      source: 'PHC Staff Nurse',
      action: 'Clinical Consultation Complete',
      status: 'Archived',
      statusColor: 'bg-slate-100 text-slate-700'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="p-1.5 rounded-careq-sm border border-slate-200 text-slate-500 hover:text-slate-900 bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
            {t('nav.timeline')} • {t('patient.patientIdLabel')}: {currentPatient?.id}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1E3F] tracking-tight mt-0.5">
            {t('patient.timelinePageTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('patient.timelinePageSubtitle')}
          </p>
        </div>
      </div>

      {/* Timeline List (Section 39) */}
      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-xs space-y-6">
        
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineEntries.map((item, idx) => (
            <div key={idx} className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              
              {/* Dot */}
              <div className="absolute -left-[27px] w-5 h-5 rounded-full border-2 border-white bg-[#0A1E3F] flex items-center justify-center text-white text-[9px] font-bold shadow-careq-xs">
                {idx + 1}
              </div>

              {/* Event Body */}
              <div className="space-y-1 sm:max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {item.date} • {item.time}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.event}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed pt-0.5">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Source: <strong className="text-slate-700">{item.source}</strong></span>
                  <span>•</span>
                  <span>Action: <strong className="text-slate-700">{item.action}</strong></span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
